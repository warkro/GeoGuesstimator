import { useEffect, useMemo, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import './App.css'
import { MapBoard } from './components/MapBoard'
import { ActionButton, CardSurface, CommandPanel, DataTile, DataTileGrid, StatusPill } from './components/ui'
import { roundAssetByKey } from './game/rounds'
import type { Coordinates } from './game/scoring'
import type { SessionAuthResponse, SessionPlayer, SessionRevealResult, SessionSnapshot } from '../shared/multiplayer'

type Identity = {
  code: string
  playerId: string
  name: string
}

const STORAGE_KEY = 'geoguesstimator.multiplayer.identity'
const INVALID_SESSION_MESSAGE = 'Session credentials are no longer valid.'

function App() {
  const [identity, setIdentity] = useState<Identity | null>(() => loadIdentity())
  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(null)
  const [connectionLabel, setConnectionLabel] = useState<'Offline' | 'Connecting' | 'Live'>('Offline')
  const [errorMessage, setErrorMessage] = useState('')
  const [hostName, setHostName] = useState('')
  const [joinName, setJoinName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [guess, setGuess] = useState<Coordinates | null>(null)
  const [selectedSituationIndex, setSelectedSituationIndex] = useState<number | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const snapshotMetaRef = useRef<Pick<SessionSnapshot, 'code' | 'phase' | 'roundIndex'> | null>(null)

  useEffect(() => {
    if (!identity) {
      return
    }

    const nextSocket = io({
      auth: {
        code: identity.code,
        playerId: identity.playerId,
      },
    })

    socketRef.current = nextSocket

    nextSocket.on('connect', () => {
      setConnectionLabel('Live')
      setErrorMessage('')
    })

    nextSocket.on('disconnect', () => {
      setConnectionLabel('Offline')
    })

    nextSocket.on('connect_error', (error) => {
      if (error.message === INVALID_SESSION_MESSAGE) {
        clearIdentity()
        setIdentity(null)
        setSnapshot(null)
        snapshotMetaRef.current = null
        setErrorMessage('Your saved room is no longer available. Create a new room or join again with a fresh session code.')
        setConnectionLabel('Offline')
        return
      }

      setErrorMessage(getSocketErrorMessage(error.message))
      setConnectionLabel('Offline')
    })

    nextSocket.on('session:error', (message: string) => {
      setErrorMessage(message)
    })

    nextSocket.on('session:snapshot', (nextSnapshot: SessionSnapshot) => {
      const previousSnapshot = snapshotMetaRef.current

      if (
        !previousSnapshot ||
        previousSnapshot.code !== nextSnapshot.code ||
        previousSnapshot.phase !== nextSnapshot.phase ||
        previousSnapshot.roundIndex !== nextSnapshot.roundIndex
      ) {
        setGuess(null)
        setSelectedSituationIndex(null)
      }

      snapshotMetaRef.current = {
        code: nextSnapshot.code,
        phase: nextSnapshot.phase,
        roundIndex: nextSnapshot.roundIndex,
      }
      setSnapshot(nextSnapshot)
      setErrorMessage('')
    })

    return () => {
      if (socketRef.current === nextSocket) {
        socketRef.current = null
      }
      nextSocket.disconnect()
    }
  }, [identity])

  const me = useMemo(
    () => snapshot?.leaderboard.find((player) => player.id === identity?.playerId) ?? null,
    [identity?.playerId, snapshot?.leaderboard],
  )

  const currentRound = snapshot?.currentRound ?? null
  const currentImageSrc = currentRound ? roundAssetByKey[currentRound.imageKey] : null
  const isLobby = snapshot?.phase === 'lobby'
  const isGuessing = snapshot?.phase === 'guessing'
  const isReveal = snapshot?.phase === 'reveal'
  const isComplete = snapshot?.phase === 'complete'
  const isHost = Boolean(me?.isHost)
  const hasSubmitted = Boolean(me?.submittedRound)
  const myRevealResult = useMemo(
    () => snapshot?.revealResults.find((result) => result.playerId === identity?.playerId) ?? null,
    [identity?.playerId, snapshot?.revealResults],
  )

  const phaseLabel = useMemo(() => {
    if (!snapshot) {
      return 'Joining session'
    }

    switch (snapshot.phase) {
      case 'lobby':
        return 'Lobby'
      case 'guessing':
        return 'Guessing live'
      case 'reveal':
        return 'Round reveal'
      case 'complete':
        return 'Final leaderboard'
      default:
        return 'Live session'
    }
  }, [snapshot])

  const heroStats = useMemo(
    () => [
      { label: 'Session', value: snapshot?.code ?? 'Not connected' },
      {
        label: 'Round',
        value: snapshot ? `${Math.min(snapshot.roundIndex + 1, snapshot.totalRounds)} / ${snapshot.totalRounds}` : '0 / 0',
      },
      {
        label: 'Players',
        value: snapshot ? `${snapshot.playerCount}` : '0',
        tone: 'accent' as const,
      },
    ],
    [snapshot],
  )

  const selectedAnswerLabel =
    currentRound && myRevealResult && myRevealResult.selectedSituationIndex !== null
      ? currentRound.situationOptions[myRevealResult.selectedSituationIndex] ?? 'No answer'
      : 'No answer'

  const correctAnswerLabel =
    currentRound?.correctSituationIndex !== undefined
      ? currentRound.situationOptions[currentRound.correctSituationIndex] ?? 'Unavailable'
      : 'Hidden until reveal'

  const canSubmit = Boolean(isGuessing && !hasSubmitted && guess && selectedSituationIndex !== null)

  const handleGuessSelect = (coordinates: Coordinates) => {
    if (!isGuessing || hasSubmitted) {
      return
    }

    setGuess(coordinates)
  }

  const handleCreateSession = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      setConnectionLabel('Connecting')
      const response = await postJson<SessionAuthResponse>('/api/sessions', { name: hostName })
      const nextIdentity = { code: response.code, playerId: response.playerId, name: hostName.trim() }
      persistIdentity(nextIdentity)
      setIdentity(nextIdentity)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create session.')
    }
  }

  const handleJoinSession = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      setConnectionLabel('Connecting')
      const normalizedCode = joinCode.trim().toUpperCase()
      const response = await postJson<SessionAuthResponse>(`/api/sessions/${normalizedCode}/join`, { name: joinName })
      const nextIdentity = { code: response.code, playerId: response.playerId, name: joinName.trim() }
      persistIdentity(nextIdentity)
      setIdentity(nextIdentity)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to join session.')
    }
  }

  const handleSubmitRound = () => {
    if (!socketRef.current || !guess || selectedSituationIndex === null) {
      return
    }

    socketRef.current.emit('round:submit', {
      guess,
      selectedSituationIndex,
    })
  }

  const handleLeaveSession = () => {
    clearIdentity()
    setIdentity(null)
    setSnapshot(null)
    snapshotMetaRef.current = null
    setErrorMessage('')
    setConnectionLabel('Offline')
  }

  if (!identity) {
    return (
      <main className="app-shell">
        <CommandPanel
          eyebrow="Hosted Multiplayer MVP"
          title="GeoGuesstimator live rooms"
          description="Create a host-controlled room, share a short join code, and play the existing round pack as a synchronized multiplayer session with server-authoritative scoring."
          stats={heroStats}
        />

        <section className="auth-grid">
          <CardSurface eyebrow="Host flow" title="Create a session" meta={<StatusPill tone="accent">Host</StatusPill>}>
            <form className="session-form" onSubmit={handleCreateSession}>
              <label className="field" htmlFor="host-name">
                <span>Your host name</span>
                <input
                  id="host-name"
                  className="text-input"
                  value={hostName}
                  onChange={(event) => setHostName(event.target.value)}
                  placeholder="Avery"
                  maxLength={24}
                />
              </label>
              <ActionButton type="submit" disabled={!hostName.trim()}>
                Create room
              </ActionButton>
            </form>
          </CardSurface>

          <CardSurface eyebrow="Player flow" title="Join a session" meta={<StatusPill tone="cool">Player</StatusPill>}>
            <form className="session-form" onSubmit={handleJoinSession}>
              <label className="field" htmlFor="join-name">
                <span>Your player name</span>
                <input
                  id="join-name"
                  className="text-input"
                  value={joinName}
                  onChange={(event) => setJoinName(event.target.value)}
                  placeholder="Jordan"
                  maxLength={24}
                />
              </label>
              <label className="field" htmlFor="join-code">
                <span>Session code</span>
                <input
                  id="join-code"
                  className="text-input code-input"
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                  placeholder="AB12C"
                  maxLength={5}
                />
              </label>
              <ActionButton type="submit" disabled={!joinName.trim() || joinCode.trim().length < 5}>
                Join room
              </ActionButton>
            </form>
          </CardSurface>
        </section>

        {errorMessage ? <p className="notice">{errorMessage}</p> : null}
      </main>
    )
  }

  if (!snapshot) {
    return (
      <main className="app-shell">
        <CommandPanel
          eyebrow="Hosted Multiplayer MVP"
          title="Rejoining live session"
          description="The client is reconnecting to the authoritative room state. If the room was closed, leave and create or join a new session."
          stats={heroStats}
        />
        <CardSurface eyebrow="Connection" title={connectionLabel} meta={<StatusPill>{connectionLabel}</StatusPill>}>
          <p className="feedback-copy">{errorMessage || 'Waiting for the server snapshot...'}</p>
          <div className="map-actions">
            <ActionButton variant="secondary" onClick={handleLeaveSession}>
              Leave session
            </ActionButton>
          </div>
        </CardSurface>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <CommandPanel
        eyebrow="Hosted Multiplayer MVP"
        title={isComplete ? 'Final room leaderboard' : isLobby ? 'Waiting room' : 'Live multiplayer round'}
        description={getPhaseDescription(snapshot, me, connectionLabel)}
        stats={heroStats}
      />

      {errorMessage ? <p className="notice">{errorMessage}</p> : null}

      {isLobby ? (
        <section className="play-surface play-surface-lobby">
          <CardSurface eyebrow="Session" title={`Room ${snapshot.code}`} meta={<StatusPill tone="accent">{phaseLabel}</StatusPill>}>
            <DataTileGrid aria-label="Lobby status">
              <DataTile label="Host" value={snapshot.leaderboard.find((player) => player.isHost)?.name ?? 'Unknown'} />
              <DataTile label="Players" value={snapshot.playerCount} tone="cool" />
              <DataTile label="Connection" value={connectionLabel} />
            </DataTileGrid>
            <div className="lobby-copy">
              <p>Share the code with players, then start when everyone is ready.</p>
            </div>
            <div className="map-actions">
              {isHost ? <ActionButton onClick={() => socketRef.current?.emit('session:start')}>Start game</ActionButton> : null}
              <ActionButton variant="secondary" onClick={handleLeaveSession}>
                Leave session
              </ActionButton>
            </div>
          </CardSurface>

          <CardSurface eyebrow="Roster" title="Players in room" meta={<StatusPill tone="cool">Live roster</StatusPill>}>
            <div className="player-list" aria-label="Session players">
              {snapshot.leaderboard.map((player) => (
                <PlayerRow key={player.id} player={player} me={me} />
              ))}
            </div>
          </CardSurface>
        </section>
      ) : (
        <section className="play-surface">
          <CardSurface
            className="image-card"
            eyebrow="Photo round"
            title={currentRound?.title ?? 'Round in progress'}
            meta={<StatusPill tone={isReveal || isComplete ? 'accent' : 'cool'}>{phaseLabel}</StatusPill>}
          >
            {currentImageSrc ? (
              <img className="round-image" src={currentImageSrc} alt={`Photo clue for ${currentRound?.title ?? 'current round'}`} />
            ) : null}
            <p className="card-copy">{currentRound?.clue}</p>
            <DataTileGrid className="clue-metadata">
              <DataTile label="Hint" value={currentRound?.hint ?? 'Waiting'} />
              <DataTile label="Room" value={snapshot.code} />
              <DataTile
                label="Submitted"
                value={isGuessing ? `${snapshot.submittedCount} / ${snapshot.playerCount}` : `${snapshot.playerCount}`}
                tone="cool"
              />
            </DataTileGrid>

            {isReveal || isComplete ? (
              <div className="story-panel" aria-live="polite">
                <p className="eyebrow">Reveal</p>
                <h3>{currentRound?.locationName}</h3>
                <p className="result-story">{currentRound?.story}</p>
              </div>
            ) : null}
          </CardSurface>

          <CardSurface
            className="map-card"
            eyebrow="Challenge board"
            title={isComplete ? 'Round recap' : 'Submit your guess'}
            meta={
              <StatusPill tone={hasSubmitted ? 'cool' : 'default'}>
                {hasSubmitted ? 'Submitted' : guess ? `${guess.lat.toFixed(2)}°, ${guess.lng.toFixed(2)}°` : 'No pin placed'}
              </StatusPill>
            }
          >
            <div className="challenge-stack">
              <div className="session-banner">
                <div>
                  <p className="eyebrow">Live room</p>
                  <h3>{snapshot.code}</h3>
                </div>
                <div className="identity-meta">
                  <strong>{identity.name}</strong>
                  <span>{isHost ? 'Host controls enabled' : 'Player view'}</span>
                </div>
              </div>

              <div>
                <p className="map-guidance" id="map-guidance" aria-live="polite">
                  {getMapGuidance(snapshot, me)}
                </p>
                <MapBoard
                  guess={guess}
                  answer={isReveal || isComplete ? currentRound?.answer ?? null : null}
                  showAnswer={Boolean(isReveal || isComplete)}
                  disabled={!isGuessing || hasSubmitted}
                  onGuess={handleGuessSelect}
                  ariaLabel={`Guess map for ${currentRound?.title ?? 'current round'}`}
                  ariaDescribedBy="map-guidance"
                />
                <div className="map-actions">
                  <ActionButton onClick={handleSubmitRound} disabled={!canSubmit}>
                    Submit round
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    onClick={() => {
                      setGuess(null)
                      setSelectedSituationIndex(null)
                    }}
                    disabled={!isGuessing || hasSubmitted}
                  >
                    Reset local picks
                  </ActionButton>
                  {isHost && isGuessing ? (
                    <ActionButton variant="secondary" onClick={() => socketRef.current?.emit('round:reveal')} disabled={snapshot.submittedCount === 0}>
                      Reveal results
                    </ActionButton>
                  ) : null}
                  {isHost && isReveal ? (
                    <ActionButton variant="secondary" onClick={() => socketRef.current?.emit('round:advance')}>
                      Next round
                    </ActionButton>
                  ) : null}
                </div>
              </div>

              <div className="situation-panel" aria-live="polite">
                <div className="situation-header">
                  <div>
                    <p className="eyebrow">Challenge 2</p>
                    <h3>{currentRound?.situationPrompt}</h3>
                  </div>
                  <StatusPill tone={hasSubmitted ? 'cool' : isGuessing ? 'accent' : 'default'}>
                    {hasSubmitted ? 'Locked in' : isGuessing ? 'Choose one' : 'Closed'}
                  </StatusPill>
                </div>
                <div className="choice-list" role="list" aria-label="Situation answer choices">
                  {currentRound?.situationOptions.map((option, index) => {
                    const isSelected = selectedSituationIndex === index
                    const isCorrect = currentRound.correctSituationIndex === index && (isReveal || isComplete)
                    const isWrongSelection = myRevealResult?.selectedSituationIndex === index && !isCorrect
                    const className = [
                      'choice-button',
                      isSelected ? 'choice-button-selected' : '',
                      isCorrect ? 'choice-button-correct' : '',
                      isWrongSelection ? 'choice-button-incorrect' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')

                    return (
                      <button
                        key={option}
                        type="button"
                        className={className}
                        onClick={() => setSelectedSituationIndex(index)}
                        disabled={!isGuessing || hasSubmitted}
                        aria-pressed={isSelected}
                      >
                        <span className="choice-index">{String.fromCharCode(65 + index)}</span>
                        <span>{option}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="feedback-panel" aria-live="polite">
                {myRevealResult ? (
                  <>
                    <DataTileGrid className="result-breakdown-grid">
                      <DataTile label="Distance" value={formatDistance(myRevealResult.distanceKm)} />
                      <DataTile label="Map score" value={`${myRevealResult.locationPoints.toLocaleString()} pts`} />
                      <DataTile label="Story score" value={`${myRevealResult.situationPoints.toLocaleString()} pts`} tone="cool" />
                      <DataTile label="Round total" value={`${myRevealResult.totalPoints.toLocaleString()} pts`} tone="accent" />
                    </DataTileGrid>
                    <div className="result-answer-grid">
                      <p>
                        <strong>Your pick:</strong> {selectedAnswerLabel}
                      </p>
                      <p>
                        <strong>Correct answer:</strong> {correctAnswerLabel}
                      </p>
                      <p>
                        <strong>Running total:</strong> {me?.totalScore.toLocaleString() ?? 0} pts
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="feedback-copy">
                    {hasSubmitted
                      ? 'Your submission is locked. Waiting for the host to reveal the round.'
                      : 'Place a pin and pick one story option. The server scores the round when the host reveals it.'}
                  </p>
                )}
              </div>

              <div className="leaderboard-panel">
                <div className="situation-header">
                  <div>
                    <p className="eyebrow">Leaderboard</p>
                    <h3>{isComplete ? 'Final standings' : 'Room standings'}</h3>
                  </div>
                  <StatusPill tone="cool">Authoritative server</StatusPill>
                </div>
                <div className="player-list" aria-label="Room leaderboard">
                  {snapshot.leaderboard.map((player) => (
                    <PlayerRow key={player.id} player={player} me={me} />
                  ))}
                </div>
              </div>

              {(isReveal || isComplete) && snapshot.revealResults.length > 0 ? (
                <div className="reveal-panel">
                  <div className="situation-header">
                    <div>
                      <p className="eyebrow">Reveal board</p>
                      <h3>Round results</h3>
                    </div>
                    <StatusPill tone="accent">Server scored</StatusPill>
                  </div>
                  <div className="reveal-list" aria-label="Round reveal results">
                    {snapshot.revealResults.map((result) => (
                      <RevealRow key={result.playerId} result={result} options={currentRound?.situationOptions ?? []} />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="map-actions">
                <ActionButton variant="secondary" onClick={handleLeaveSession}>
                  Leave session
                </ActionButton>
              </div>
            </div>
          </CardSurface>
        </section>
      )}
    </main>
  )
}

function loadIdentity() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as Identity
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function persistIdentity(identity: Identity) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity))
}

function clearIdentity() {
  localStorage.removeItem(STORAGE_KEY)
}

function getSocketErrorMessage(message: string) {
  if (message === 'xhr poll error' || message === 'websocket error') {
    return 'The room server is unavailable right now. Start the backend with npm run dev, or if this is deployed, verify the Render web service is running.'
  }

  return message
}

async function postJson<ResponseType>(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? 'Request failed.')
  }

  return (await response.json()) as ResponseType
}

function getMapGuidance(snapshot: SessionSnapshot, me: SessionPlayer | null) {
  if (snapshot.phase === 'complete') {
    return 'The last round is resolved. Review the reveal board and final leaderboard.'
  }

  if (snapshot.phase === 'reveal') {
    return 'The round is locked. Compare your marker with the answer and review how everyone scored.'
  }

  if (me?.submittedRound) {
    return 'Your submission is locked on the server. Wait for the host to reveal the round.'
  }

  return 'Place a pin, choose one story answer, and submit once you are satisfied with both picks.'
}

function getPhaseDescription(snapshot: SessionSnapshot, me: SessionPlayer | null, connectionLabel: string) {
  if (snapshot.phase === 'lobby') {
    return me?.isHost
      ? 'Share the room code, watch the roster populate in real time, and start the session once everyone has joined.'
      : 'The host has created the room. Stay in the lobby until the round pack starts.'
  }

  if (snapshot.phase === 'guessing') {
    return me?.submittedRound
      ? 'Your guess is stored on the server. The host can reveal the round once the room is ready.'
      : 'Everyone is on the same round. Submit both your map pin and your situation choice before the reveal.'
  }

  if (snapshot.phase === 'reveal') {
    return 'The server has scored the round and pushed the reveal to every client. Review the leaderboard before the host advances.'
  }

  return `The final leaderboard is live. Connection status: ${connectionLabel}.`
}

function formatDistance(distanceKm: number | null) {
  if (distanceKm === null) {
    return 'No submission'
  }

  return `${Math.round(distanceKm).toLocaleString()} km`
}

function PlayerRow({ player, me }: { player: SessionPlayer; me: SessionPlayer | null }) {
  return (
    <div className="player-row">
      <div>
        <strong>
          {player.name}
          {player.id === me?.id ? ' (You)' : ''}
        </strong>
        <span>
          {player.isHost ? 'Host' : 'Player'} · {player.isConnected ? 'Connected' : 'Offline'}
        </span>
      </div>
      <div className="player-row-score">
        <strong>{player.totalScore.toLocaleString()} pts</strong>
        <span>
          {player.submittedRound
            ? 'Submitted'
            : player.lastRoundPoints !== null
              ? `${player.lastRoundPoints.toLocaleString()} pts last round`
              : 'Waiting'}
        </span>
      </div>
    </div>
  )
}

function RevealRow({ result, options }: { result: SessionRevealResult; options: string[] }) {
  return (
    <div className="reveal-row">
      <div>
        <strong>{result.playerName}</strong>
        <span>
          {result.selectedSituationIndex === null ? 'No submission' : options[result.selectedSituationIndex] ?? 'Answer unavailable'}
        </span>
      </div>
      <div className="player-row-score">
        <strong>{result.totalPoints.toLocaleString()} pts</strong>
        <span>{formatDistance(result.distanceKm)}</span>
      </div>
    </div>
  )
}

export default App

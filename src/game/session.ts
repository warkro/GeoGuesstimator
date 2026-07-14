import { type RoundData } from './rounds'
import { scoreRound, type Coordinates } from './scoring'

export type SessionPhase = 'location' | 'situation' | 'reveal' | 'complete'

export type RoundResult = {
  roundId: string
  guess: Coordinates
  answer: Coordinates
  selectedSituationIndex: number
  correctSituationIndex: number
  isSituationCorrect: boolean
  distanceKm: number
  locationPoints: number
  situationPoints: number
  totalPoints: number
}

export type GameSession = {
  rounds: RoundData[]
  currentRoundIndex: number
  phase: SessionPhase
  currentLocationGuess: Coordinates | null
  currentSituationGuess: number | null
  currentResult: RoundResult | null
  roundResults: RoundResult[]
  totalScore: number
}

export function createGameSession(rounds: RoundData[]): GameSession {
  return {
    rounds,
    currentRoundIndex: 0,
    phase: 'location',
    currentLocationGuess: null,
    currentSituationGuess: null,
    currentResult: null,
    roundResults: [],
    totalScore: 0,
  }
}

export function getCurrentRound(session: GameSession) {
  return session.rounds[session.currentRoundIndex] ?? null
}

export function placeGuess(session: GameSession, guess: Coordinates): GameSession {
  if (!getCurrentRound(session) || session.phase === 'complete' || session.phase === 'reveal') {
    return session
  }

  return {
    ...session,
    currentLocationGuess: guess,
    currentResult: null,
    phase: 'location',
  }
}

export function resetCurrentGuess(session: GameSession): GameSession {
  if (!getCurrentRound(session) || session.phase === 'complete') {
    return session
  }

  return {
    ...session,
    currentLocationGuess: null,
    currentSituationGuess: null,
    currentResult: null,
    phase: 'location',
  }
}

export function lockLocationGuess(session: GameSession): GameSession {
  const currentRound = getCurrentRound(session)

  if (!currentRound || !session.currentLocationGuess || session.phase !== 'location') {
    return session
  }

  return {
    ...session,
    phase: 'situation',
  }
}

export function chooseSituationGuess(session: GameSession, choiceIndex: number): GameSession {
  if (!getCurrentRound(session) || session.phase !== 'situation') {
    return session
  }

  return {
    ...session,
    currentSituationGuess: choiceIndex,
  }
}

export function submitGuess(session: GameSession): GameSession {
  const currentRound = getCurrentRound(session)

  if (
    !currentRound ||
    !session.currentLocationGuess ||
    session.currentSituationGuess === null ||
    session.currentResult ||
    session.phase !== 'situation'
  ) {
    return session
  }

  const isSituationCorrect = session.currentSituationGuess === currentRound.correctSituationIndex
  const scoredGuess = scoreRound(session.currentLocationGuess, currentRound.answer, isSituationCorrect)
  const currentResult: RoundResult = {
    roundId: currentRound.id,
    guess: session.currentLocationGuess,
    answer: currentRound.answer,
    selectedSituationIndex: session.currentSituationGuess,
    correctSituationIndex: currentRound.correctSituationIndex,
    isSituationCorrect,
    distanceKm: scoredGuess.distanceKm,
    locationPoints: scoredGuess.locationPoints,
    situationPoints: scoredGuess.situationPoints,
    totalPoints: scoredGuess.totalPoints,
  }

  const roundResults = [...session.roundResults, currentResult]
  const isFinalRound = session.currentRoundIndex === session.rounds.length - 1

  return {
    ...session,
    currentResult,
    roundResults,
    totalScore: session.totalScore + currentResult.totalPoints,
    phase: isFinalRound ? 'complete' : 'reveal',
  }
}

export function continueToNextRound(session: GameSession): GameSession {
  if (session.phase !== 'reveal') {
    return session
  }

  const nextRoundIndex = session.currentRoundIndex + 1

  if (nextRoundIndex >= session.rounds.length) {
    return {
      ...session,
      phase: 'complete',
    }
  }

  return {
    ...session,
    currentRoundIndex: nextRoundIndex,
    currentLocationGuess: null,
    currentSituationGuess: null,
    currentResult: null,
    phase: 'location',
  }
}
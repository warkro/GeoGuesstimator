import type { Coordinates } from './scoring.js'

export type SessionPhase = 'lobby' | 'guessing' | 'reveal' | 'complete'

export type SessionPlayer = {
  id: string
  name: string
  isHost: boolean
  isConnected: boolean
  totalScore: number
  submittedRound: boolean
  lastRoundPoints: number | null
}

export type SessionRevealResult = {
  playerId: string
  playerName: string
  guess: Coordinates | null
  selectedSituationIndex: number | null
  correctSituationIndex: number
  isSituationCorrect: boolean
  distanceKm: number | null
  locationPoints: number
  situationPoints: number
  totalPoints: number
}

export type SessionRoundView = {
  id: string
  title: string
  hint: string
  clue: string
  situationPrompt: string
  situationOptions: string[]
  imageUrl: string
  locationName?: string
  story?: string
  answer?: Coordinates
  correctSituationIndex?: number
}

export type SessionSnapshot = {
  code: string
  phase: SessionPhase
  roundIndex: number
  totalRounds: number
  hostId: string
  playerCount: number
  submittedCount: number
  currentRound: SessionRoundView | null
  leaderboard: SessionPlayer[]
  revealResults: SessionRevealResult[]
}

export type CreateSessionRequest = {
  name: string
}

export type JoinSessionRequest = {
  name: string
}

export type SessionAuthResponse = {
  code: string
  playerId: string
}

export type RoundSubmission = {
  guess: Coordinates
  selectedSituationIndex: number
}
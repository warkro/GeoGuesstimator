import { roundPack, type RoundContent } from '../../shared/rounds'

export type RoundData = RoundContent & {
  imageSrc: string
}

export const localRoundSet: RoundData[] = roundPack.map((round) => ({
  ...round,
  imageSrc: round.imageUrl,
}))

export const sampleRound = localRoundSet[0]
import sampleRoundImage from '../assets/sample-round.svg'
import heroRoundImage from '../assets/hero.png'
import { roundPack, type RoundContent, type RoundImageKey } from '../../shared/rounds'

export type RoundData = RoundContent & {
  imageSrc: string
}

export const roundAssetByKey: Record<RoundImageKey, string> = {
  sample: sampleRoundImage,
  hero: heroRoundImage,
}

export const localRoundSet: RoundData[] = roundPack.map((round) => ({
  ...round,
  imageSrc: roundAssetByKey[round.imageUrl],
}))

export const sampleRound = localRoundSet[0]
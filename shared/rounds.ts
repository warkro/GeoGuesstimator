import type { Coordinates } from './scoring.js'

export type RoundImageKey = 'sample' | 'hero'

export type RoundContent = {
  id: string
  title: string
  locationName: string
  hint: string
  clue: string
  story: string
  situationPrompt: string
  situationOptions: string[]
  correctSituationIndex: number
  imageKey: RoundImageKey
  answer: Coordinates
}

export const roundPack: RoundContent[] = [
  {
    id: 'marina-bay-sample',
    title: 'Round 1',
    locationName: 'Marina Bay, Singapore',
    hint: 'Located in Southeast Asia.',
    clue:
      'A skyline-heavy waterfront clue with dense towers, polished public space, and a humid evening atmosphere.',
    story:
      'This photo came from a family stop at Marina Bay after dark, taken during an evening walk between the waterfront light show and dinner nearby.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: ['Team offsite dinner', 'Family vacation stop', 'Concert queue', 'Birthday picnic'],
    correctSituationIndex: 1,
    imageKey: 'sample',
    answer: {
      lat: 1.2834,
      lng: 103.8607,
    },
  },
  {
    id: 'reykjavik-harbor-sample',
    title: 'Round 2',
    locationName: 'Reykjavik Harbor, Iceland',
    hint: 'North Atlantic island capital.',
    clue:
      'Cold water, low-rise buildings, and a working harbor suggest a northern coastal city with a lot more weather than crowd density.',
    story:
      'The photographer snapped this while taking a whale-watching boat out from Reykjavik Harbor during a summer vacation in Iceland.',
    situationPrompt: 'What best describes the moment behind this shot?',
    situationOptions: [
      'Watching a baseball game',
      'Heading out on a whale-watching tour',
      'Leaving a ferry commute',
      'Shopping at a street market',
    ],
    correctSituationIndex: 1,
    imageKey: 'hero',
    answer: {
      lat: 64.1475,
      lng: -21.935,
    },
  },
  {
    id: 'cape-town-waterfront-sample',
    title: 'Round 3',
    locationName: 'V&A Waterfront, Cape Town',
    hint: 'Southern tip of the African continent.',
    clue:
      'Mountain-backed water, a busy harbor edge, and bright coastal light point toward a major southern hemisphere destination city.',
    story:
      'This was taken during a team trip extension after a conference, when the group spent an afternoon exploring the Cape Town waterfront.',
    situationPrompt: 'What was the group doing here?',
    situationOptions: ['Conference trip outing', 'Wedding rehearsal dinner', 'Camping check-in', 'Morning school commute'],
    correctSituationIndex: 0,
    imageKey: 'sample',
    answer: {
      lat: -33.9036,
      lng: 18.4217,
    },
  },
  {
    id: 'valparaiso-hillside-sample',
    title: 'Round 4',
    locationName: 'Valparaiso Hillside, Chile',
    hint: 'Pacific coast city in South America.',
    clue:
      'Steep urban terrain, colorful buildings, and a Pacific-facing hillside make this one more about reading city form than spotting a famous landmark.',
    story:
      'The photo came from a long weekend walking tour through Valparaiso, taken while hunting for murals and hillside viewpoints.',
    situationPrompt: 'What was happening during this photo?',
    situationOptions: ['Guided mural walk', 'Graduation ceremony', 'Marathon finish line', 'Ski lesson meetup'],
    correctSituationIndex: 0,
    imageKey: 'hero',
    answer: {
      lat: -33.0472,
      lng: -71.6127,
    },
  },
  {
    id: 'osaka-bay-sample',
    title: 'Round 5',
    locationName: 'Osaka Bay, Japan',
    hint: 'Major metro on the Kansai coast.',
    clue:
      'Dense waterfront infrastructure and a polished urban bayfront suggest a major East Asian metro with heavy tourism and evening activity.',
    story:
      'This final round was captured during a summer trip to Osaka, right before the group boarded a harbor cruise at sunset.',
    situationPrompt: 'What was the occasion in this scene?',
    situationOptions: ['Sunset harbor cruise', 'Office move-in day', 'Food festival judging', 'Local election rally'],
    correctSituationIndex: 0,
    imageKey: 'sample',
    answer: {
      lat: 34.6937,
      lng: 135.5023,
    },
  },
]
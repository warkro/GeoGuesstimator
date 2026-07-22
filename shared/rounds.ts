import type { Coordinates } from './scoring.js'

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
  imageUrl: string
  answer: Coordinates
}

export const roundPack: RoundContent[] = [
  {
    id: 'kathmandu-kaal-bhairav',
    title: 'Round 1',
    locationName: 'Kathmandu, Nepal',
    hint: 'Capital city of Nepal in the Kathmandu Valley.',
    clue: 'A sacred idol associated with Lord Shiva points toward a historic temple setting in Nepal.',
    story:
      'This photo was taken while visiting Nepal on vacation and shows the world’s only smiling Kaal Bharav, a form of Lord Shiva.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Visiting a smiling Kaal Bharav idol during a Nepal vacation',
      'Ordering a Nepali thali meal for lunch',
      'Meeting family at a mall before bowling',
      'Watching a musical theatre performance',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-01-kathmandu-kaal-bhairav.jpg',
    answer: {
      lat: 27.7172,
      lng: 85.324,
    },
  },
  {
    id: 'nepal-thali-meal',
    title: 'Round 2',
    locationName: 'Nepal',
    hint: 'A South Asian country known for Himalayan landscapes and rich food traditions.',
    clue:
      'The food presentation and variety point to a traditional Nepali meal rather than a landmark or cityscape.',
    story: 'This photo shows a typical Nepali Thali meal served for one person.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Having a typical Nepali Thali meal for one person',
      'Touring Iglesia de la Merced in Antigua Guatemala',
      'Walking through a waterfront light show',
      'Taking a harbor cruise at sunset',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-02-nepal-thali-meal.jpg',
    answer: {
      lat: 28.3949,
      lng: 84.124,
    },
  },
  {
    id: 'goa-sea-breeze-vacation',
    title: 'Round 3',
    locationName: 'Goa, India',
    hint: 'A coastal state on India’s western shoreline.',
    clue:
      'The sea, waves, and vacation feel point to a beach destination on India’s west coast.',
    story:
      'This was a candid vacation photo of Sayantani smiling at the sea while trying to fix her hair against the waves and sea breeze.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Smiling by the sea while fixing hair in the breeze during vacation',
      'Taking a morning city view photo in Sikkim',
      'Going bowling with family at a mall',
      'Looking for murals on a hillside walking tour',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-03-goa-sea-breeze-vacation.jpg',
    answer: {
      lat: 15.2993,
      lng: 74.124,
    },
  },
  {
    id: 'shyambu-stupa-kathmandu',
    title: 'Round 4',
    locationName: 'Shyambu Stupa, Kathmandu, Nepal',
    hint: 'A well-known stupa in Kathmandu, Nepal.',
    clue:
      'A Buddhist stupa setting in Kathmandu narrows this to one of Nepal’s recognizable religious landmarks.',
    story: 'This photo was taken at Shyambu Stupa in Kathmandu, Nepal.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Visiting Shyambu Stupa in Kathmandu',
      'Eating a Nepali Thali meal',
      'Attending a daughter’s theatre performance',
      'Meeting colleagues during an India meetup',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-04-shyambu-stupa-kathmandu.jpg',
    answer: {
      lat: 27.7149,
      lng: 85.2903,
    },
  },
  {
    id: 'gangtok-morning-city-view',
    title: 'Round 5',
    locationName: 'Gangtok, Sikkim, India',
    hint: 'A hill city in northeast India.',
    clue:
      'A morning city view from a mountainous Indian state points toward Sikkim’s capital region.',
    story: 'This photo shows a morning city view in Gangtok, Sikkim, India.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Looking out over a morning city view in Gangtok',
      'Touring an old church in Antigua Guatemala',
      'Walking along the sea in Goa',
      'Watching a theatre rendition of Alice in Wonderland',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-05-gangtok-morning-city-view.jpg',
    answer: {
      lat: 27.3314,
      lng: 88.6138,
    },
  },
  {
    id: 'oakland-place-guatemala-bowling',
    title: 'Round 6',
    locationName: 'Oakland Place, Guatemala',
    hint: 'A city mall in Guatemala.',
    clue:
      'An indoor city mall setting tied to a family outing points to a social stop before an activity.',
    story:
      'This photo was taken at a mall in the city while meeting family to go bowling.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Meeting family at a mall before going bowling',
      'Visiting a smiling Lord Shiva idol in Nepal',
      'Taking a whale-watching boat from a harbor',
      'Having a one-person Nepali Thali meal',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-06-oakland-place-guatemala-bowling.jpg',
    answer: {
      lat: 14.5986,
      lng: -90.5073,
    },
  },
  {
    id: 'iglesia-merced-antigua',
    title: 'Round 7',
    locationName: 'Iglesia de la Merced, Antigua Guatemala',
    hint: 'A historic church in Antigua Guatemala.',
    clue:
      'A colonial-era church location and touring context point toward Antigua Guatemala.',
    story:
      'This photo was taken while touring Iglesia de la Merced in Antigua Guatemala.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Touring Iglesia de la Merced in Antigua Guatemala',
      'Going to Canada’s Wonderland in Vaughan',
      'Ordering lunch in Nepal',
      'Joining a team trip extension after a conference',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-07-iglesia-merced-antigua.jpg',
    answer: {
      lat: 14.5597,
      lng: -90.7333,
    },
  },
  {
    id: 'canadas-wonderland-vaughan',
    title: 'Round 8',
    locationName: 'Canada’s Wonderland, Vaughan, Ontario',
    hint: 'A major amusement park north of Toronto.',
    clue:
      'The amusement park setting points to a recognizable family entertainment destination in Vaughan, Ontario.',
    story:
      'This photo was taken at Canada’s Wonderland in Vaughan, Ontario.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Spending time at Canada’s Wonderland in Vaughan',
      'Touring a stupa in Kathmandu',
      'Walking by the sea in Goa',
      'Meeting JE India Ladies in Bangalore',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-08-canadas-wonderland-vaughan.jpg',
    answer: {
      lat: 43.843,
      lng: -79.5395,
    },
  },
  {
    id: 'toronto-alice-theatre',
    title: 'Round 9',
    locationName: 'Toronto, Ontario',
    hint: 'Canada’s largest city.',
    clue:
      'A local theatre performance and a familiar storybook theme point toward a family event in Toronto.',
    story:
      'The photo was connected to a daughter’s musical theatre performance where the theatre group performed their own rendition of Alice in Wonderland.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'Watching a daughter’s musical theatre rendition of Alice in Wonderland',
      'Meeting family for bowling at a mall',
      'Touring a historic church in Guatemala',
      'Taking a morning city view photo in Gangtok',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-09-toronto-alice-theatre.jpg',
    answer: {
      lat: 43.6532,
      lng: -79.3832,
    },
  },
  {
    id: 'bangalore-je-india-ladies',
    title: 'Round 10',
    locationName: 'Bangalore, India',
    hint:
      'A major technology and business city in southern India.',
    clue:
      'A city meetup in India with colleagues points toward Bangalore rather than a tourist landmark.',
    story:
      'This photo shows the JE India Ladies, minus Tania, out in the town during their meetup.',
    situationPrompt: 'What was happening in this photo?',
    situationOptions: [
      'The JE India Ladies, minus Tania, were out in town during their meetup',
      'Watching a musical theatre performance in Toronto',
      'Visiting Canada’s Wonderland in Vaughan',
      'Touring Iglesia de la Merced in Antigua Guatemala',
    ],
    correctSituationIndex: 0,
    imageUrl: '/img/round-10-bangalore-je-india-ladies.jpg',
    answer: {
      lat: 12.9716,
      lng: 77.5946,
    },
  },
]
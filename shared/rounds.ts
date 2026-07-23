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
    id: "kathmandu-kaal-bhairav",
    title: "Round 1",
    locationName: "Kaal Bhairav, Kathmandu Durbar Square, Nepal",
    hint: "An ancient royal square filled with temples, shrines, and centuries of history.",
    clue: "This location is tied to a well-known Hindu figure found within a historic city square rather than on a hilltop.",
    story: "This photo was taken while visiting Nepal on vacation and shows the world's only smiling Kaal Bharav, a form of Lord Shiva.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Walking through a historic square before heading to a local restaurant",
      "Stopping at a sacred figure during a heritage walk through an old city quarter",
      "Joining a guided stop at a temple complex during a city tour",
      "Visiting a hilltop shrine while taking in views over a nearby valley"
    ],
    correctSituationIndex: 1,
    imageUrl: "/img/round-01-kathmandu-kaal-bhairav.jpg",
    answer: { lat: 27.7049, lng: 85.3075 }
  },

  {
    id: "nepal-thali-meal",
    title: "Round 2",
    locationName: "Nepal",
    hint: "A plated meal from a mountain-region food culture where several small portions are served together.",
    clue: "The answer is more about what is being served than where the person is standing.",
    story: "This photo shows a typical Nepali Thali meal served for one person.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Trying a local lunch special before an afternoon sightseeing stop",
      "Ordering a comfort-food plate after a long travel day",
      "Sitting down to a traditional single-serving meal with several sides",
      "Sampling a shared tasting platter during a group dinner"
    ],
    correctSituationIndex: 2,
    imageUrl: "/img/round-02-nepal-thali-meal.jpg",
    answer: { lat: 28.3949, lng: 84.124 }
  },

  {
    id: "goa-sea-breeze-vacation",
    title: "Round 3",
    locationName: "Goa, India",
    hint: "A warm coastal destination where the surroundings matter as much as the pose.",
    clue: "Use the natural clues in the photo, especially wind, water, and relaxed vacation energy.",
    story: "This was a candid vacation photo of Sayantani smiling at the sea while trying to fix her hair against the waves and sea breeze.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Pausing during a waterfront walk before dinner",
      "Taking a casual portrait during a beachside outing",
      "Laughing after the wind interrupted a planned vacation photo",
      "Caught in a candid seaside moment while dealing with the breeze"
    ],
    correctSituationIndex: 3,
    imageUrl: "/img/round-03-goa-sea-breeze-vacation.jpg",
    answer: { lat: 15.2993, lng: 74.124 }
  },

  {
    id: "shyambu-stupa-kathmandu",
    title: "Round 4",
    locationName: "Shyambu Stupa, Kathmandu, Nepal",
    hint: "A hilltop religious site known for layered views, steps, and a strong sense of place.",
    clue: "The scene points to a landmark where architecture, worship, and city views all compete for attention.",
    story: "This photo was taken at Shyambu Stupa in Kathmandu, Nepal.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Visiting a hilltop stupa landmark during time in Kathmandu",
      "Stopping at a scenic overlook near a historic neighbourhood",
      "Touring a religious site while moving between city landmarks",
      "Exploring an old temple courtyard after a city walk"
    ],
    correctSituationIndex: 0,
    imageUrl: "/img/round-04-shyambu-stupa-kathmandu.jpg",
    answer: { lat: 27.7149, lng: 85.2903 }
  },

  {
    id: "gangtok-morning-city-view",
    title: "Round 5",
    locationName: "Gangtok, Sikkim, India",
    hint: "A high-elevation urban view where hills, rooftops, and morning light do most of the storytelling.",
    clue: "This is not a landmark close-up. Think of a city observed from a quieter, elevated perspective.",
    story: "This photo shows a morning city view in Gangtok, Sikkim, India.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Capturing a misty cityscape during a mountain trip",
      "Taking in a quiet morning view over a hillside city",
      "Looking out from a hotel balcony before starting the day",
      "Taking a skyline photo from a viewpoint on the edge of town"
    ],
    correctSituationIndex: 1,
    imageUrl: "/img/round-05-gangtok-morning-city-view.jpg",
    answer: { lat: 27.3314, lng: 88.6138 }
  },

  {
    id: "oakland-place-guatemala-bowling",
    title: "Round 6",
    locationName: "Oakland Place, Guatemala",
    hint: "An urban indoor stop where the location is more social than scenic.",
    clue: "The story is tied to meeting up before another activity, not to shopping as the main event.",
    story: "This photo was taken at a mall in the city while meeting family to go bowling.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Taking a break inside a mall during a longer day out",
      "Waiting for relatives before dinner plans in the city",
      "Meeting up with family at a city mall before heading to another activity",
      "Gathering indoors before a casual group outing"
    ],
    correctSituationIndex: 2,
    imageUrl: "/img/round-06-oakland-place-guatemala-bowling.jpg",
    answer: { lat: 14.5986, lng: -90.5073 }
  },

  {
    id: "iglesia-merced-antigua",
    title: "Round 7",
    locationName: "Iglesia de la Merced, Antigua Guatemala",
    hint: "A colonial-era city scene where architecture gives away more than the people in the photo.",
    clue: "Look for ornate church details and an old-town touring feel rather than a modern city outing.",
    story: "This photo was taken while touring Iglesia de la Merced in Antigua Guatemala.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Stopping outside a landmark while walking through a heritage district",
      "Taking photos in a historic plaza before continuing the tour",
      "Visiting a colourful religious building during a sightseeing day",
      "Touring a historic church during a visit to an old colonial city"
    ],
    correctSituationIndex: 3,
    imageUrl: "/img/round-07-iglesia-merced-antigua.jpg",
    answer: { lat: 14.5597, lng: -90.7333 }
  },

  {
    id: "canadas-wonderland-vaughan",
    title: "Round 8",
    locationName: "Canada's Wonderland, Vaughan, Ontario",
    hint: "A large outdoor entertainment venue built around rides, crowds, and a day-trip atmosphere.",
    clue: "The scene should feel more like a high-energy leisure stop than a city landmark or family performance.",
    story: "This photo was taken at Canada's Wonderland in Vaughan, Ontario.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Taking a photo during a day trip outside the city",
      "Spending the day at a major amusement park",
      "Visiting a busy outdoor attraction during a summer outing",
      "Walking through a themed entertainment area with family or friends"
    ],
    correctSituationIndex: 1,
    imageUrl: "/img/round-08-canadas-wonderland-vaughan.jpg",
    answer: { lat: 43.843, lng: -79.5395 }
  },

  {
    id: "toronto-alice-theatre",
    title: "Round 9",
    locationName: "Toronto, Ontario",
    hint: "A big-city setting where the important clue is the activity, not the skyline.",
    clue: "Think performance, costumes, and a familiar fantasy story rather than a tourist stop.",
    story: "The photo was connected to a daughter's musical theatre performance where the theatre group performed their own rendition of Alice in Wonderland.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Watching a family member perform in a musical based on a familiar story",
      "Attending a local stage production with a playful theme",
      "Taking photos before a community theatre show",
      "Celebrating after a children's performance in the city"
    ],
    correctSituationIndex: 0,
    imageUrl: "/img/round-09-toronto-alice-theatre.jpg",
    answer: { lat: 43.6532, lng: -79.3832 }
  },

  {
    id: "bangalore-je-india-ladies",
    title: "Round 10",
    locationName: "Bangalore, India",
    hint: "A large Indian city setting where the social context is stronger than the landmark clues.",
    clue: "This round is about a meetup in the city, so focus on the group dynamic rather than sightseeing.",
    story: "This photo shows the JE India Ladies, minus Tania, out in the town during their meetup.",
    situationPrompt: "What was happening in this photo?",
    situationOptions: [
      "Friends were exploring the city during an informal outing",
      "A group was gathering downtown after a planned event",
      "A group of colleagues were out together in the city during a meetup",
      "Team members were taking a break between work meetings"
    ],
    correctSituationIndex: 2,
    imageUrl: "/img/round-10-bangalore-je-india-ladies.jpg",
    answer: { lat: 12.9716, lng: 77.5946 }
  }
];
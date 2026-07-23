export type Coordinates = {
  lat: number
  lng: number
}

const EARTH_RADIUS_KM = 6371

const EXACT_MATCH_THRESHOLD_KM = 25
const VERY_CLOSE_THRESHOLD_KM = 100
const CLOSE_THRESHOLD_KM = 500
const SAME_REGION_THRESHOLD_KM = 1500
const FAR_AWAY_THRESHOLD_KM = 4000

export const MAX_LOCATION_POINTS = 250
export const MAX_SITUATION_POINTS = 100

const toRadians = (value: number) => (value * Math.PI) / 180

export function getDistanceKm(from: Coordinates, to: Coordinates) {
  const latDelta = toRadians(to.lat - from.lat)
  const lngDelta = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lngDelta / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine))
}

export function getLocationScore(distanceKm: number) {
  if (distanceKm <= EXACT_MATCH_THRESHOLD_KM) {
    return 250
  }

  if (distanceKm <= VERY_CLOSE_THRESHOLD_KM) {
    return 200
  }

  if (distanceKm <= CLOSE_THRESHOLD_KM) {
    return 150
  }

  if (distanceKm <= SAME_REGION_THRESHOLD_KM) {
    return 100
  }

  if (distanceKm <= FAR_AWAY_THRESHOLD_KM) {
    return 50
  }

  return 0
}

export function getSituationScore(isCorrect: boolean) {
  return isCorrect ? MAX_SITUATION_POINTS : 0
}

export function scoreLocationGuess(
  guess: Coordinates,
  answer: Coordinates
) {
  const distanceKm = getDistanceKm(guess, answer)

  return {
    distanceKm,
    points: getLocationScore(distanceKm),
  }
}

export function scoreRound(
  guess: Coordinates,
  answer: Coordinates,
  isSituationCorrect: boolean
) {
  const location = scoreLocationGuess(guess, answer)
  const situationPoints = getSituationScore(isSituationCorrect)

  return {
    distanceKm: location.distanceKm,
    locationPoints: location.points,
    situationPoints,
    totalPoints: location.points + situationPoints,
  }
}
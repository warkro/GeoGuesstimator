const EARTH_RADIUS_KM = 6371;
const EXACT_MATCH_THRESHOLD_KM = 10;
const VERY_CLOSE_THRESHOLD_KM = 75;
const CLOSE_THRESHOLD_KM = 400;
const SAME_REGION_THRESHOLD_KM = 1500;
const FAR_AWAY_THRESHOLD_KM = 5000;
export const MAX_LOCATION_POINTS = 1000;
export const MAX_SITUATION_POINTS = 250;
const toRadians = (value) => (value * Math.PI) / 180;
export function getDistanceKm(from, to) {
    const latDelta = toRadians(to.lat - from.lat);
    const lngDelta = toRadians(to.lng - from.lng);
    const fromLat = toRadians(from.lat);
    const toLat = toRadians(to.lat);
    const haversine = Math.sin(latDelta / 2) ** 2 +
        Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
}
export function getLocationScore(distanceKm) {
    if (distanceKm <= EXACT_MATCH_THRESHOLD_KM) {
        return MAX_LOCATION_POINTS;
    }
    if (distanceKm <= VERY_CLOSE_THRESHOLD_KM) {
        return 750;
    }
    if (distanceKm <= CLOSE_THRESHOLD_KM) {
        return 500;
    }
    if (distanceKm <= SAME_REGION_THRESHOLD_KM) {
        return 250;
    }
    if (distanceKm <= FAR_AWAY_THRESHOLD_KM) {
        return 100;
    }
    return 25;
}
export function getSituationScore(isCorrect) {
    return isCorrect ? MAX_SITUATION_POINTS : 0;
}
export function scoreLocationGuess(guess, answer) {
    const distanceKm = getDistanceKm(guess, answer);
    return {
        distanceKm,
        points: getLocationScore(distanceKm),
    };
}
export function scoreRound(guess, answer, isSituationCorrect) {
    const location = scoreLocationGuess(guess, answer);
    const situationPoints = getSituationScore(isSituationCorrect);
    return {
        distanceKm: location.distanceKm,
        locationPoints: location.points,
        situationPoints,
        totalPoints: location.points + situationPoints,
    };
}

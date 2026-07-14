import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import type { LatLngBoundsExpression, LatLngTuple, LeafletMouseEvent } from 'leaflet'
import type { Coordinates } from '../game/scoring'

type MapBoardProps = {
  guess: Coordinates | null
  answer: Coordinates | null
  showAnswer: boolean
  disabled?: boolean
  onGuess: (coordinates: Coordinates) => void
  ariaLabel?: string
  ariaDescribedBy?: string
}

const DEFAULT_CENTER: LatLngTuple = [20, 0]
const DEFAULT_ZOOM = 2
const WORLD_BOUNDS: LatLngBoundsExpression = [
  [-85, -180],
  [85, 180],
]

function MapClickHandler({ disabled, onGuess }: Pick<MapBoardProps, 'disabled' | 'onGuess'>) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      if (disabled) {
        return
      }

      onGuess({
        lat: Number(event.latlng.lat.toFixed(4)),
        lng: Number(event.latlng.lng.toFixed(4)),
      })
    },
  })

  return null
}

function ViewportController({ guess, answer, showAnswer }: Pick<MapBoardProps, 'guess' | 'answer' | 'showAnswer'>) {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize()
  }, [map])

  useEffect(() => {
    if (showAnswer && guess && answer) {
      map.fitBounds(
        [
          [guess.lat, guess.lng],
          [answer.lat, answer.lng],
        ],
        {
          padding: [40, 40],
          maxZoom: 4,
        },
      )

      return
    }

    if (guess) {
      map.setView([guess.lat, guess.lng], Math.max(map.getZoom(), 3), {
        animate: true,
      })

      return
    }

    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
  }, [answer, guess, map, showAnswer])

  return null
}

export function MapBoard({
  guess,
  answer,
  showAnswer,
  disabled = false,
  onGuess,
  ariaLabel,
  ariaDescribedBy,
}: MapBoardProps) {
  return (
    <div className="map-board-shell">
      <MapContainer
        className="map-board"
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={2}
        maxZoom={18}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={0.75}
        worldCopyJump
        scrollWheelZoom
        attributionControl
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler disabled={disabled} onGuess={onGuess} />
        <ViewportController guess={guess} answer={answer} showAnswer={showAnswer} />
        {guess ? (
          <CircleMarker
            center={[guess.lat, guess.lng]}
            pathOptions={{ color: '#fff6ef', fillColor: '#c85d36', fillOpacity: 1, weight: 3 }}
            radius={9}
          />
        ) : null}
        {showAnswer && answer ? (
          <CircleMarker
            center={[answer.lat, answer.lng]}
            pathOptions={{ color: '#fffce5', fillColor: '#edc15a', fillOpacity: 1, weight: 3 }}
            radius={9}
          />
        ) : null}
      </MapContainer>
    </div>
  )
}
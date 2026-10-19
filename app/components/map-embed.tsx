// app/components/map-embed.tsx
//
// Keyless OpenStreetMap embed. Renders nothing if coordinates
// are missing or out of range — callers don't need to guard.
// Deliberately not Google Maps: no API key, no billing, no
// referrer restriction footguns.

type MapEmbedProps = {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  label?: string;
  height?: number;
};

function isValidCoord(
  lat: number | null | undefined,
  lng: number | null | undefined
): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function MapEmbed({
  latitude,
  longitude,
  label,
  height = 320,
}: MapEmbedProps) {
  if (!isValidCoord(latitude, longitude)) return null;

  const delta = 0.02;
  const bbox = [
    (longitude - delta).toFixed(5),
    (latitude - delta).toFixed(5),
    (longitude + delta).toFixed(5),
    (latitude + delta).toFixed(5),
  ].join("%2C");

  const src =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${bbox}&layer=mapnik` +
    `&marker=${latitude.toFixed(5)}%2C${longitude.toFixed(5)}`;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-deep-200 bg-cream-100 dark:border-deep-800 dark:bg-deep-900"
      style={{ height }}
    >
      <iframe
        title={`Map of ${label ?? "location"}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src={src}
      />
    </div>
  );
}
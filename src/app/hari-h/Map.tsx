// Leaflet map for departure day — client-only (loaded with next/dynamic,
// ssr: false, from src/app/hari-h/page.tsx). Markers come from packages.ts.
"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { MeetingPoint } from "@/lib/packages";

// Marker icons come from the Leaflet CDN (unpkg) instead of local files:
// the GitHub snapshot push used for this repo cannot carry binary files,
// so public/leaflet/*.png are not in the repo. unpkg loads fine in normal
// browsers; it only fails inside this VM's proxied browser, where the map
// tiles are grey anyway. If the PNGs are ever added to public/leaflet/,
// point these three URLs back at /leaflet/marker-icon-2x.png etc.
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [map, lat, lng]);
  return null;
}

export default function MeetingMap({
  points,
  active,
}: {
  points: MeetingPoint[];
  active: MeetingPoint;
}) {
  return (
    <MapContainer
      center={[active.lat, active.lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 320, width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={active.lat} lng={active.lng} />
      {points.map((p) => (
        <Marker key={p.name} position={[p.lat, p.lng]}>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.note}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

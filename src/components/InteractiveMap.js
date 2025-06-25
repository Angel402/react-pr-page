import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl, iconUrl, shadowUrl
});

export default function InteractiveMap({ coords, label }) {
  if (!coords) return <p>Cargando mapa...</p>;

  const [latStr, lonStr] = coords.split(',');
  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon)) return <p>Coordenadas inválidas</p>;

  const position = [lat, lon];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={position}>
        <Popup>{label || `Lat: ${lat}, Lon: ${lon}`}</Popup>
      </Marker>
    </MapContainer>
  );
}

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useState } from 'react';

L.Icon.Default.mergeOptions({
    iconRetinaUrl, iconUrl, shadowUrl
});

function ChangeMapCenter({ position }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
}

export default function InteractiveMap({ coords, setCoords}) {
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [position, setPosition] = useState([0, 0]);

    useEffect(() => {
        if (!coords || !coords.length) return;
        const [latStr, lonStr] = coords.split(',');
        const latitude = parseFloat(latStr);
        const longitude = parseFloat(lonStr);
        if (isNaN(latitude) || isNaN(longitude)) return;

        setLat(latitude);
        setLon(longitude);
        setPosition([latitude, longitude]);
    }, [coords]);

    const handleDragEnd = (e) => {
        const marker = e.target;
        const { lat, lng } = marker.getLatLng();
        setLat(lat);
        setLon(lng);
        setPosition([lat, lng]);
        setCoords(`${lat},${lng}`);
    };

    if (!coords || isNaN(lat) || isNaN(lon)) return <p>Coordenadas inválidas</p>;

    return (
        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
            <ChangeMapCenter position={position} />
            <TileLayer
                attribution='OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                    dragend: handleDragEnd,
                }}
            >
                <Popup>Arrástrame</Popup>
            </Marker>
        </MapContainer>
    );
}

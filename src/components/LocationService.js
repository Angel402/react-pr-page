import { useState, useEffect, useCallback } from 'react';
import citiesData from '../cities.json'; // <--- Importa tus datos de ciudades

const NOMINATIM_REVERSE_API = 'https://nominatim.openstreetmap.org/reverse';
// Es importante que uses un User-Agent único para tu aplicación
const USER_AGENT = 'YourAppName/1.0 (your-email@example.com)'; // <--- **REEMPLAZA CON LA INFO DE TU APP**

const useLocationService = () => {
    const [location, setLocation] = useState(null); // { lat: number, lon: number }
    const [cityName, setCityName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función interna para obtener el nombre de la ciudad desde coordenadas (Nominatim)
    const getCityFromCoords = useCallback(async (lat, lon) => {
        if (lat === null || lon === null) {
            console.warn("Coordenadas inválidas proporcionadas a getCityFromCoords.");
            return null;
        }

        const url = `${NOMINATIM_REVERSE_API}?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "User-Agent": USER_AGENT,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Nominatim API HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const data = await response.json();

            const city = data.address.city || data.address.town || data.address.village || data.display_name || null;
            console.log("Ciudad obtenida de Nominatim:", city);
            return city;
        } catch (error) {
            console.error("Error obteniendo ciudad desde coordenadas (interna):", error);
            throw error; // Propagamos el error
        }
    }, []);

    // FUNCIÓN PRINCIPAL: Obtiene ubicación actual del navegador y su ciudad
    const getLocationDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setLocation(null); // Limpia la ubicación y ciudad al iniciar
        setCityName(null);

        if (!navigator.geolocation) {
            const errorMsg = "Geolocation is not supported by your browser.";
            setError(errorMsg);
            setIsLoading(false);
            console.error(errorMsg);
            // Retornar null o un objeto de error si no se puede proceder
            return null; // O throw new Error(errorMsg);
        }

        try {
            // 1. Obtener la ubicación del navegador
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const browserLocation = { lat: latitude, lon: longitude };
            // Opcional: Puedes actualizar el estado 'location' con la ubicación cruda del navegador si la necesitas
            // setLocation(browserLocation);
            console.log("Ubicación del navegador obtenida:", browserLocation);


            // 2. Obtener el nombre de la ciudad para la ubicación del navegador usando Nominatim
            const cityFromNominatim = await getCityFromCoords(latitude, longitude);

            if (!cityFromNominatim) {
                const errorMsg = "No se pudo determinar el nombre de la ciudad para la ubicación obtenida.";
                setError(errorMsg);
                setIsLoading(false);
                console.warn(errorMsg);
                return null; // No se encontró la ciudad
            }
            console.log("Nombre de ciudad de Nominatim:", cityFromNominatim);

            // 3. Buscar esta ciudad en citiesData.json para obtener sus detalles (lat/lon del JSON)
            // NOTA: Necesitas el código de país para buscar de forma fiable en citiesData.
            // getCityFromCoords de Nominatim no siempre retorna el código ISO2 de forma directa
            // en el objeto address de la respuesta por defecto. Podríamos modificar getCityFromCoords
            // para intentar obtener el código de país también, o buscar en el JSON solo por nombre.
            // Buscar solo por nombre puede traer resultados incorrectos si hay ciudades con el mismo nombre en diferentes países.
            // **ASUMAMOS que getCityFromCoords pudiera obtener o ya hemos obtenido el código de país asociado a cityFromNominatim**
            // Si no, necesitarías una forma de obtener el código de país aquí o ajustar la búsqueda en el JSON.

            // Para simplificar y basarnos en lo que tenemos, buscamos por nombre en el JSON.
            // Esto es menos fiable si hay nombres de ciudades duplicados.
            const foundCityInJson = citiesData.find(city => city.city === cityFromNominatim);

            if (foundCityInJson) {
                // Actualiza el estado del hook con los detalles encontrados en el JSON
                const finalLocation = {
                    lat: parseFloat(foundCityInJson.lat),
                    lon: parseFloat(foundCityInJson.lng)
                };
                setLocation(finalLocation); // Guarda las coordenadas del JSON
                setCityName(foundCityInJson.city); // Guarda el nombre del JSON

                console.log("Ciudad encontrada en JSON y estado actualizado:", { city: foundCityInJson.city, lat: finalLocation.lat, lon: finalLocation.lon });

                // **4. Retorna el objeto con la información solicitada**
                return {
                    city: foundCityInJson.city,
                    lat: finalLocation.lat,
                    lon: finalLocation.lon
                };

            } else {
                const errorMsg = `La ciudad "${cityFromNominatim}" (obtenida de Nominatim) no fue encontrada en tus datos citiesData.json.`;
                setError(errorMsg);
                setLocation(null);
                setCityName(null); // Limpia la ciudad si no se encuentra en JSON
                console.warn(errorMsg);
                return null; // No se encontró la ciudad en el JSON
            }


        } catch (err) {
            let errorMessage = "Error en el proceso de obtener detalles de ubicación: ";
            if (err && typeof err === 'object' && 'code' in err) {
                switch (err.code) {
                    case err.PERMISSION_DENIED: errorMessage += "Permiso de geolocalización denegado."; break;
                    case err.POSITION_UNAVAILABLE: errorMessage += "Información de ubicación no disponible."; break;
                    case err.TIMEOUT: errorMessage += "Tiempo de espera agotado."; break;
                    case err.UNKNOWN_ERROR: errorMessage += "Error desconocido de geolocalización."; break;
                    default: errorMessage += `Código ${err.code}.`; break;
                }
                if (err.message) errorMessage += ` ${err.message}`;
            } else if (err instanceof Error) {
                // Errores de fetch en getCityFromCoords o cualquier otro Error lanzado
                errorMessage += `Error interno o de API: ${err.message}`;
            } else {
                errorMessage += "Un error inesperado ocurrió.";
                if (err) console.error("Detalles del error inesperado:", err);
            }

            setError(errorMessage);
            setLocation(null);
            setCityName(null);
            console.error(errorMessage, err);
            return null; // Retorna null en caso de error

        } finally {
            setIsLoading(false);
        }
    }, [getCityFromCoords, citiesData]); // Dependencia: getCityFromCoords

    // NUEVA FUNCIÓN: Busca una ciudad en citiesData.json y actualiza el estado
    const searchCityInJson = useCallback((cityNameToFind, countryCode) => {
        setIsLoading(true); // Indica que se está procesando la búsqueda
        setError(null);
        setLocation(null);
        setCityName(null);


        if (!cityNameToFind || !countryCode) {
            const errorMsg = "Se requiere nombre de ciudad y código de país para buscar en el JSON.";
            setError(errorMsg);
            setIsLoading(false);
            console.warn(errorMsg);
            return;
        }

        // Buscar la ciudad en los datos del JSON
        const foundCity = citiesData.find(city =>
            city.city === cityNameToFind && city.iso2 === countryCode
        );

        if (foundCity) {
            const cityLocation = {
                lat: parseFloat(foundCity.lat),
                lon: parseFloat(foundCity.lng)
            };
            setLocation(cityLocation); // Actualiza la ubicación con las coordenadas del JSON
            setCityName(foundCity.city); // Actualiza el nombre de la ciudad

            console.log(`Ciudad "${cityNameToFind}" encontrada en JSON:`, foundCity);

        } else {
            const errorMsg = `Ciudad "${cityNameToFind}" no encontrada en los datos para el país ${countryCode}.`;
            setError(errorMsg);
            setLocation(null);
            setCityName(null);
            console.warn(errorMsg);
        }

        setIsLoading(false); // Finaliza la carga
    }, []); // Dependencia: citiesData (importado estáticamente, no necesita estar aquí)


    // Efecto para obtener la ubicación inicial al montar el componente
    useEffect(() => {
        console.log("Componente montado, obteniendo ubicación inicial...");
        // Por defecto, intenta obtener la ubicación del navegador al iniciar
        getLocationDetails();

        // Si quisieras iniciar buscando una ciudad específica del JSON al cargar,
        // podrías llamar a searchCityInJson aquí con los valores por defecto.
        // Ejemplo: searchCityInJson("Madrid", "ES");

    }, [getLocationDetails]); // Dependencia: getLocationDetails


    // Función para guardar la ubicación (la que esté actualmente en el estado 'location')
    const saveCurrentLocationToLocalStorage = useCallback(() => {
        if (location) {
            try {
                localStorage.setItem('userLat', location.lat.toString());
                localStorage.setItem('userLon', location.lon.toString());
                console.log("Ubicación guardada en localStorage:", location);
                alert("¡Tu ubicación ha sido guardada!");
            } catch (error) {
                console.error("Error saving location to localStorage:", error);
                alert("Error al guardar la ubicación.");
            }
        } else {
            console.warn("No location available to save.");
        }
    }, [location]);


    // Expone el estado y las funciones relevantes
    return {
        location, // Coordenadas de la ubicación (ya sea del navegador o del JSON)
        cityName, // Nombre de la ciudad (ya sea del navegador o del JSON)
        isLoading, // Estado de carga
        error, // Estado de error
        getLocationDetails, // Función para obtener ubicación del navegador
        searchCityInJson, // <--- Nueva función para buscar en el JSON
        saveCurrentLocationToLocalStorage // Función para guardar la ubicación actual
    };
};

export { useLocationService };

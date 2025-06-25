import React, { useEffect, useState, useCallback } from "react";
import Filters from "../components/Filters";
import ArticleList from "../components/ArticleList";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import useUserLocation from "../hooks/useUserLocation"; // ELIMINADO
import { calcularDistanciaKm } from "../utils/distance";
import { useLocationService } from '../components/LocationService'; // Importa el hook

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Home = () => {

    const [data, setData] = useState([]); // Estado para la lista original de artículos
    // const { location, getLocation } = useUserLocation(); // ELIMINADO

    // Usamos el hook useLocationService para gestionar la ubicación
    const {
        location, // Coordenadas de la ubicación (lat/lon)
        cityName, // Nombre de la ciudad
        isLoading, // Estado de carga del servicio de ubicación
        error, // Estado de error del servicio de ubicación
        getLocationDetails // Función para obtener detalles de ubicación (navegador + Nominatim + JSON)
    } = useLocationService();

    const [locationDetailsResult, setLocationDetailsResult] = useState(null); // Estado para guardar el resultado de getLocationDetails
    const [cities, setCities] = useState([]); // Nuevo estado para las ciudades únicas

    // Efecto para obtener la ubicación inicial al montar el componente
    useEffect(() => {
        const fetchInitialLocation = async () => {
            console.log("Home: Obteniendo ubicación inicial...");
            // Llama a la función del hook y espera el resultado
            const result = await getLocationDetails();

            // Guarda el resultado si es necesario para algo específico en Home
            if (result) {
                console.log("Home: Resultado de ubicación inicial obtenido:", result);
                setLocationDetailsResult(result);
            } else {
                console.log("Home: No se pudieron obtener detalles de ubicación inicial válidos.");
                setLocationDetailsResult(null);
            }
        };

        // Ejecuta la función asíncrona al montar
        fetchInitialLocation();

        // Array de dependencias vacío para que se ejecute solo una vez al montar.
        // Incluimos getLocationDetails si es una dependencia externa que podría cambiar.
    }, [getLocationDetails]); // Dependencia: getLocationDetails


    // Efecto para obtener la lista inicial de artículos
    useEffect(() => {
        console.log("Home: Obteniendo lista inicial de artículos...");
        fetch(`${API_BASE_URL}people`)
            .then((response) => {
                if (!response.ok) {
                    console.error(`Error al obtener artículos: ${response.status} - ${response.statusText}`);
                    // Intentar leer el cuerpo del error si está disponible
                    response.text().then(text => console.error('Cuerpo del error:', text));
                    throw new Error(`Error al obtener artículos: ${response.status}`);
                }
                return response.json();
            })
            .then((json) => {
                setData(json);
                console.log("Home: Artículos obtenidos:", json.length);
            })
            .catch((error) => console.error("Home: Error al obtener artículos:", error));
    }, []); // Array de dependencias vacío para que se ejecute solo una vez al montar

    const articles = data; // La lista original de artículos

    // Efecto para extraer ciudades únicas cuando los datos cambian
    useEffect(() => {
        if (data && data.length > 0) {
            const uniqueCities = new Set();
            data.forEach(person => {
                const cityTag = person.tags?.find(tag => tag.tipo === "ciudad");
                if (cityTag && cityTag.valor) {
                    uniqueCities.add(cityTag.valor);
                }
            });
            setCities(Array.from(uniqueCities));
        }
    }, [data]); // Este efecto depende de los datos

    // Función auxiliar para obtener las zonas (nacionalidades) de los artículos
    const getZones = useCallback(() => {
        if (articles) {
            const zones = [];
            for (let article of articles) {
                const zone = article.tags?.find(tag => tag.tipo === "nacionalidad");
                if (zone && zone.valor && !zones.includes(zone.valor)) // Añadir verificación zone.valor
                    zones.push(zone.valor)
            }
            return zones;
        }
        return []; // Retornar un array vacío si no hay artículos
    }, [articles]); // Dependencia: articles

    const [filters, setFilters] = useState({
        name: "",
        zone: "",
        categories: [],
        distance: 0,
        city: "", // Nuevo campo para el filtro de ciudad
    });

    // Efecto para manejar la obtención de ubicación si el filtro de distancia es activado
    // Este efecto se ejecuta cuando cambian los filtros
    useEffect(() => {
        // Si el filtro de distancia es mayor que 0 Y aún no tenemos una ubicación válida,
        // intentar obtener la ubicación.
        // Usamos 'location' del hook useLocationService.
        if (filters.distance > 0 && !location) {
            console.log("Home: Filtro de distancia activado y ubicación no disponible. Obteniendo ubicación...");
            const fetchLocationForDistance = async () => {
                await getLocationDetails(); // Llama a la función para obtener la ubicación y actualizar el estado del hook
                // No necesitamos capturar el resultado aquí directamente si el estado del hook se actualiza.
                // La lógica de filtrado usará el estado 'location' del hook.
            };
            fetchLocationForDistance();

        } else if (filters.distance > 0 && location) {
            console.log("Home: Filtro de distancia activado y ubicación disponible.");
            // La lógica de filtrado se encargará de usar la ubicación
        } else if (filters.distance === 0 && location) {
            console.log("Home: Filtro de distancia desactivado, ubicación disponible.");
        } else {
            console.log("Home: No se aplica filtro de distancia o no hay ubicación.");
        }
    }, [filters, location, getLocationDetails]); // Dependencias: filters, location del hook, y getLocationDetails

    // Lógica de filtrado de artículos - USA EL ESTADO 'location' DEL HOOK useLocationService
    const filteredArticles = articles.filter((article) => {
        // Filtro por nombre
        const nameTag = article.tags?.find(tag => tag.tipo === "nombre");
        const matchesName =
            filters.name
                ? nameTag?.valor?.toLowerCase().includes(filters.name.toLowerCase())
                : true; // Si el filtro de nombre está vacío, todos coinciden

        // Filtro por zona (nacionalidad)
        const zoneTag = article.tags?.find(tag => tag.tipo === "nacionalidad");
        const matchesZone = filters.zone
            ? zoneTag?.valor === filters.zone
            : true; // Si el filtro de zona está vacío, todos coinciden

        // Filtro por categorías
        let matchesCategories = true; // Por defecto, coincide si no hay filtro de categorías

        if (filters.categories && filters.categories.length > 0) {
            matchesCategories = false; // Si hay filtro, debe coincidir con al menos una categoría
            const categoryTag = article.tags?.find(tag => tag.tipo === "categoria");

            if (categoryTag && categoryTag.valor) {
                // Verificar si el valor de la categoría del artículo está en el array de categorías filtradas
                if (filters.categories.includes(categoryTag.valor)) {
                    matchesCategories = true;
                }
            } else if (article.media?.length > 0) {
                // Tu lógica original: si no tiene tag de categoría pero tiene media, coincide si no hay filtro de categorías?
                // Esta parte parece un poco confusa en la lógica original.
                // Si hay filtros de categoría (filters.categories.length > 0), un artículo SIN tag de categoría
                // O con tag de categoría pero sin valor, NO debería coincidir a menos que ese sea el comportamiento deseado.
                // Ajustamos para que solo coincida si el valor de la categoría está en los filtros seleccionados.
                matchesCategories = false; // No coincide si no tiene tag de categoría y hay filtros activos
            }
        }
        // Si no hay filtros de categoría (filters.categories.length === 0), todos coinciden (ya cubierto por matchesCategories = true; inicial)


        // Filtro por distancia - USA EL ESTADO 'location' DEL HOOK useLocationService
        let isNear = true; // Por defecto, todos coinciden si el filtro de distancia no está activo

        if (filters.distance > 0 && location) {
            // Si el filtro de distancia está activado Y tenemos la ubicación
            isNear = false; // Por defecto, no coincide hasta que se calcule la distancia

            const coordsTag = article.tags?.find(tag => tag.tipo === "mapa");
            if (coordsTag && coordsTag.valor) {
                const [latStr, lonStr] = coordsTag.valor.split(',');
                // Validar que las coordenadas sean números válidos
                const articleLat = parseFloat(latStr);
                const articleLon = parseFloat(lonStr);

                if (!isNaN(articleLat) && !isNaN(articleLon)) {
                    try {
                        // Usa la ubicación obtenida del hook (location.lat, location.lon)
                        const distance = calcularDistanciaKm(location.lat, location.lon, articleLat, articleLon);
                        // console.log(`Distancia al artículo ${article.id}: ${distance} km`);
                        isNear = distance <= filters.distance; // Corregido: debería ser <= filters.distance para estar DENTRO del radio
                    } catch (distError) {
                        console.error("Error calculando distancia:", distError);
                        isNear = false; // Considerar que no está cerca si hay error de cálculo
                    }
                } else {
                    console.warn(`Coordenadas inválidas para el tag "mapa" del artículo ${article.id}:`, coordsTag.valor);
                    isNear = false; // Considerar que no está cerca si las coordenadas del artículo son inválidas
                }
            } else {
                // Si el artículo no tiene un tag "mapa" o su valor es inválido, no puede estar cerca
                isNear = false;
            }
        }

        // Filtro por ciudad
        const cityTag = article.tags?.find(tag => tag.tipo === "ciudad");
        const matchesCity = filters.city
            ? cityTag?.valor?.toLowerCase().includes(filters.city.toLowerCase()) // Filtrar por inclusión de texto, no coincidencia exacta
            : true; // Si el filtro de ciudad está vacío, todos coinciden

        // Un artículo pasa todos los filtros si todas las condiciones son verdaderas
        return matchesName && matchesZone && matchesCategories && isNear && matchesCity;
    });

    // Opcional: Mostrar estado de carga y error del servicio de ubicación en la UI
    // Puedes añadir esto en tu JSX para dar feedback al usuario
    // {isLoading && <p>Obteniendo ubicación...</p>}
    // {error && <p style={{ color: 'red' }}>Error de ubicación: {error}</p>}


    return (
        <div>
            <Header></Header>
            <div className="container ps-5">
                <h3>Modelos</h3>
                {/* Puedes mostrar la ciudad obtenida aquí si quieres */}
                {/* {cityName && <p>Ubicación: {cityName}</p>} */}
            </div>
            {/* Pasar el estado 'location' al componente Filters si lo necesita (aunque setFilters ya se pasa) */}
            <Filters
                setFilters={setFilters}
                zones={articles ? getZones() : ["Cargando zonas..."]} // Mostrar mensaje de carga si no hay artículos
                cities={cities} // Pasar las ciudades únicas como prop
            // Pasa la ubicación y ciudad al componente Filters si necesita mostrarlas o usarlas internamente
            // currentLocation={location}
            // currentCityName={cityName}
            // isLoadingLocation={isLoading}
            // locationError={error}
            />
            {/* Puedes añadir un mensaje si la lista de artículos filtrados está vacía */}
            {/* {filteredArticles.length === 0 && !isLoading && !error && articles.length > 0 && (
                 <p>No se encontraron modelos que coincidan con los filtros aplicados.</p>
             )}
              {filteredArticles.length === 0 && !isLoading && !error && articles.length === 0 && (
                 <p>Cargando modelos...</p> // O un spinner
             )} */}

            <ArticleList quality="Damas, Caballeros y Masajistas" articles={filteredArticles} />
            <Footer></Footer>
        </div>
    );
};

export default Home;

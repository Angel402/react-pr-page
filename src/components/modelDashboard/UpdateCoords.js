import MapSection from "./MapSection";
import React, {useEffect, useState} from "react";
import {getCountries} from "@yusifaliyevpro/countries";
import citiesData from "../../cities.json";
import {getCookie} from "../../utils/cookies";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function UpdateCoords ({data}) {

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [coords, setCoords] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);



    useEffect(() => {
        async function fetchData() {
            const countries = await getCountries({
                fields: ["name", "capital", "cca2"],
            });
            let countriesOrd = countries
                .map(country => ({
                    name: country.name.common,
                    code: country.cca2
                })).sort((a, b) => a.name.localeCompare(b.name));
            setCountries(countriesOrd);
        }
        setSelectedCountry(data.tags.find((a) => a.tipo === "country")?.valor);
        setSelectedCity(data.tags.find((a) => a.tipo === "ciudad")?.valor);
        setCoords(data.tags.find((a) => a.tipo === "mapa")?.valor);
        fetchData();
    }, []);

    useEffect(() => {
        if (Array.isArray(countries) && countries.length > 0 && selectedCountry) {
            getCitiesByCountry(countries.find(f => f.name === selectedCountry).code);
        }
    }, [countries, selectedCountry]);

    useEffect(() => {
        console.log('El estado de cities ha cambiado:', selectedCity);

        const cityNames = filteredCities.find(city => city.city === selectedCity);

        console.log(cityNames);

        if (cityNames) {
            console.log('Ciudad seleccionada:', cityNames.city);
            console.log('Latitud:', cityNames.lat);
            console.log('Longitud:', cityNames.lng);
            if (selectedCity === data.tags.find((a) => a.tipo === "ciudad")?.valor && coords === data.tags.find((a) => a.tipo === "mapa")?.valor) return;
            setCoords(`${cityNames.lat},${cityNames.lng}`);
            let token = getCookie("token");

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "latitud": cityNames.lat,
                "longitud": cityNames.lng,
                "ciudad": cityNames.city,
                "token": token
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`${API_BASE_URL}ubicaciones`, requestOptions)
                .then(response => response.json())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
    }, [selectedCity]);

    const getCitiesByCountry = async (countryCode) => {
        try {
            const cities = citiesData.filter(city => city.iso2 === countryCode);

            setFilteredCities(cities);

            if (cities.length > 0) {
                const cityNames = cities.map(city => city.city)
                    .sort((a, b) => a.localeCompare(b));
                setCities(cityNames);
                console.log(`Found ${cityNames.length} cities for country code ${countryCode}`);
            } else {
                console.warn(`No cities found for country code ${countryCode} in local data.`);
                setCities([]); // Clear cities if none found
                setFilteredCities([]);
            }

        } catch (error) {
            console.error("Error al obtener ciudades:", error);
            setCities([]);
            setFilteredCities([]);
            return [];
        }
    };

    async function prepareTagChanges(oldTags, newTags) {
        const tagsToAdd = [];
        const tagsToUpdate = [];
        const tagsToDelete = [];


        const oldMap = new Map();
        oldTags.forEach(tag => {
            const key = `${tag.tipo}:${tag.valor}`;
            oldMap.set(key, tag);
        });

        const seenKeys = new Set();

        newTags.forEach(tag => {
            if (tag.valor === undefined || tag.valor === "") return;

            const key = `${tag.tipo}:${tag.valor}`;
            seenKeys.add(key);

            const existing = oldTags.find(t => t.tipo === tag.tipo);
            if (!existing) {
                tagsToAdd.push(tag);
            } else if (existing.valor !== tag.valor) {
                tagsToUpdate.push({ id: existing.id, tipo: tag.tipo, valor: tag.valor });
            }
        });

        oldTags.forEach(tag => {
            if (tag.tipo === "views") return;
            const stillExists = newTags.find(t => (t.tipo === tag.tipo && t.valor !== undefined && t.valor !== ""));
            if (!stillExists) {
                tagsToDelete.push(tag.id);
            }
        });

        return { tagsToAdd, tagsToUpdate, tagsToDelete };
    }

    async function syncTags(tagsToAdd, tagsToUpdate, tagsToDelete) {
        try {
            if (tagsToAdd.length > 0) {
                const response = await fetch(`${API_BASE_URL}tags/add/${data.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tags: tagsToAdd,
                        token: getCookie("token")
                    })
                });
                if (!response.ok) throw new Error('Error al añadir tags');
            }

            if (tagsToUpdate.length > 0) {
                const response = await fetch(`${API_BASE_URL}tags/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tags: tagsToUpdate,
                        token: getCookie("token")
                    })
                });
                if (!response.ok) throw new Error('Error al modificar tags');
            }

            if (tagsToDelete.length > 0) {
                const response = await fetch(`${API_BASE_URL}tags/delete`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tags: tagsToDelete,
                        token: getCookie("token")
                    })
                });
                if (!response.ok) throw new Error('Error al eliminar tags');
            }
            /*setLoading(false);
            setModifiesModal(true);
            setSuccessfulMessage("Datos actualizados correctamente \nEs necesario refrescar para seguir navegando");*/
        } catch (err) {
            /*setLoading(false);
            setErrorUploadMessage(`Error al sincronizar tags: ${err.message}`);*/
            console.error('Error al sincronizar tags:', err.message);
        }
    }

    async function handleUpdateCoords() {

        const oldTags = data.tags;
        const tagList = [{tipo: 'mapa', valor: coords}, {tipo: 'country', valor: selectedCountry}, {tipo: 'ciudad', valor: selectedCity}];
        const { tagsToAdd, tagsToUpdate, tagsToDelete } = await prepareTagChanges(oldTags, tagList);
        syncTags(tagsToAdd, tagsToUpdate, tagsToDelete);
    }

    return (<>
        <div className={"m-4"}>
            <MapSection
                cities={cities}
                countries={countries}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedCity={selectedCity}
                coords={coords}
                setCoords={setCoords}
                handleClickDropDown={()=>{}}
                handleCityChange={(e)=>setSelectedCity(e.target.value)}
            />
            <div className={'d-flex justify-content-center'}>
                <button className={"btn general-btn"} onClick={handleUpdateCoords}>Actualizar</button>
            </div>
        </div>
    </>);
}
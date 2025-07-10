import React, { useEffect, useState } from "react";
import citiesData from "../../cities.json";
import DashboardInputField from "./DashboardInputField";
import DashboardDropDown from "./DashboardDropDown";
import DashboardMapCheckBoxes from "./DashboardMapCheckBoxes";
import DashboardTextArea from "./DashboardTextArea";
import PaymentMethodsSelector from "./PaymentMethodsSelector";
import { getCookie } from "../../utils/cookies";
import BaseModal from "../BaseModal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { getCountries } from "@yusifaliyevpro/countries";
import MapSection from "./MapSection";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function DashboardPersonalData({ hasDafault, data, id }) {
    const categories = ["Dama", "Virtual", "Dama Virtual", "Trans", "Trans Virtual", "Caballero de Compañia", "Caballero Virtual", "Masajista"];
    const services = ["Presencial", "A Domicilio", "Virtual", "Masajista", "Streaptease"];
    const depilations = ["Si", "No", "Rebajados"];
    const bodyTypes = ["Delgado/a", "Robusto/a", "Voluptuoso/a", "Curvy", "BBW"];
    const sizes = ["Pequeño", "Normal", "Grande", "Gigante"];
    const biotipes = ["Natural", "Operado/a"];
    const oralTypes = ["Al Natural", "Con Protección", " Garganta profunda", "69"];
    const fantasyTypes = ["Todas", "Juguetes", "Disfraces", "Lencería", "Juego de Roles", "Cambio de Roles", "Adoración de Pies", "Dominación", "Sumisa", "BDSM",
        "Lluvia Dorada", "Fisting", "Anal", "Squirt", "Sadomasoquismo", "A consultar"];
    const massageTypes = ["Convencional", "Erótico", "Relajante", "Sensitivo", "Tántrico", "Estimulante", "Prostático", "Antiestrés"];
    const virtualServices = ["Creadora de contenido", "Videollamadas", "Novia virtual", "Videos personalizados", "Pack de Fotos", "Pack de videos pregrabados",
        "Foto Zing", "Gif Zing", "Dickrate", "Sexting", "Chat Hot", "Canal VIP Telegram", "Venta de ropa interior", "Servicios Personalizados", "Otros a consultar"];
    const aditionals = ["Eyaculación Cuerpo", "Eyaculación Pecho", "Eyaculación Facial", "Mujeres y Hombres", "Atención a Parejas", "Trios M/H/M", "Trios H/M/H",
        "Lésbicos", "Poses varias", "Besos", "Bailes"];
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
    const uniqueTypes = ["nombre", "edad", "estatura", "peso", "medidas", "nacionalidad", "about_me", "cabello", "ojos", "piel", "depilacion", "cuerpo", "busto",
        "cola", "biotipo", "categoria", "ciudad", "tel_whatssapp", "tel_telegram", "KYC_name", "KYC_date", "KYC_ID", "mapa", "nacionalidad"];


    const [showedDropdown, setShowedDropdown] = useState(0);
    const [currentStep, setCurentStep] = useState(0);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("");
    const [nationality, setNationality] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [coords, setCoords] = useState("");

    useEffect(() => {
        if (Array.isArray(countries) && countries.length > 0 && selectedCountry) {
            getCitiesByCountry(countries.find(f => f.name === selectedCountry).code);
        }
    }, [countries, selectedCountry]);

    useEffect(() => {
        const cities = citiesData.map(city => city);

        // Almacena las ciudades filtradas en el estado
        setFilteredCities(cities);
    }, []);

    useEffect(() => {
        console.log('El estado de cities ha cambiado:', selectedCity); // Esto ya lo tenías

        const cityNames = filteredCities.find(city => city.city === selectedCity);

        console.log(cityNames);

        // Si tienes una ciudad seleccionada y quieres trabajar con ella
        if (cityNames) {
            console.log('Ciudad seleccionada:', cityNames.city);
            console.log('Latitud:', cityNames.lat);
            console.log('Longitud:', cityNames.lng);
            if (!hasDafault) {
                if (selectedCity === data.tags.find((a) => a.tipo === "ciudad")?.valor && coords === data.tags.find((a) => a.tipo === "mapa")?.valor) return;
            }
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

    useEffect(() => {
        console.log(coords);
    }, [coords]);

    const handleCityChangeLogic = (cityValue) => {
        console.log('Ciudad seleccionada:', cityValue);
        setSelectedCity(cityValue); // Actualiza el estado selectedCity

        // **Aquí puedes poner la lógica adicional que tenías en tu useEffect anterior**
        // Por ejemplo, buscar las coordenadas de la ciudad seleccionada
        // o realizar otra acción basada en la ciudad seleccionada.

        // Si necesitas encontrar el objeto de la ciudad completa:
        // const selectedCityObject = filteredCities.find(city => city.city === cityValue); // O por ID si usas ID
        // if (selectedCityObject) {
        //     console.log('Lat:', selectedCityObject.lat, 'Lng:', selectedCityObject.lng);
        //     // Realiza acciones con las coordenadas
        // }
    };

    const handleCityChange = (e) => {
        handleCityChangeLogic(e.target.value);
    };

    const [selectedDepilation, setSelectedDepilation] = useState("");
    const [selectedBody, setSelectedBody] = useState("");
    const [selectedBust, setSelectedBust] = useState("");
    const [selectedButty, setSelectedButty] = useState("");
    const [selectedBioType, setSelectedBioType] = useState("");

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedOrals, setSelectedOrals] = useState([]);
    const [selectedFantasies, setSelectedFantasies] = useState([]);
    const [selectedMassages, setSelectedMassages] = useState([]);
    const [selectedVirtuals, setSelectedVirtuals] = useState([]);
    const [selectedAditionals, setSelectedAditionals] = useState([]);

    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [hair, setHair] = useState("");
    const [eyes, setEyes] = useState("");
    const [skin, setSkin] = useState("");
    const [modelName, setModelName] = useState("");
    const [description, setDescription] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [whatsappExtention, setWhatsappExtention] = useState("");
    const [telegram, setTelegram] = useState("");
    const [bodyMeasurements, setBodyMeasurements] = useState({ busto: "", cintura: "", cadera: "" });
    const [paymentMethods, setPaymentMethods] = useState([]);

    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);

    const toggleDia = (dia) => {
        setDiasSeleccionados((prev) =>
            prev.includes(dia)
                ? prev.filter((d) => d !== dia)
                : [...prev, dia]
        );
    };

    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [idDocument, setIdDocument] = useState("");

    const [modifiesModal, setModifiesModal] = useState(false);

    const [errorUploadMessage, setErrorUploadMessage] = useState("");
    const [successfulMessage, setSuccessfulMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
            //console.log(countriesOrd);
            setCountries(countriesOrd);
            //getCountries();
            getModelData();
        }

        fetchData();
    }, []);


    function formatAvailabilityString(horaInicio, horaFin, diasSeleccionados) {

        return horaInicio && horaFin && diasSeleccionados ? `${horaInicio}|${horaFin}|${diasSeleccionados.sort().join(",")}` : "";
    }

    function parseAvailabilityString(str) {
        const [horaInicio, horaFin, diasStr] = str.split("|");
        const diasSeleccionados = diasStr ? diasStr.split(",") : [];
        setHoraInicio(horaInicio);
        setHoraFin(horaFin);
        setDiasSeleccionados(diasSeleccionados);
    }

    const getModelData = () => {
        if (hasDafault) return;

        setModelName(data.tags.find((a) => a.tipo === "nombre")?.valor);
        setAge(data.tags.find((a) => a.tipo === "edad")?.valor);
        setHeight(data.tags.find((a) => a.tipo === "estatura")?.valor);
        setWeight(data.tags.find((a) => a.tipo === "peso")?.valor);
        if (data.tags.find((a) => a.tipo === "medidas")) parseMeasurements(data.tags.find((a) => a.tipo === "medidas")?.valor);
        setSelectedCountry(data.tags.find((a) => a.tipo === "country")?.valor);
        setNationality(data.tags.find((a) => a.tipo === "nacionalidad")?.valor);
        setDescription(data.tags.find((a) => a.tipo === "about_me")?.valor);
        setHair(data.tags.find((a) => a.tipo === "cabello")?.valor);
        setEyes(data.tags.find((a) => a.tipo === "ojos")?.valor);
        setSkin(data.tags.find((a) => a.tipo === "piel")?.valor);
        setSelectedDepilation(data.tags.find((a) => a.tipo === "depilacion")?.valor);
        setSelectedBody(data.tags.find((a) => a.tipo === "cuerpo")?.valor);
        setSelectedBust(data.tags.find((a) => a.tipo === "busto")?.valor);
        setSelectedButty(data.tags.find((a) => a.tipo === "cola")?.valor);
        setSelectedBioType(data.tags.find((a) => a.tipo === "biotipo")?.valor);
        setSelectedCategory(data.tags.find((a) => a.tipo === "categoria")?.valor);
        setSelectedServices(data.tags.filter(item => item.tipo === "servicio").map((a) => a.valor));
        setSelectedOrals(data.tags.filter(item => item.tipo === "tipo_oral").map((a) => a.valor));
        setSelectedFantasies(data.tags.filter(item => item.tipo === "tipo_fantasia").map((a) => a.valor));
        setSelectedMassages(data.tags.filter(item => item.tipo === "tipo_masajes").map((a) => a.valor));
        setSelectedVirtuals(data.tags.filter(item => item.tipo === "servicios_virtuales").map((a) => a.valor));
        setSelectedAditionals(data.tags.filter(item => item.tipo === "adicionales").map((a) => a.valor));
        setSelectedCity(data.tags.find((a) => a.tipo === "ciudad")?.valor);
        setCoords(data.tags.find((a) => a.tipo === "mapa")?.valor);
        if (data.tags.find((a) => a.tipo === "horario")) parseAvailabilityString(data.tags.find((a) => a.tipo === "horario").valor)
        const telTag = data.tags.find((a) => a.tipo === "tel_whatssapp");
        if (telTag?.valor) {
            const [ext, tel] = telTag.valor.split("|");
            setWhatsapp(tel);
            setWhatsappExtention(ext);
        }
        setTelegram(data.tags.find((a) => a.tipo === "tel_telegram")?.valor);
        setPaymentMethods(data.tags.filter(item => item.tipo === "metodo_de_pago").map((a) => a.valor));
        setFullName(data.tags.find((a) => a.tipo === "KYC_name")?.valor);
        setBirthDate(data.tags.find((a) => a.tipo === "KYC_date")?.valor);
        setIdDocument(data.tags.find((a) => a.tipo === "KYC_ID")?.valor);
    }

    const getCitiesByCountry = async (countryCode) => {
        try {
            // Filter cities based on countryCode using the iso2 property
            //const filteredCities = citiesData.filter(city => city.iso2 === countryCode);

            const cities = citiesData.filter(city => city.iso2 === countryCode);

            // Almacena las ciudades filtradas en el estado
            setFilteredCities(cities);

            if (cities.length > 0) {
                // Map to city names and sort alphabetically
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
            // Log any errors that occur during filtering or processing local data
            // This catch block might not be strictly necessary for a simple filter,
            // but is good practice if parsing/more complex logic were involved.
            console.error("Error al obtener ciudades:", error);
            setCities([]);
            setFilteredCities([]);
            return [];
        }
    };

    const handleClickDropDown = (dropDownId) => {

        if (showedDropdown === dropDownId) {
            dropDownId = 0;
        }
        setShowedDropdown(dropDownId);
    }

    const prevStep = () => {
        if (currentStep <= 0) return;
        setCurentStep(currentStep - 1);
    }

    function parseMeasurements(measurementsString) {
        const parts = measurementsString.split("/");

        setBodyMeasurements({
            busto: parts[0] || "",
            cintura: parts[1] || "",
            cadera: parts[2] || ""
        })
    }



    const buildData = async () => {
        setLoading(true);
        setErrorUploadMessage("");
        setSuccessfulMessage("");
        setModifiesModal(true);
        let tagList = [];
        tagList.push({ tipo: "nombre", valor: modelName });
        tagList.push({ tipo: "edad", valor: age });
        tagList.push({ tipo: "estatura", valor: height });
        tagList.push({ tipo: "peso", valor: weight });
        if (bodyMeasurements.busto && bodyMeasurements.cintura && bodyMeasurements.cadera)
            tagList.push({ tipo: "medidas", valor: `${bodyMeasurements.busto}/${bodyMeasurements.cintura}/${bodyMeasurements.cadera}` });
        tagList.push({ tipo: "nacionalidad", valor: nationality });
        tagList.push({ tipo: "country", valor: selectedCountry });
        tagList.push({ tipo: "about_me", valor: description });
        tagList.push({ tipo: "cabello", valor: hair });
        tagList.push({ tipo: "ojos", valor: eyes });
        tagList.push({ tipo: "piel", valor: skin });
        tagList.push({ tipo: "depilacion", valor: selectedDepilation });
        tagList.push({ tipo: "cuerpo", valor: selectedBody });
        tagList.push({ tipo: "busto", valor: selectedBust });
        tagList.push({ tipo: "cola", valor: selectedButty });
        tagList.push({ tipo: "biotipo", valor: selectedBioType });
        tagList.push({ tipo: "categoria", valor: selectedCategory });
        tagList = [...tagList, ...selectedServices.map(value => ({ tipo: "servicio", valor: value }))];
        tagList = [...tagList, ...selectedOrals.map(value => ({ tipo: "tipo_oral", valor: value }))];
        tagList = [...tagList, ...selectedFantasies.map(value => ({ tipo: "tipo_fantasia", valor: value }))];
        tagList = [...tagList, ...selectedMassages.map(value => ({ tipo: "tipo_masajes", valor: value }))];
        tagList = [...tagList, ...selectedVirtuals.map(value => ({ tipo: "servicios_virtuales", valor: value }))];
        tagList = [...tagList, ...selectedAditionals.map(value => ({ tipo: "adicionales", valor: value }))];
        tagList.push({ tipo: "ciudad", valor: selectedCity });
        tagList.push({ tipo: "mapa", valor: coords });
        tagList.push({ tipo: "horario", valor: formatAvailabilityString(horaInicio, horaFin, diasSeleccionados) })
        if (whatsappExtention && whatsapp) tagList.push({ tipo: "tel_whatssapp", valor: whatsappExtention + "|" + whatsapp });
        tagList.push({ tipo: "tel_telegram", valor: telegram });
        tagList = [...tagList, ...paymentMethods.map(value => ({ tipo: "metodo_de_pago", valor: value }))];
        tagList.push({ tipo: "KYC_name", valor: fullName });
        tagList.push({ tipo: "KYC_date", valor: birthDate });
        tagList.push({ tipo: "KYC_ID", valor: idDocument });
        //data.tags = tagList;
        let oldTags = data?.tags ? data.tags : [];
        const { tagsToAdd, tagsToUpdate, tagsToDelete } = await prepareTagChanges(oldTags, tagList, uniqueTypes);
        syncTags(tagsToAdd, tagsToUpdate, tagsToDelete);
        //    uploadData(data);

    }

    async function prepareTagChanges(oldTags, newTags, uniqueTypes) {
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

            if (uniqueTypes.includes(tag.tipo)) {
                const existing = oldTags.find(t => t.tipo === tag.tipo);
                if (!existing) {
                    tagsToAdd.push(tag);
                } else if (existing.valor !== tag.valor) {
                    tagsToUpdate.push({ id: existing.id, tipo: tag.tipo, valor: tag.valor });
                }
            } else {
                if (!oldMap.has(key)) {
                    tagsToAdd.push(tag);
                }
            }
        });

        oldTags.forEach(tag => {
            if (tag.tipo === "views") return;
            const key = `${tag.tipo}:${tag.valor}`;
            if (uniqueTypes.includes(tag.tipo)) {
                const stillExists = newTags.find(t => (t.tipo === tag.tipo && t.valor !== undefined && t.valor !== ""));
                if (!stillExists) {
                    tagsToDelete.push(tag.id);
                }
            } else {
                if (!seenKeys.has(key)) {
                    tagsToDelete.push(tag.id);
                }
            }
        });

        return { tagsToAdd, tagsToUpdate, tagsToDelete };
    }

    async function syncTags(tagsToAdd, tagsToUpdate, tagsToDelete) {
        try {
            if (hasDafault) {
                const response = await fetch(`${API_BASE_URL}create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: "jhon doe",
                        about: "jhon doe",
                        horario: "jhon doe",
                        tarifa: "jhon doe",
                        whatsapp: "jhon doe",
                        telegram: "jhon doe",
                        mapa: "jhon doe",
                        token: getCookie("token")
                    })
                });
                if (!response.ok) {
                    throw new Error('Error al crear persona');
                }
                const json = await response.json();
                tagsToDelete = json.tags.map(tag => tag.id);
                data = json;
            }

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
            setLoading(false);
            setModifiesModal(true);
            setSuccessfulMessage("Datos actualizados correctamente \nEs necesario refrescar para seguir navegando");
        } catch (err) {
            setLoading(false);
            setErrorUploadMessage(`Error al sincronizar tags: ${err.message}`);
            console.error('Error al sincronizar tags:', err.message);
        }
    }

    const nextStep = () => {
        setErrorMessage("");
        switch (currentStep) {
            case 0:
                if (!modelName || modelName.length < 3) {
                    setErrorMessage("El nombre de perfil debe contener minimo 3 caracteres");
                    return;
                }
                if (!age || age < 18 || age > 99) {
                    setErrorMessage("Tu edad debe de ser entre 18 y 99");
                    return;
                }
                if (age % 1 > 0) {
                    setErrorMessage("Tu edad no puede contener decimales");
                    return;
                }
                if (!height || height < 0 || height > 2.5) {
                    setErrorMessage("Tu estatura debe ser entre 0 y 2.5 (metros)");
                    return;
                }
                if (!weight || weight < 0 || weight > 250) {
                    setErrorMessage("Tu peso debe ser entre 0 y 250 (KG)");
                    return;
                }
                if ((bodyMeasurements.busto && (bodyMeasurements.busto < 0 || bodyMeasurements.busto > 200)) ||
                    (bodyMeasurements.busto && (bodyMeasurements.busto < 0 || bodyMeasurements.busto > 200)) ||
                    (bodyMeasurements.busto && (bodyMeasurements.busto < 0 || bodyMeasurements.busto > 200))) {
                    setErrorMessage("Tus medidas deben estar entre 0 y 200 (cm)");
                    return;
                }
                if (!countries.map((a) => a.name).includes(nationality)) {
                    setErrorMessage("Selecciona un pais");
                    return;
                }
                if (!description || description.length < 1 || description.length > 500) {
                    setErrorMessage("Coloca una descripción");
                    return;
                }
                break;
            case 1:
                if (!depilations.includes(selectedDepilation)) {
                    setErrorMessage("Elige que tipo de depilacion tienes");
                    return;
                }
                if (!bodyTypes.includes(selectedBody)) {
                    setErrorMessage("Elige que tipo de cuerpo que tienes");
                    return;
                }
                if (!sizes.includes(selectedBust)) {
                    setErrorMessage("Elige el tamaño de tu busto");
                    return;
                }
                if (!sizes.includes(selectedButty)) {
                    setErrorMessage("Elige el tamaño de tu cola");
                    return;
                }
                break;
            case 2:
                if (!categories.includes(selectedCategory)) {
                    setErrorMessage("Selecciona tu categoria");
                    return;
                }
                if (selectedServices.length < 1) {
                    setErrorMessage("Selecciona al menos un servicio");
                    return;
                }
                break;
            case 5:
                if (!fullName || fullName.length < 5 || fullName.length > 50) {
                    setErrorMessage("Ingresa un nombre valido");
                    return;
                }
                if (!birthDate) {
                    setErrorMessage("Ingresa una fecha de nacimiento valida");
                    return;
                }
                if (!idDocument || idDocument.length < 8 || idDocument.length > 15) {
                    setErrorMessage("La informacion de tu documento de identidad debe de ser de entre 8 a 15 caracteres");
                    return;
                }
                buildData();
                return;
            default:
                break;
        }
        setCurentStep(currentStep + 1);
    }

    return (<>

        {modifiesModal && (<>
            <BaseModal>
                <h2 className="bg-base mt-2 mb-4">Actualizacion de datos</h2>
                {loading && (
                    <div className="text-center mb-3">
                        <Spinner animation="border" />
                    </div>
                )}

                {errorMessage && (
                    <Alert variant="danger" className="alert-glass-danger mb-3 text-center">
                        {errorMessage}
                    </Alert>
                )}

                {successfulMessage && (
                    <Alert
                        variant="success"
                        className="alert-glass-success mb-3 text-center"
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {successfulMessage}
                    </Alert>
                )}

                {!loading && !errorMessage && successfulMessage && (
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn general-btn"
                            onClick={() => window.location.reload()}
                        >
                            Refrescar
                        </button>
                    </div>
                )}
            </BaseModal>
        </>)}

        {currentStep === 0 && (<>
            <DashboardInputField text={"Nombre"} placeholder={"Como se verá en tu perfil"} type={"text"} value={modelName} onChange={(e) => { setModelName(e.target.value) }} />
            <DashboardInputField text={"Edad"} placeholder={"18-99"} type={"number"} value={age} onChange={(e) => { setAge(e.target.value) }} />
            <DashboardInputField text={"Estatura"} placeholder={"0-2.50 M"} type={"number"} value={height} onChange={(e) => { setHeight(e.target.value) }} />
            <DashboardInputField text={"Peso"} placeholder={"0-250 KG"} type={"number"} value={weight} onChange={(e) => { setWeight(e.target.value) }} />
            <div className="d-flex m-auto" style={{ width: "70%" }}>
                <p style={{ margin: "12px 10px 0px 10px" }}>Medidas</p>
                <div className="general-input w-100">
                    <input className="m-0 bg-transparent border-0" placeholder="Busto (cm)" type="number" style={{ width: "32%", color: "var(--tag-color)" }}
                        value={bodyMeasurements.busto} onChange={(e) => {
                            setBodyMeasurements((prevMeasurements) => ({
                                ...prevMeasurements,
                                busto: e.target.value
                            }));
                        }}
                    />/
                    <input className="m-0 bg-transparent border-0" placeholder="Cintura (cm)" type="number" style={{ width: "32%", color: "var(--tag-color)" }}
                        value={bodyMeasurements.cintura} onChange={(e) => {
                            setBodyMeasurements((prevMeasurements) => ({
                                ...prevMeasurements,
                                cintura: e.target.value
                            }));
                        }}
                    />/
                    <input className="m-0 bg-transparent border-0" placeholder="Cadera (cm)" type="number" style={{ width: "32%", color: "var(--tag-color)" }}
                        value={bodyMeasurements.cadera} onChange={(e) => {
                            setBodyMeasurements((prevMeasurements) => ({
                                ...prevMeasurements,
                                cadera: e.target.value
                            }));
                        }}
                    />
                </div>
            </div>
            <DashboardDropDown
                onClick={() => { handleClickDropDown(3); }}
                value={nationality}
                onChange={(e) => {
                    setNationality(e.target.value);
                }}
                placeHolder={"Selecciona tu pais de nacimiento"}
                itemsToMap={countries.map(country => country.name)}
            />
            <DashboardTextArea
                text={"Descripcion"}
                placeholder={"Un mensaje sobre ti que servira para atraer a los clientes"}
                value={description}
                onChange={(e) => { setDescription(e.target.value) }} />
        </>)}

        {currentStep === 1 && (<>
            <DashboardInputField text={"Cabello"} placeholder={"Ejemplo: Rubia teñida"} type={"text"} value={hair} onChange={(e) => { setHair(e.target.value) }} />
            <DashboardInputField text={"Ojos"} placeholder={"Ejemplo: Cafe claro"} type={"text"} value={eyes} onChange={(e) => { setEyes(e.target.value) }} />
            <DashboardInputField text={"Piel"} placeholder={"Ejemplo: Morena"} type={"text"} value={skin} onChange={(e) => { setSkin(e.target.value) }} />

            <DashboardDropDown
                onClick={() => { handleClickDropDown(4); }}
                value={selectedDepilation}
                onChange={(e) => { setSelectedDepilation(e.target.value); }}
                placeHolder={"Selecciona un tipo de depilacion"}
                itemsToMap={depilations}
            />
            <DashboardDropDown
                onClick={() => { handleClickDropDown(5); }}
                value={selectedBody}
                onChange={(e) => { setSelectedBody(e.target.value); }}
                placeHolder={"Selecciona un tipo de cuerpo"}
                itemsToMap={bodyTypes}
            />
            <DashboardDropDown
                onClick={() => { handleClickDropDown(6); }}
                value={selectedBust}
                onChange={(e) => { setSelectedBust(e.target.value); }}
                placeHolder={"Selecciona un tamaño de busto"}
                itemsToMap={sizes}
            />
            <DashboardDropDown
                onClick={() => { handleClickDropDown(7); }}
                value={selectedButty}
                onChange={(e) => { setSelectedButty(e.target.value); }}
                placeHolder={"Selecciona un tamaño de cola"}
                itemsToMap={sizes}
            />
            <DashboardDropDown
                onClick={() => { handleClickDropDown(8); }}
                value={selectedBioType}
                onChange={(e) => { setSelectedBioType(e.target.value); }}
                placeHolder={"Selecciona un biotipo"}
                itemsToMap={biotipes}
            />
        </>)}

        {currentStep === 2 && (<>
            <DashboardDropDown
                onClick={() => { handleClickDropDown(1); }}
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); }}
                placeHolder={"Selecciona una categoria"}
                itemsToMap={categories}
            />
            <DashboardMapCheckBoxes
                onClick={() => { handleClickDropDown(2); }}
                showItems={showedDropdown === 2}
                onItemChanged={setSelectedServices}
                placeHolder={"Selecciona al menos un servicio"}
                itemsToMap={services}
                selectedItems={selectedServices}
            />
            <DashboardMapCheckBoxes
                onClick={() => { handleClickDropDown(9); }}
                showItems={showedDropdown === 9}
                onItemChanged={setSelectedOrals}
                placeHolder={"Selecciona uno o mas tipos de oral que puedes realizar"}
                itemsToMap={oralTypes}
                selectedItems={selectedOrals}
            />
            <DashboardMapCheckBoxes
                onClick={() => { handleClickDropDown(10); }}
                showItems={showedDropdown === 10}
                onItemChanged={setSelectedFantasies}
                placeHolder={"Selecciona una o mas fantasias"}
                itemsToMap={fantasyTypes}
                selectedItems={selectedFantasies}
            />
            <DashboardMapCheckBoxes
                onClick={() => { handleClickDropDown(11); }}
                showItems={showedDropdown === 11}
                onItemChanged={setSelectedMassages}
                placeHolder={"Selecciona uno o mas masajes"}
                itemsToMap={massageTypes}
                selectedItems={selectedMassages}
            />
            <DashboardMapCheckBoxes
                onClick={() => { handleClickDropDown(12); }}
                showItems={showedDropdown === 12}
                onItemChanged={setSelectedVirtuals}
                placeHolder={"Selecciona uno o mas servicios virtuales"}
                itemsToMap={virtualServices}
                selectedItems={selectedVirtuals}
            />
            <DashboardMapCheckBoxes
                onClick={() => { handleClickDropDown(13); }}
                showItems={showedDropdown === 13}
                onItemChanged={setSelectedAditionals}
                placeHolder={"Selecciona uno o mas servicios adicionales"}
                itemsToMap={aditionals}
                selectedItems={selectedAditionals}
            />
        </>)}

        {currentStep === 3 && (<>
            <MapSection
                cities={cities}
                countries={countries}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                handleClickDropDown={handleClickDropDown}
                selectedCity={selectedCity}
                handleCityChange={handleCityChange}
                coords={coords}
                setCoords={setCoords}
            />
        </>)}

        {currentStep === 4 && (<>
            <div className="m-auto mt-2 row" style={{ width: "70%" }}>
                <div className="col-md-4 px-1">
                    <p className="m-0 text-center">Disponible desde las:</p>
                    <input
                        className="form-select model-tag m-auto mt-2"
                        style={{
                            borderColor: "var(--tag-color)",
                            width: "100%"
                        }}
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                    />
                </div>
                <div className="col-md-4 px-1">
                    <p className="m-0 text-center">Hasta las:</p>
                    <input
                        className="form-select model-tag m-auto mt-2"
                        style={{
                            borderColor: "var(--tag-color)",
                            width: "100%"
                        }}
                        type="time"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                    />
                </div>
                <div className="col-md-4 px-1"><p className="m-0 text-center">Los dias:</p>
                    <div className="m-auto mt-2" style={{ width: "100%" }}>
                        <button className="form-select model-tag w-100 text-start" style={{ borderColor: "var(--tag-color)", margin: "auto" }} onClick={() => { handleClickDropDown(14); }}>Dias</button>

                        {showedDropdown === 14 && (<>
                            <div
                                className="position-absolute mt-2 p-3 model-tag rounded shadow"
                                style={{zIndex: 1}}
                            >
                                {days.map((day, index) => (
                                    <div key={index} className="form-check">
                                        <input
                                            className="form-check-input model-tag"
                                            style={{ borderColor: "var(--tag-color)" }}
                                            type="checkbox"
                                            checked={diasSeleccionados.includes(day)}
                                            onChange={() => toggleDia(day)}
                                        />
                                        <label className="form-check-label">{day}</label>
                                    </div>
                                ))}
                            </div>
                        </>)}
                    </div>
                </div>
            </div>

            <div className="d-flex m-auto" style={{ width: "70%" }}>
                <p style={{ margin: "12px 10px 0px 10px" }}>Whatsapp</p>
                <div className="general-input w-100">
                    <p className="d-inline-flex my-0 mx-2">+</p>
                    <input className="m-0 bg-transparent border-0" type="number" style={{ width: "40px", color: "var(--tag-color)" }}
                        value={whatsappExtention} onChange={(e) => { setWhatsappExtention(e.target.value); }}
                    />|
                    <input className="m-0 bg-transparent border-0" type="number" style={{ color: "var(--tag-color)" }}
                        value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value); }}
                    />
                </div>
            </div>

            <div className="d-flex m-auto" style={{ width: "70%" }}>
                <p style={{ margin: "12px 10px 0px 10px" }}>Telegram</p>
                <div className="general-input w-100">
                    <p className="d-inline-flex my-0 mx-2">@</p>
                    <input className="m-0 bg-transparent border-0" placeholder="Tu nombre de usuario" type="text" style={{ color: "var(--tag-color)", width: "70%" }}
                        value={telegram} onChange={(e) => { setTelegram(e.target.value); }}
                    />
                </div>
            </div>

            <div className="d-flex m-auto" style={{ width: "70%" }}>
                <p style={{ margin: "12px 10px 0px 10px" }}>Metodos de pago</p>
                <PaymentMethodsSelector paymentMethods={paymentMethods} onChange={setPaymentMethods} />
            </div>


        </>)}

        {currentStep === 5 && (<>
            <DashboardInputField text={"Nombre Completo"} placeholder={"Tu nombre completo real"} type={"text"}
                value={fullName} onChange={(e) => { setFullName(e.target.value) }} maxLength={50} />
            <DashboardInputField text={"Fecha de nacimiento"} placeholder={""} type={"date"} value={birthDate} onChange={(e) => { setBirthDate(e.target.value); }} />
            <DashboardInputField text={"Documento de identidad"} placeholder={"El hash de tu documento de identidad"}
                type={"text"} value={idDocument} onChange={(e) => { setIdDocument(e.target.value) }} maxLength={15} />
        </>)}

        <div className="d-flex m-auto justify-content-between mt-5" style={{ width: "70%" }}>
            <button className="btn general-btn w-25" onClick={prevStep}>Atras</button>
            <button className="btn general-btn w-25" onClick={nextStep}>
                {currentStep < 5 ? (<>Siguiente</>) : (<>Enviar</>)}
            </button>
        </div>
        {errorMessage && (<p className="text-danger d-flex m-auto" style={{ width: "70%" }}>{errorMessage}</p>)}

    </>);
}
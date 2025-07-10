import DashboardSectionSelector from "./DashboardSectionSelector";
import "./modelDashboard.css"
import { useState } from "react";
import { useEffect } from "react";
import { deleteCookie, getCookie } from "../../utils/cookies";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function DashboardSidebar({data, setFieldSelected}){
    const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL;
    const [suscriptionIsActive, setSuscriptionIsActive] = useState(false);
    const [suscriptionEndDate, setSuscriptionEndDate] = useState('');

    useEffect(() => {

        const getStatusProfile = async ()=>{
                try {
                    const response = await fetch(`${API_BASE_URL}profile/suscription?token=${getCookie("token")}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (!response.ok) {
                        throw new Error('Error al crear persona');
                    }
                    const json = await response.json();
                    console.log(json);
                    setSuscriptionIsActive(json.active);
                    setSuscriptionEndDate(json.end_date);
                }
                catch (error) {
                    console.log(error);
                }
            }
            getStatusProfile();
    }, [])

    return(
        <div className="sidebar d-flex flex-column col-md-4">
        <div className="img-container">
        <img
            src="https://dummyimage.com/300/eee/aaa"
            alt="Imagen de la persona"
            className="rounded-circle"
            style={{
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
            }}  
        />
        </div>
        <p className="text-center m-3 fs-4">{(data?.tags?.find((a)=>a.tipo === "nombre")?.valor) ? (<>{data?.tags?.find((a)=>a.tipo === "nombre")?.valor}</>) : (<>Nombre</>)}</p>
        <p className="text-center mb-1">Estado de cuenta</p>
        <p className="text-center">{suscriptionIsActive?"Online":"Offline"}</p>
        <p className="text-center mb-1">Fin de la suscripcion</p>
        <p className="text-center">{suscriptionEndDate}</p>
            <DashboardSectionSelector fieldId={1} onClick={setFieldSelected}>Datos Personales</DashboardSectionSelector>
            <DashboardSectionSelector fieldId={2} onClick={setFieldSelected}>Cambiar Ubicacion</DashboardSectionSelector>
        <DashboardSectionSelector fieldId={3} onClick={setFieldSelected}>Solicitar subida de multimedia</DashboardSectionSelector>
        {/* <DashboardSectionSelector fieldId={3} onClick={setFieldSelected}>Graficas</DashboardSectionSelector> */}
        <DashboardSectionSelector fieldId={4} onClick={setFieldSelected}>Soporte a cliente</DashboardSectionSelector>
        {/*<DashboardSectionSelector fieldId={5} onClick={setFieldSelected}>Preguntas frecuentes</DashboardSectionSelector>*/}
    </div>);
}
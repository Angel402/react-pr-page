import DashboardSectionSelector from "./DashboardSectionSelector";
import "./modelDashboard.css"

export default function DashboardSidebar({data, setFieldSelected}){
    const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL;

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
        <p className="text-center">Offline</p>
        <DashboardSectionSelector fieldId={1} onClick={setFieldSelected}>Datos Personales</DashboardSectionSelector>
        <DashboardSectionSelector fieldId={2} onClick={setFieldSelected}>Solicitar subida de multimedia</DashboardSectionSelector>
        {/* <DashboardSectionSelector fieldId={3} onClick={setFieldSelected}>Graficas</DashboardSectionSelector> */}
        <DashboardSectionSelector fieldId={4} onClick={setFieldSelected}>Soporte a cliente</DashboardSectionSelector>
        <DashboardSectionSelector fieldId={5} onClick={setFieldSelected}>Preguntas frecuentes</DashboardSectionSelector>
    </div>);
}
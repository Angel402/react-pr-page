import DashboardSidebar from "../components/modelDashboard/DashboardSidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState } from "react";
import { useEffect } from "react";
import { deleteCookie, getCookie } from "../utils/cookies";
import DashboardPersonalData from "../components/modelDashboard/DashboardPersonalData";
import RequestUploadMedia from "../components/modelDashboard/RequestUploadMedia";
import Graphics from "../components/modelDashboard/Graphics";
import ClientSupport from "../components/modelDashboard/ClientSupport";
import {useNavigate, useParams} from "react-router-dom";
import {useUser} from "../context/UserContext";
import UpdateCoords from "../components/modelDashboard/UpdateCoords";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ModelDashboard (){
    
    const [fieldSelected, setFieldSelected] = useState(0);
    const [isLogged, setIsLogged] = useState(false);
    const [modelData, setModelData] = useState({});
    const {modelId} = useParams();
    const {userRole} = useUser();
    const navigate = useNavigate();
    useEffect(() => { 
        
            const isLoggedFetch = async ()=>{
                const token = getCookie("token");
                if (token){
                    setIsLogged(true);
                    try {                        
                        const response = await fetch(`${API_BASE_URL}me?token=${token}`);

                        if (!response.ok){
                            if (response.status === 401){
                                console.log("token no valido");
                                deleteCookie("token");
                                window.location.reload();  
                            }
                            throw new Error(`Error: ${response.status}`);
                        }
                        const json = await response.json();
                        
                        setModelData(json.Persona);
                        setFieldSelected(1);

                    } catch (error) {
                        console.log(error);                        
                    }
                }
            }

            const getModelProfile = async ()=>{
                try {
                    const response = await fetch(`${API_BASE_URL}people/${modelId}`);

                    if (!response.ok){
                        if (response.status === 401){
                            console.log("token no valido");
                            deleteCookie("token");
                            window.location.reload();
                        }
                        throw new Error(`Error: ${response.status}`);
                    }
                    const json = await response.json();

                    setModelData(json);
                    setIsLogged(true);
                    setFieldSelected(1);
                }
                catch (error) {
                    console.log(error);
                }
            }

            if (!modelId) isLoggedFetch();
            else if (userRole === "Admin") {
                getModelProfile();
            }

        }, [userRole]);

    useEffect(() => {
        if (modelId && userRole != null && userRole !== "Admin") navigate("/modeldashboard");
    }, [userRole])

    return(<>
        <Header />
        <div className="container-fluid row">
            <DashboardSidebar data={modelData} setFieldSelected={setFieldSelected}/>
            <div className="col-md-8 mt-4">
                {!isLogged ? (<>Primero debes iniciar sesion</>)
                    : (<>
                        {(fieldSelected === 1) && (<DashboardPersonalData hasDafault={modelData === undefined} data={modelData} id={modelData?.user_id}/>)}
                        {fieldSelected === 2 && (<UpdateCoords data={modelData} />)}
                        {fieldSelected === 3 && (<RequestUploadMedia modelName={modelData?.nombre}/>)}
                        {fieldSelected === 4 && (<ClientSupport />)}
                </>)}
            
            </div>
        </div>

        <Footer />
    </>);
}
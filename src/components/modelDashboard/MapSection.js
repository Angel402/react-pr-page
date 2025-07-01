import DashboardDropDown from "./DashboardDropDown";
import InteractiveMap from "../InteractiveMap";
import {useEffect} from "react";

export default function MapSection({cities, countries, selectedCountry, setSelectedCountry, selectedCity, handleCityChange, handleClickDropDown, coords, setCoords}) {
    useEffect(()=>{
        console.log(coords);
    }, [coords]);
    return (<>
        <DashboardDropDown
            onClick={()=>{handleClickDropDown(17);}}
            value={selectedCountry}
            onChange={(e)=>{
                setSelectedCountry(e.target.value);
            }}
            placeHolder={"Selecciona tu pais de residencia"}
            itemsToMap={countries.map(country=>country.name)}
        />
        {cities <= 0 && (<>
            <select
                className="form-select model-tag m-auto mt-2"
                style={{ borderColor: "var(--tag-color)", width: "70%" }}
                onClick={() => { handleClickDropDown(15); }}
            >
                <option value="">Selecciona antes un pais para poder elegir una ciudad</option>
            </select>
        </>)}
        {cities.length > 0 && (<>
            <DashboardDropDown
                onClick={() => { handleClickDropDown(16); }}
                value={selectedCity}
                onChange={handleCityChange}
                placeHolder={"Selecciona tu ciudad o la mas cercana si no se encuentra"}
                itemsToMap={cities}
            />
        </>)}
        <div className={"m-4"}>
            <InteractiveMap coords={coords} setCoords={setCoords} />
        </div>
    </>);
}
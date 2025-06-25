import DashboardDropDown from "./DashboardDropDown";

export default function MapSection({cities, countries, selectedCountry, setSelectedCountry, handleClickDropDown}) {
    return (<>
        <DashboardDropDown
            onClick={()=>{handleClickDropDown(17);}}
            value={selectedCountry}
            onChange={(e)=>{
                setSelectedCountry(e.target.value);
            }}
            placeHolder={"Selecciona tu nacionalidad"}
            itemsToMap={countries.map(country=>country.name)}
        />
        {cities <= 0 && (<>
            <select
                className="form-select model-tag m-auto mt-2"
                style={{borderColor: "var(--tag-color)", width:"70%"}}
                onClick={()=>{handleClickDropDown(15);}}
            >
                <option value="">Selecciona antes un pais para poder elegir una ciudad</option>
            </select>
        </>)}
    </>);
}
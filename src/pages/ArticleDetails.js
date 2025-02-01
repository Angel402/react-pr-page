import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import Header from "../components/Header";
import Galery from "../components/Galery";
import Services from "../components/Services";
import Map from "../components/Map";
import Comments from "../components/Comments";
import Experiences from "../components/Experiences";
import Footer from "../components/Footer";

const ArticleDetails = () => {
  const { id } = useParams();
  

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://lobasvip.com.ve/index.php/api/people/"+id)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);


  const globalLocation = { lat: 19.432608, lng: -99.133209 };

  const [mostrarCompleto, setMostrarCompleto] = useState(false);

  const toggleDescripcion = () => {
    setMostrarCompleto(!mostrarCompleto);
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${data?.whatsapp}`, '_blank');
  };

  const handleTelegramClick = () => {
    window.open(`https://t.me/${data?.telegram}`, '_blank');
  };

  const services = [];
  const subServices = [];

  if(data){
    for (let prop of data.tags){
      
      if (prop.tipo == "Servicios")
        services.push(prop.valor)
      else if(prop.tipo == "Servicios Virtuales"){
        let obj = subServices.find(item => item.name === "Servicios Virtuales");
        

        if (obj) {
            obj.list.push(prop.valor);
        } else {
            subServices.push({ name: "Servicios Virtuales", list: [prop.valor] });
        }
      }
      else if(prop.tipo == "Tipo de Fantasias"){
        
        let obj = subServices.find(item => item.name === "Tipo de Fantasias");

        if (obj) {
            obj.list.push(prop.valor);
        } else {
            subServices.push({ name: "Tipo de Fantasias", list: [prop.valor] });
        }
      }
      else if(prop.tipo == "Métodos de Pago"){
        let obj = subServices.find(item => item.name === "Métodos de Pago");

        if (obj) {
            obj.list.push(prop.valor);
        } else {
            subServices.push({ name: "Métodos de Pago", list: [prop.valor] });
        }
      }
      
    }
    
  }

  return (
    <div>
        <Header></Header>
        <article className="container-fluid">
        <div className="container mt-5">
      <div className="row">
        <div className="col-md-3 text-center">
          <div 
            style={{maxWidth: 250,
              maxHeight: 250,
              margin: "auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={"https://lobasvip.com.ve/" + data?.media[0].file_path}
              alt="Imagen de la persona"
              className="rounded-circle"
              style={{
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
            }}
            />
          </div>
          
        </div>
        <div className="col-md-6">
          <h4>{data?.nombre}</h4>
          <div className="">
            {/* {ejemploPersona.categorias.map((categoria, index) => (
              <span
                key={index}
                className="badge text-light me-1"
                style={{
                  backgroundColor: "#038093",
                  padding: "5px 5px",
                  borderRadius: "5px",
                }}
              >
                {categoria}
              </span>
            ))} */}
          </div>
          <div >
            {data?.tags.map((tag, index) => (
              <span
                key={index}
                className="badge me-1"
                style={{
                  color: "#656565",
                  fontSize: "13px",
                  backgroundColor: "#eff0f5",
                  padding: "5px 5px",
                  borderRadius: "5px",
                  display: "inline-block",
                  margin: "1px"
                }}
              >
                {tag.tipo}{" "}
                {tag.valor && (
                  <strong>{tag.valor}</strong>
                )}
              </span>
            ))}
          </div>

          <div className="row mt-3">
            <div className="col-md-8">
              <h5>Descripción</h5>
              <p>
                {mostrarCompleto
                  ? data?.about
                  : data?.about.slice(0, 150) + (data?.about.length > 150 ? "..." : "")}
                  {data?.about.length > 150 && (
                <button
                  className="btn btn-link p-0 ps-1 pb-1 m-0 border-0 text-decoration-none"
                  style={{
                    color: "#038093"
                  }}
                  onClick={toggleDescripcion}
                >
                  {mostrarCompleto ? "Mostrar menos" : "Mostrar más"}
                </button>
              )}
              </p>
              
            </div>
            <div className="col-md-4">
              <h5>Horario Disponible</h5>
              <p>{data?.horario}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 text-end">
          <div className="container p-0">
            {data?.whatsapp !== undefined && data?.whatsapp !== null && data?.whatsapp !== "" && (
            <button 
            className="ms-2 rounded-3 border-0 px-3 py-1 mb-2" 
            onClick={handleWhatsAppClick}
            style={{backgroundColor: "#c90035"}}>
              <i className="bi bi-whatsapp fs-5"></i>
            </button>
            )}
            {data?.telegram !== undefined && data?.telegram !== null && data?.telegram !== "" && (
            <button 
            className="ms-2 rounded-3 border-0 px-3 py-1 mb-2" 
            onClick={handleTelegramClick}
            style={{backgroundColor: "#c90035"}}>
              <i className="bi bi-telegram fs-5"></i>
            </button>
            )}
          </div>
          <h5>Tarifa por hora</h5>
          <h3>${data?.tarifa}</h3>
        </div>
      </div>
    </div>

    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container custom-container justify-content-center">
          <ul className="navbar-nav bg-light p-1 rounded-4">
            <li className="nav-item d-flex justify-content-center">
              <a className="nav-link" href="#galeria">Galería</a>
            </li>
            <li className="nav-item d-flex justify-content-center">
              <a className="nav-link" href="#servicios">Servicios</a>
            </li>
            <li className="nav-item d-flex justify-content-center">
              <a className="nav-link" href="#mapa">Mapa</a>
            </li>
            <li className="nav-item d-flex justify-content-center">
              <a className="nav-link" href="#comentarios">Comentarios</a>
            </li>
            <li className="nav-item d-flex justify-content-center">
              <a className="nav-link" href="#experiencia">Experiencia</a>
            </li>
          </ul>
        </div>
      </nav>


        <Galery items={data?.media}/>
        <Services services={services}
            subServices={subServices} />
        <Map location={globalLocation}/>
        <Comments />
        <Experiences />
        </div>
        </article>
    
        <Footer></Footer>
    </div>
    );
};

export default ArticleDetails;

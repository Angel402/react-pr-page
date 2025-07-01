import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Galery from "../components/Galery";
import Services from "../components/Services";
import Footer from "../components/Footer";
import { Link } from "react-scroll";
import InteractiveMap from "../components/InteractiveMap";
import BaseModal from "../components/BaseModal";
import { useUser } from "../context/UserContext";
import { getCookie } from "../utils/cookies";
import SubscriptionModal from "../components/SubscriptionModal";
import ShowMap from "../components/ShowMap";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL;

const ModelDetails = () => {
  const { id } = useParams();

  const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  const abreviaturas = diasSemana.map(d => d.slice(0, 3));

  const [data, setData] = useState(null);
  const [coords, setCoords] = useState();
  const [mapLabel, setMapLabel] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const { userRole } = useUser();
  const baseMessage = "Hola " + data?.nombre + "! Vi tu aviso https://lobasvip.com.ve ¿Como estas? Te quería consultar informacion sobre...";

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}people/${id}`)
      .then((response) => response.json())
      .then((data) => {
        onDataReceived(data)
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  const onDataReceived = (data) => {
    data.about = data.tags.find((a) => a.tipo === "about_me")?.valor;
    data.nombre = data.tags.find((a) => a.tipo === "nombre")?.valor;
    const whatsapp = data.tags.find((a) => a.tipo === "tel_whatssapp")?.valor.replace("|", "");
    const telegram = data.tags.find((a) => a.tipo === "tel_telegram")?.valor;
    data.whatsapp = whatsapp ? whatsapp : "";
    data.telegram = telegram ? telegram : "";
    const dataCoords = data.tags.find(tag => tag.tipo === "mapa");
    if (dataCoords) {
      setCoords(dataCoords.valor);
      setMapLabel(`${data.tags.find(tag => tag.tipo === "ciudad").valor}, ${data.tags.find(tag => tag.tipo === "nacionalidad").valor}`)
    }
    const horario = data.tags.find(tag => tag.tipo === "horario");
    if (horario) {
      const { horaInicio: hi, horaFin: hf, diasSeleccionados: ds } = parseAvailabilityString(horario.valor);
      data.horario = toReadableString(hi, hf, ds);
    }
    else data.horario = "Horario no disponible";
    setData(data);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}increment/${id}`);

        if (!response.ok) {
          throw new Error("Error al buscar persona");
        }

        const result = await response.json();

      } catch (error) {
        console.log(error.message);
      }

    }
    fetchData();
  }, []);

  const [mostrarCompleto, setMostrarCompleto] = useState(false);

  const toggleDescripcion = () => {
    setMostrarCompleto(!mostrarCompleto);
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${data?.whatsapp}?text=${`${baseMessage}`}`, '_blank');
  };

  const handleTelegramClick = () => {

    window.open(`https://t.me/${data?.telegram.replaceAll("@", "")}?text=${baseMessage}`, '_blank');
  };

  function diasLegibles(dias) {
    const indices = dias.map(d => diasSemana.indexOf(d)).filter(i => i !== -1).sort((a, b) => a - b);

    let resultado = [];
    let inicio = indices[0];
    let anterior = indices[0];

    for (let i = 1; i <= indices.length; i++) {
      if (indices[i] !== anterior + 1) {
        if (inicio === anterior) resultado.push(abreviaturas[inicio]);
        else resultado.push(`${abreviaturas[inicio]} - ${abreviaturas[anterior]}`);
        inicio = indices[i];
      }
      anterior = indices[i];
    }

    return resultado.join(", ");
  }

  function formatearHora(hora) {
    const [h, m] = hora.split(":").map(Number);
    const sufijo = h >= 12 ? "pm" : "am";
    const hora12 = h % 12 || 12;
    return `${hora12}:${m.toString().padStart(2, "0")} ${sufijo}`;
  }

  function toReadableString(horaInicio, horaFin, diasSeleccionados) {
    const dias = diasLegibles(diasSeleccionados);
    return `${dias} ${formatearHora(horaInicio)} - ${formatearHora(horaFin)}`;
  }

  const services = [];
  const subServices = [{ name: "Fantasias", list: [] },
  { name: "Tipo de Oral", list: [] },
  { name: "Tipos de Masajes", list: [] },
  { name: "Servicios Virtuales", list: [] },
  { name: "Servicios Adicionales", list: [] },
  { name: "Metodos de Pago", list: [] },];
  const displayedTags = [];

  const addSubService = (propTipo, type, name, valor) => {
    if (propTipo.includes(type)) {
      let obj = subServices.find(item => item.name === name);
      if (obj) {
        obj.list.push(valor);
      } else {
        subServices.push({ name: name, list: [valor] });
      }
    }
  }

  function parseAvailabilityString(str) {
    const [horaInicio, horaFin, diasStr] = str.split("|");
    const diasSeleccionados = diasStr ? diasStr.split(",") : [];
    return { horaInicio, horaFin, diasSeleccionados };
  }

  if (data) {
    for (let prop of data.tags) {

      const propTipo = prop.tipo.toLowerCase();

      if (prop.tipo === "servicio") {
        services.push(prop.valor);
      } else if (prop.tipo === "tipo_fantasia") {
        subServices.find(item => item.name === "Fantasias").list.push(prop.valor)
      } else if (prop.tipo === "tipo_oral") {
        subServices.find(item => item.name === "Tipo de Oral").list.push(prop.valor)
      } else if (prop.tipo === "tipo_masajes") {
        subServices.find(item => item.name === "Tipos de Masajes").list.push(prop.valor)
      } else if (prop.tipo === "servicios_virtuales") {
        subServices.find(item => item.name === "Servicios Virtuales").list.push(prop.valor)
      } else if (prop.tipo === "adicionales") {
        subServices.find(item => item.name === "Servicios Adicionales").list.push(prop.valor)
      } else if (prop.tipo === "metodo_de_pago") {
        subServices.find(item => item.name === "Metodos de Pago").list.push(prop.valor)
      } else if (!propTipo.includes("nombre") && !propTipo.includes("categoria") && !propTipo.includes("about_me") &&
        !propTipo.includes("kyc") && !propTipo.includes("tel") && !propTipo.includes("views") && !prop.tipo.includes("horario")) {
        displayedTags.push(prop);
      }
    }
  }

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: getCookie("token") }),
      });

      if (!response.ok) {
        setError("Error al eliminar el perfil.");
        return;
      }

      // Redireccionar o actualizar estado global si el perfil fue eliminado
      window.location.href = "/"; // o donde tenga sentido redirigir
    } catch (err) {
      setError("Algo salió mal.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Header></Header>
      <article className="container-fluid">
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-3 text-center">
              <div
                style={{
                  maxWidth: 250,
                  maxHeight: 250,
                  margin: "auto",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={data?.media[0] ? MEDIA_BASE_URL + data?.media[0].file_path : "https://dummyimage.com/300/eee/aaa"}
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
              <div>
              </div>
              <div>
                {displayedTags?.map((tag, index) => (
                  <div className="model-tag d-inline-flex px-2 me-1 rounded-3" style={{ marginBottom: "2px" }} key={index}>
                    {tag.tipo}&nbsp;
                    {tag.valor && (
                      <strong>{tag.valor}</strong>
                    )}
                  </div>
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
                    className="ms-2 rounded-3 border-0 px-3 py-1 mb-2 text-light"
                    onClick={handleWhatsAppClick}
                    style={{ backgroundColor: "#c90035" }}>
                    <i className="bi bi-whatsapp fs-5"></i>
                  </button>
                )}
                {data?.telegram !== undefined && data?.telegram !== null && data?.telegram !== "" && (
                  <button
                    className="ms-2 rounded-3 border-0 px-3 py-1 mb-2 text-light"
                    onClick={handleTelegramClick}
                    style={{ backgroundColor: "#c90035" }}>
                    <i className="bi bi-telegram fs-5"></i>
                  </button>
                )}
              </div>
              {/* <h5>Tarifa por hora</h5>
                <h3>${data?.tarifa}</h3> */}
            </div>
          </div>
        </div>

        {userRole === "Admin" && (<>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn general-btn" onClick={() => setSubscriptionModalOpen(true)}>Agregar Suscripcion</button>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn general-btn" onClick={() => navigate(`/modeldashboard/${data.id}`)}>Modificar Perfil</button>
          </div>
        </>)}

        {subscriptionModalOpen && (<>
          <SubscriptionModal closeModal={() => setSubscriptionModalOpen(false)} userId={data.user_id} />
        </>)}

        <div className="container mt-5">
          <nav className="navbar navbar-expand-lg ">
            <div className="container custom-container justify-content-center">
              <ul className="navbar-nav model-tag p-1 rounded-4">
                <li className="nav-item d-flex justify-content-center">
                  <Link className="model-tag nav-link" to="galeria">Galería</Link>
                </li>
                <li className="nav-item d-flex justify-content-center">
                  <Link className="model-tag nav-link" to="servicios">Servicios</Link>
                </li>
              </ul>
            </div>
          </nav>

          {coords && (
            <ShowMap coords={coords} label={mapLabel} />
          )}
          <Galery items={data?.media} userId={data?.id} />
          <Services services={services}
            subServices={subServices} />
          {userRole === "Admin" && (
            <>

              {/*<div className="d-flex justify-content-center my-4">
                    <button className="btn general-btn" onClick={}>
                      Editar perfil
                    </button>
                  </div>*/}
              <div className="d-flex justify-content-center my-4">
                <button
                  className="btn"
                  style={{
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    color: "#b00000",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #b00000",
                    padding: "10px 16px",
                    borderRadius: "5px",
                  }}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  Eliminar perfil
                </button>
              </div>
            </>
          )}

          {deleteModalOpen && (
            <BaseModal closeModal={() => setDeleteModalOpen(false)}>
              <h4 className="text-danger">¿Estás seguro de que deseas eliminar este perfil?</h4>
              <p className="pt-3">Esta acción no se puede deshacer.</p>

              {error && <p className="text-danger">{error}</p>}

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteProfile}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Confirmar eliminación"}
                </button>
              </div>
            </BaseModal>
          )}
        </div>
      </article>
      <Footer></Footer>
    </div>
  );
};

export default ModelDetails;

import React, { useState } from "react";

const Galeria = ({ items }) => {
  const [filter, setFilter] = useState("all");

  const filteredItems = items?.filter((item) =>
    filter === "all" ? true : item.type === filter
  );

  return (
    <div id="galeria" style={{ padding: "20px"}}>
      <h2 className="mb-3">Galería</h2>

      <div style={{ marginBottom: "10px", display: "flex", gap: "8px" }}>
        <button
            type="button" class="btn btn-outline-secondary"
            onClick={() => setFilter("all")}
        >
            Todos
        </button>
        <button
            type="button" class="btn btn-outline-secondary"
            onClick={() => setFilter("photo")}
        >
            Fotos
        </button>
        <button
            type="button" class="btn btn-outline-secondary"
            onClick={() => setFilter("video")}
        >
            Videos
        </button>
        </div>

      <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 250px)",
            gap: "1px",
            justifyContent: "start",
        }}
        >
        {filteredItems?.map((item, index) => (
            <div
            key={index}
            style={{
                width: "250px",
                height: "250px",
                overflow: "hidden",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
            }}
            >
            {item.type === "image" ? (
                <img
                src={"https://lobasvip.com.ve/"+item.file_path}
                alt={item.alt || "Foto"}
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    minWidth: "100%",
                    minHeight: "100%",
                    objectFit: "cover",
                }}
                />
            ) : (
                <video
                controls
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                }}
                >
                <source src={item.src} type="video/mp4" />
                Tu navegador no soporta videos.
                </video>
            )}
            </div>
        ))}
        </div>
    </div>
  );
};

export default Galeria;

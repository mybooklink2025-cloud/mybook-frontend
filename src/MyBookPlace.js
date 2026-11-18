import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const productos = [
  {
    id: 1,
    nombre: "Computador portátil",
    precio: "$2.500.000",
    categoria: "Tecnología",
    ubicacion: "Medellín",
    vendedor: "Carlos",
    imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
  },
  {
    id: 2,
    nombre: "Sofá moderno",
    precio: "$1.200.000",
    categoria: "Hogar",
    ubicacion: "Bogotá",
    vendedor: "María",
    imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  },
  {
    id: 3,
    nombre: "Reloj deportivo",
    precio: "$180.000",
    categoria: "Moda",
    ubicacion: "Cali",
    vendedor: "Andrés",
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  },
  {
    id: 4,
    nombre: "Bicicleta de montaña",
    precio: "$950.000",
    categoria: "Deportes",
    ubicacion: "Medellín",
    vendedor: "Laura",
    imagen: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800",
  },
  {
    id: 5,
    nombre: "Colección de libros",
    precio: "$120.000",
    categoria: "Libros",
    ubicacion: "Barranquilla",
    vendedor: "Daniel",
    imagen: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
  },
  {
    id: 6,
    nombre: "Motocicleta",
    precio: "$8.500.000",
    categoria: "Vehículos",
    ubicacion: "Bogotá",
    vendedor: "Julián",
    imagen: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
  },
];

const categorias = [
  "Todos",
  "Tecnología",
  "Hogar",
  "Moda",
  "Deportes",
  "Libros",
  "Vehículos",
  "Otros",
];

function MyBookPlace() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [nombreUsuario, setNombreUsuario] = useState("Usuario Actual");
  const [fotoUsuario, setFotoUsuario] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [bookPos, setBookPos] = useState({ left: 0, top: 0 });

  const menuRef = useRef(null);
  const topBarRef = useRef(null);
  const logoRef = useRef(null);
  const bookRef = useRef(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.email || payload.emailAddress || "";

      if (email) {
        setNombreUsuario(email);
        localStorage.setItem("email", email);

        const savedPicture = localStorage.getItem(`profilePicture_${email}`);

        if (savedPicture) {
          setFotoUsuario(`${BASE_URL}/uploads/${savedPicture}`);
        }
      }
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
    }
  }, [BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "Todos" ||
      producto.categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  const logoClick = () => {
    navigate("/muro");
  };

  const activateLogo = () => {
    if (!topBarRef.current || !logoRef.current) {
      setExpanded(true);
      setShowBook(true);
      return;
    }

    const barRect = topBarRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();
    const left = logoRect.right - barRect.left + 12;
    const top = (barRect.height - 48) / 2;

    setExpanded(true);
    setShowBook(true);
    setBookPos({ left, top });
  };

  const escapeBook = () => {
    if (!topBarRef.current || !bookRef.current || !logoRef.current) return;

    const barRect = topBarRef.current.getBoundingClientRect();
    const bookRect = bookRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();

    const minLeft = Math.max(logoRect.right - barRect.left + 8, 8);
    const maxLeft = Math.max(barRect.width - bookRect.width - 12, minLeft + 12);
    const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
    const top = (barRect.height - bookRect.height) / 2;

    setBookPos({ left: randomLeft, top });
  };

  const handleBookMouseEnter = () => {
    escapeBook();
  };

  const estilos = {
    pagina: {
      minHeight: "100vh",
      paddingTop: "80px",
      boxSizing: "border-box",
      background: "radial-gradient(circle at 30% 20%, #0d1b3a 0%, #081326 50%, #01060f 100%)",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    },
    encabezado: {
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "13px",
      padding: "22px 25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "20px",
      flexWrap: "wrap",
      marginBottom: "25px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
    marca: {
      display: "flex",
      flexDirection: "column",
      minWidth: "190px",
    },
    tituloMarca: {
      fontSize: "25px",
      fontWeight: "bold",
      color: "#ffffff",
      margin: 0,
    },
    subtitulo: {
      fontSize: "12px",
      color: "#b8cce8",
      marginTop: "5px",
    },
    buscador: {
      flex: 1,
      maxWidth: "650px",
      minWidth: "220px",
      padding: "13px 18px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.25)",
      outline: "none",
      fontSize: "15px",
      boxSizing: "border-box",
      backgroundColor: "rgba(255,255,255,0.96)",
      color: "#263445",
    },
    contenido: {
      display: "flex",
      gap: "25px",
      padding: "0 35px 35px 105px",
      alignItems: "flex-start",
      boxSizing: "border-box",
    },
    barraCategorias: {
      width: "230px",
      minWidth: "200px",
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "12px",
      padding: "22px 17px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
      boxSizing: "border-box",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
    tituloCategorias: {
      fontSize: "17px",
      fontWeight: "bold",
      marginTop: 0,
      marginBottom: "17px",
      color: "#ffffff",
    },
    categoria: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "11px 12px",
      marginBottom: "5px",
      border: "none",
      borderRadius: "7px",
      backgroundColor: "transparent",
      color: "#d5e2f3",
      fontSize: "14px",
      cursor: "pointer",
    },
    categoriaActiva: {
      backgroundColor: "rgba(74,144,226,0.30)",
      color: "#ffffff",
      fontWeight: "bold",
      boxShadow: "inset 3px 0 0 #65a9ff",
    },
    notaLateral: {
      marginTop: "25px",
      padding: "14px",
      backgroundColor: "rgba(5,20,42,0.55)",
      borderRadius: "8px",
      fontSize: "12px",
      lineHeight: "1.5",
      color: "#b8cce8",
    },
    principal: {
      flex: 1,
      minWidth: 0,
    },
    bienvenida: {
      background: "linear-gradient(120deg, rgba(13,55,105,0.95), rgba(30,105,174,0.90))",
      border: "1px solid rgba(139,190,245,0.28)",
      color: "#ffffff",
      borderRadius: "13px",
      padding: "27px 30px",
      marginBottom: "25px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    },
    tituloBienvenida: {
      fontSize: "25px",
      margin: "0 0 9px",
    },
    textoBienvenida: {
      fontSize: "14px",
      color: "#e0edfa",
      margin: 0,
      lineHeight: "1.5",
    },
    encabezadoProductos: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "18px",
    },
    tituloProductos: {
      fontSize: "21px",
      color: "#ffffff",
      margin: 0,
    },
    cantidadProductos: {
      fontSize: "13px",
      color: "#b8cce8",
    },
    rejilla: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "20px",
    },
    tarjeta: {
      backgroundColor: "rgba(255,255,255,0.96)",
      color: "#263445",
      borderRadius: "11px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.22)",
      border: "1px solid rgba(255,255,255,0.25)",
    },
    imagen: {
      width: "100%",
      height: "175px",
      objectFit: "cover",
      display: "block",
      backgroundColor: "#e5eaf1",
    },
    informacion: {
      padding: "15px",
    },
    nombreProducto: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#243b55",
      margin: "0 0 9px",
    },
    precio: {
      fontSize: "19px",
      fontWeight: "bold",
      color: "#1762a8",
      margin: "0 0 12px",
    },
    detalle: {
      fontSize: "12px",
      color: "#718096",
      margin: "6px 0",
    },
    botonDetalle: {
      width: "100%",
      marginTop: "12px",
      padding: "10px",
      backgroundColor: "#0d47a1",
      color: "#ffffff",
      border: "none",
      borderRadius: "7px",
      fontSize: "13px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    vacio: {
      backgroundColor: "rgba(255,255,255,0.96)",
      borderRadius: "10px",
      padding: "35px 20px",
      textAlign: "center",
      color: "#718096",
      boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
    },
    botonLimpiar: {
      marginTop: "12px",
      padding: "9px 15px",
      backgroundColor: "#0d47a1",
      color: "#ffffff",
      border: "none",
      borderRadius: "7px",
      cursor: "pointer",
    },
  };

  return (
    <div style={estilos.pagina}>
      {/* 🔵 BARRA SUPERIOR FIJA — misma identidad visual de MyBook */}
      <div
        ref={topBarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#e3f2fd",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          zIndex: 1000,
          overflow: "visible",
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <div
            ref={logoRef}
            onClick={logoClick}
            onMouseEnter={activateLogo}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
              width: expanded ? 140 : 40,
              height: 40,
              transition: "width 280ms ease, border-radius 280ms ease",
              borderRadius: expanded ? 20 : "50%",
              backgroundColor: "#0d47a1",
              color: "white",
              cursor: "pointer",
              overflow: "hidden",
              paddingLeft: 0,
              boxSizing: "border-box",
              zIndex: 2,
            }}
          >
            {!expanded && (
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 22,
                  userSelect: "none",
                  flex: "0 0 40px",
                }}
              >
                M
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                paddingLeft: 4,
                paddingRight: 8,
                whiteSpace: "nowrap",
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
                opacity: expanded ? 1 : 0,
                transition: "opacity 220ms ease",
                pointerEvents: "none",
              }}
            >
              MyBook
            </div>
          </div>

          {showBook && (
            <div
              ref={bookRef}
              onMouseEnter={handleBookMouseEnter}
              style={{
                position: "absolute",
                left: bookPos.left,
                top: bookPos.top,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 420ms cubic-bezier(.2,.9,.2,1), top 420ms cubic-bezier(.2,.9,.2,1)",
                zIndex: 1500,
                filter: "drop-shadow(0 6px 18px rgba(63,140,255,0.25))",
                transform: "translateZ(0)",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                alt="Libro animado"
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: "auto",
                  cursor: "pointer",
                  animation: "floatBook 1.6s ease-in-out infinite",
                }}
              />
            </div>
          )}
        </div>

        <div></div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginRight: "40px",
          }}
        >
          <div style={{ fontSize: "26px", cursor: "pointer", color: "#0d47a1" }}>
            🔍
          </div>

          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#0d47a1",
              fontWeight: "bold",
            }}
          >
            👥 Mis Contactos
          </button>

          <button
            type="button"
            onClick={() => navigate("/mybookplace")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#0d47a1",
              fontWeight: "bold",
            }}
          >
            🛍️ MyBookPlace
          </button>

          <div style={{ position: "relative" }} ref={menuRef}>
            <span
              onClick={() => setMenuVisible(!menuVisible)}
              style={{ fontSize: "22px", cursor: "pointer", color: "#0d47a1" }}
            >
              ⚙️
            </span>

            {menuVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "35px",
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  width: "220px",
                  zIndex: 2000,
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "8px",
                  }}
                >
                  <img
                    src={fotoUsuario}
                    alt="Usuario"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <p style={{ fontSize: "14px", color: "#555", marginBottom: "4px" }}>
                    {nombreUsuario}
                  </p>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/profile")}>Perfil</li>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/contactanos")}>Contáctanos</li>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/chat")}>Chat</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Configuración</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Ayuda</li>
                  <li
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/");
                    }}
                    style={{
                      padding: "8px",
                      color: "red",
                      cursor: "pointer",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    Salir
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`@keyframes floatBook {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
        }`}
      </style>

      {/* 🔹 BARRA LATERAL — mismos accesos visuales del Muro */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          width: "65px",
          height: "100vh",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
          zIndex: 900,
        }}
      >
        {[
          { title: "Google", url: "https://www.google.com", icon: "https://www.google.com/favicon.ico" },
          { title: "YouTube", url: "https://www.youtube.com", icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
          { title: "Spotify", url: "https://open.spotify.com", icon: "https://cdn-icons-png.flaticon.com/512/174/174872.png" },
          { title: "Noticias", url: "https://news.google.com", icon: "https://cdn-icons-png.flaticon.com/512/2965/2965879.png" },
          { title: "Clima", url: "https://weather.com", icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png" },
          { title: "Juegos (Poki)", url: "https://poki.com/es", icon: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png" },
        ].map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            style={{
              width: "40px",
              height: "40px",
              marginBottom: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease, filter 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.3)";
              e.currentTarget.style.filter = "drop-shadow(0 0 6px white)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "none";
            }}
          >
            <img
              src={item.icon}
              alt={item.title}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          </a>
        ))}
      </div>

      {/* 🛍️ CONTENIDO PROPIO DE MYBOOKPLACE */}
      <div style={{ padding: "0 0 30px", boxSizing: "border-box" }}>
        <div style={{ ...estilos.contenido, display: "block", paddingLeft: "105px" }}>
          <header style={estilos.encabezado}>
            <div style={estilos.marca}>
              <h1 style={estilos.tituloMarca}>MyBookPlace</h1>
              <span style={estilos.subtitulo}>Un lugar para encontrar y ofrecer</span>
            </div>

            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={estilos.buscador}
            />
          </header>

          <div style={{ display: "flex", gap: "25px", alignItems: "flex-start" }}>
            <aside style={estilos.barraCategorias}>
              <h3 style={estilos.tituloCategorias}>Categorías</h3>

              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaSeleccionada(categoria)}
                  style={{
                    ...estilos.categoria,
                    ...(categoriaSeleccionada === categoria ? estilos.categoriaActiva : {}),
                  }}
                >
                  {categoria}
                </button>
              ))}

              <div style={estilos.notaLateral}>
                <strong style={{ display: "block", color: "#ffffff", marginBottom: "5px" }}>
                  MyBookPlace
                </strong>
                <p style={{ margin: 0 }}>
                  Explora productos, descubre oportunidades y encuentra lo que buscas.
                </p>
              </div>
            </aside>

            <main style={estilos.principal}>
              <section style={estilos.bienvenida}>
                <h2 style={estilos.tituloBienvenida}>Bienvenido a MyBookPlace</h2>
                <p style={estilos.textoBienvenida}>
                  Descubre productos, encuentra buenas oportunidades y conecta con vendedores.
                </p>
              </section>

              <div style={estilos.encabezadoProductos}>
                <h2 style={estilos.tituloProductos}>Productos destacados</h2>
                <span style={estilos.cantidadProductos}>
                  {productosFiltrados.length} productos
                </span>
              </div>

              {productosFiltrados.length > 0 ? (
                <div style={estilos.rejilla}>
                  {productosFiltrados.map((producto) => (
                    <article key={producto.id} style={estilos.tarjeta}>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={estilos.imagen}
                      />

                      <div style={estilos.informacion}>
                        <h3 style={estilos.nombreProducto}>{producto.nombre}</h3>
                        <p style={estilos.precio}>{producto.precio}</p>
                        <p style={estilos.detalle}>Categoría: {producto.categoria}</p>
                        <p style={estilos.detalle}>Ubicación: {producto.ubicacion}</p>
                        <p style={estilos.detalle}>Vendedor: {producto.vendedor}</p>
                        <button type="button" style={estilos.botonDetalle}>
                          Ver producto
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div style={estilos.vacio}>
                  <h3>No se encontraron productos</h3>
                  <p>Intenta con otra búsqueda o selecciona una categoría diferente.</p>
                  <button
                    type="button"
                    style={estilos.botonLimpiar}
                    onClick={() => {
                      setBusqueda("");
                      setCategoriaSeleccionada("Todos");
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBookPlace;
import React, { useState } from "react";

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
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "Todos" ||
      producto.categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  const estilos = {
    pagina: {
      minHeight: "100vh",
      backgroundColor: "#f3f6fb",
      fontFamily: "Arial, sans-serif",
      color: "#263445",
    },
    encabezado: {
      backgroundColor: "#102b50",
      color: "#ffffff",
      padding: "18px 35px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "25px",
      flexWrap: "wrap",
      boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
    },
    marca: {
      display: "flex",
      flexDirection: "column",
      minWidth: "190px",
    },
    logo: {
      fontSize: "27px",
      fontWeight: "bold",
      letterSpacing: "0.5px",
    },
    subtitulo: {
      fontSize: "12px",
      color: "#c7d8ee",
      marginTop: "3px",
    },
    buscador: {
      flex: 1,
      maxWidth: "650px",
      minWidth: "220px",
      padding: "13px 18px",
      borderRadius: "8px",
      border: "none",
      outline: "none",
      fontSize: "15px",
      boxSizing: "border-box",
    },
    contenido: {
      display: "flex",
      gap: "25px",
      padding: "28px 35px",
      alignItems: "flex-start",
    },
    barraLateral: {
      width: "230px",
      minWidth: "200px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "22px 17px",
      boxShadow: "0 2px 12px rgba(20,45,80,0.07)",
      boxSizing: "border-box",
    },
    tituloCategorias: {
      fontSize: "17px",
      fontWeight: "bold",
      marginTop: "0",
      marginBottom: "17px",
      color: "#17375e",
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
      color: "#43546a",
      fontSize: "14px",
      cursor: "pointer",
    },
    categoriaActiva: {
      backgroundColor: "#e6effb",
      color: "#1456a0",
      fontWeight: "bold",
    },
    notaLateral: {
      marginTop: "25px",
      padding: "14px",
      backgroundColor: "#f1f6fc",
      borderRadius: "8px",
      fontSize: "12px",
      lineHeight: "1.5",
      color: "#64748b",
    },
    notaLateralStrong: {
      display: "block",
      color: "#24466e",
      marginBottom: "5px",
    },
    notaLateralP: {
      margin: "0",
    },
    principal: {
      flex: 1,
      minWidth: "0",
    },
    bienvenida: {
      background: "linear-gradient(120deg, #173e6b, #2868a8)",
      color: "#ffffff",
      borderRadius: "13px",
      padding: "27px 30px",
      marginBottom: "25px",
      boxShadow: "0 4px 14px rgba(20,60,105,0.13)",
    },
    tituloBienvenida: {
      fontSize: "25px",
      margin: "0 0 9px",
    },
    textoBienvenida: {
      fontSize: "14px",
      color: "#e0edfa",
      margin: "0",
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
      color: "#17375e",
      margin: "0",
    },
    cantidadProductos: {
      fontSize: "13px",
      color: "#718096",
    },
    rejilla: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "20px",
    },
    tarjeta: {
      backgroundColor: "#ffffff",
      borderRadius: "11px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(20,45,80,0.08)",
      border: "1px solid #e8edf4",
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
      backgroundColor: "#1c5f9e",
      color: "#ffffff",
      border: "none",
      borderRadius: "7px",
      fontSize: "13px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    vacio: {
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "35px 20px",
      textAlign: "center",
      color: "#718096",
      boxShadow: "0 2px 12px rgba(20,45,80,0.06)",
    },
    botonLimpiar: {
      marginTop: "12px",
      padding: "9px 15px",
      backgroundColor: "#1c5f9e",
      color: "#ffffff",
      border: "none",
      borderRadius: "7px",
      cursor: "pointer",
    },
  };

  return (
    <div style={estilos.pagina}>
      <header style={estilos.encabezado}>
        <div style={estilos.marca}>
          <span style={estilos.logo}>MyBookPlace</span>
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

      <div style={estilos.contenido}>
        <aside style={estilos.barraLateral}>
          <h3 style={estilos.tituloCategorias}>Categorías</h3>

          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaSeleccionada(categoria)}
              style={{
                ...estilos.categoria,
                ...(categoriaSeleccionada === categoria
                  ? estilos.categoriaActiva
                  : {}),
              }}
            >
              {categoria}
            </button>
          ))}

          <div style={estilos.notaLateral}>
            <strong style={estilos.notaLateralStrong}>MyBookPlace</strong>
            <p style={estilos.notaLateralP}>
              Explora productos, descubre oportunidades y encuentra lo que buscas.
            </p>
          </div>
        </aside>

        <main style={estilos.principal}>
          <section style={estilos.bienvenida}>
            <h1 style={estilos.tituloBienvenida}>
              Bienvenido a MyBookPlace
            </h1>
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
                    <h3 style={estilos.nombreProducto}>
                      {producto.nombre}
                    </h3>

                    <p style={estilos.precio}>{producto.precio}</p>

                    <p style={estilos.detalle}>
                      Categoría: {producto.categoria}
                    </p>

                    <p style={estilos.detalle}>
                      Ubicación: {producto.ubicacion}
                    </p>

                    <p style={estilos.detalle}>
                      Vendedor: {producto.vendedor}
                    </p>

                    <button
                      type="button"
                      style={estilos.botonDetalle}
                    >
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
  );
}

export default MyBookPlace;
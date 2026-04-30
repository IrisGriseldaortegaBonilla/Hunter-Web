import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import "bootstrap-icons/font/bootstrap-icons.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    archivo: null,
  });

  const [productoEditar, setProductoEditar] = useState({
    id: "",
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    url_imagen: "",
    archivo: null,
  });

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    }
  };

  const manejoCambioArchivoActualizar = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setProductoEditar((prev) => ({ ...prev, archivo }));
    }
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre_producto ||
        !nuevoProducto.categoria_producto ||
        !nuevoProducto.precio_venta ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa todos los campos",
          tipo: "advertencia",
        });
        return;
      }

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;

      const { error: errorUpload } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      if (errorUpload) throw errorUpload;

      const { data } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);

      const { error } = await supabase.from("productos").insert([
        {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion_producto: nuevoProducto.descripcion_producto,
          categoria_producto: nuevoProducto.categoria_producto,
          precio_venta: parseFloat(nuevoProducto.precio_venta),
          url_imagen: data.publicUrl,
        },
      ]);

      if (error) throw error;

      setMostrarModal(false);
      await cargarProductos();

      setToast({
        mostrar: true,
        mensaje: "Producto agregado correctamente",
        tipo: "exito",
      });

    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error al agregar producto",
        tipo: "error",
      });
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const cargarCategorias = async () => {
    const { data } = await supabase
      .from("categorias")
      .select("*")
      .order("id_categoria", { ascending: true });

    setCategorias(data || []);
  };

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      setProductos(data || []);
      setProductosFiltrados(data || []);
    } catch (err) {
      console.error("Error real:", err.message || err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const texto = textoBusqueda.toLowerCase();
      setProductosFiltrados(
        productos.filter(
          (p) =>
            p.nombre_producto?.toLowerCase().includes(texto) ||
            p.descripcion_producto?.toLowerCase().includes(texto)
        )
      );
    }
  }, [textoBusqueda, productos]);

  const actualizarProducto = async () => {
    try {
      const { error } = await supabase
        .from("productos")
        .update({
          nombre_producto: productoEditar.nombre_producto,
          descripcion_producto: productoEditar.descripcion_producto,
          categoria_producto: productoEditar.categoria_producto,
          precio_venta: parseFloat(productoEditar.precio_venta),
          url_imagen: productoEditar.url_imagen,
        })
        .eq("id", productoEditar.id);

      if (error) throw error;

      await cargarProductos();

      setProductoEditar({
        id: "",
        nombre_producto: "",
        descripcion_producto: "",
        categoria_producto: "",
        precio_venta: "",
        url_imagen: "",
        archivo: null,
      });

      setToast({ mostrar: true, mensaje: "Producto actualizado", tipo: "exito" });
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", productoAEliminar.id);

      if (error) throw error;

      await cargarProductos();

      setToast({
        mostrar: true,
        mensaje: "Producto eliminado correctamente",
        tipo: "exito",
      });

    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar producto",
        tipo: "error",
      });
    }
  };

  return (
    <Container className="mt-3">

      <Row className="mb-3">
        <Col><h3>Productos</h3></Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg"></i> Nuevo
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {cargando ? (
            <div className="text-center">
              <Spinner />
            </div>
          ) : productosFiltrados.length === 0 ? (
            <Alert>No hay productos</Alert>
          ) : (
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th> {/* 👈 CAMBIO */}
                  <th>Precio</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.url_imagen}
                        width="60"
                        height="60"
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </td>

                    <td>{p.nombre_producto}</td>

                    <td>
                      {
                        categorias.find(c => c.id_categoria === p.categoria_producto)?.nombre_categoria
                        || "Sin categoría"
                      }
                    </td>

                    <td>${p.precio_venta}</td>

                    <td>
                      <div className="d-flex gap-2 justify-content-center">

                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => {
                            setProductoEditar(p);
                            setMostrarModalEdicion(true);
                          }}
                        >
                          <i className="bi-pencil-fill"></i>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setProductoAEliminar(p);
                            setMostrarModalEliminacion(true);
                          }}
                        >
                          <i className="bi-trash-fill"></i>
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Col>
      </Row>

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        manejoCambioArchivoActualizar={manejoCambioArchivoActualizar}
        actualizarProducto={actualizarProducto}
        categorias={categorias}
      />

      <ModalEliminacionCategoria
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCategoria={eliminarProducto}
        categoria={productoAEliminar}
      />

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
        producto={productoAEliminar}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Productos;
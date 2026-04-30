import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion
}) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productos) {
      setLoading(false);
    }
  }, [productos]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando productos...</h4>
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th className="d-none d-md-table-cell">Descripción</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre_producto}</td>

                <td className="d-none d-md-table-cell">
                  {producto.descripcion_producto}
                </td>

                {/* 👇 mostramos solo el ID de categoría */}
                <td>{producto.categoria_producto}</td>

                <td>${producto.precio_venta}</td>

                <td>
                  <Image
                    src={producto.url_imagen}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
                </td>

                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(producto)}
                  >
                    <i className="bi-pencil-fill"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(producto)}
                  >
                    <i className="bi-trash-fill"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaProductos;
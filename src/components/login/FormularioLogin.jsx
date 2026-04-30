import React from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";

const FormularioLogin = ({
  usuario,
  contrasena,
  error,
  setUsuario,
  setContrasena,
  iniciarSesion
}) => {

  return (
    <Card
      style={{
        minWidth: "320px",
        maxWidth: "420px",
        width: "100%",
        borderRadius: "25px",
        border: "none",
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
        padding: "10px"
      }}
      className="p-4"
    >
      <Card.Body>
        <h2
          className="text-center mb-4"
          style={{
            color: "#7b5ea7",
            fontWeight: "600",
            fontSize: "2.3rem",
            fontFamily: "'Playfair Display', serif"
          }}
        >
          Bienvenida 
        </h2>

        {error && (
          <Alert
            variant="danger"
            style={{
              borderRadius: "12px",
              fontSize: "0.95rem"
            }}
          >
            {error}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3" controlId="usuario">
            <Form.Label
              style={{
                color: "#5f4b8b",
                fontWeight: "500"
              }}
            >
              Usuario
            </Form.Label>

            <Form.Control
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              style={{
                borderRadius: "14px",
                padding: "12px",
                border: "1px solid #f0d9ff",
                boxShadow: "none"
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="contrasena">
            <Form.Label
              style={{
                color: "#5f4b8b",
                fontWeight: "500"
              }}
            >
              Contraseña
            </Form.Label>

            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={{
                borderRadius: "14px",
                padding: "12px",
                border: "1px solid #f0d9ff",
                boxShadow: "none"
              }}
            />
          </Form.Group>

          <Button
            className="w-100"
            onClick={iniciarSesion}
            style={{
              borderRadius: "14px",
              padding: "12px",
              border: "none",
              fontWeight: "600",
              fontSize: "1.05rem",
              background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
              fontFamily: "'Quicksand', sans-serif",
              letterSpacing: "0.5px"
            }}
          >
            Iniciar Sesión
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormularioLogin;
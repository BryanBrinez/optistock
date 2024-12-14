"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import CreateReturnForm from "./create/page"; // Si tienes un formulario para crear retornos

export default function ReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Estado para alternar entre lista y formulario

  // Función para obtener los retornos
  const fetchReturns = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/return");
      setReturns(response.data);
    } catch (error) {
      console.error("Error al obtener retornos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    fetchReturns();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Cargando retornos...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Ver Retornos" : "Crear Retorno"}
          </button>
        </div>

        {showForm ? (
          <CreateReturnForm />
        ) : returns?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {returns.map((ret) => (
              <div
                key={ret._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-4">Retorno</h2>

                <div className="mb-2">
                  <h3 className="font-bold">Producto:</h3>
                  <p>Nombre: {ret.producto?.nombre}</p>
                  <p>Precio: ${ret.producto?.precio}</p>
                </div>

                <div className="mb-2">
                  <h3 className="font-bold">Pedido:</h3>
                  <p>ID: {ret.pedido?._id}</p>
                  <p>Cliente: {ret.pedido?.cliente?.nombre}</p>
                  <p>Tienda: {ret.pedido?.tienda}</p>
                </div>

                <div className="mb-2">
                  <h3 className="font-bold">Razón:</h3>
                  <p>{ret.razon}</p>
                </div>

                <div className="mb-2">
                  <h3 className="font-bold">Tipo:</h3>
                  <p>{ret.tipo}</p>
                </div>

                <div>
                  <h3 className="font-bold">Monto de Reembolso:</h3>
                  <p>{ret.montoReembolso ? `$${ret.montoReembolso}` : "N/A"}</p>
                </div>

                <div>
                  <h3 className="font-bold">Fecha:</h3>
                  <p className="text-gray-600 mt-2">
                    {new Date(ret.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No hay retornos disponibles.
          </p>
        )}
      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function OrdersPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las órdenes
  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/store");
      setStores(response.data);
    } catch (error) {
      console.error("Error al obtener las tiendas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Cargando tiendas...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        {stores?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.idStore}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-4">{store.nombre}</h2>
                <div className="mb-2">
                  <h3 className="font-bold">Dirección:</h3>
                  <p>{store.direccion}</p>
                  <p>Ciudad: {store.ciudad}</p>
                  <p>Código Postal: {store.codigoPostal}</p>            
                </div>

                <div className="mb-2">
                  <h3 className="font-bold">Capacidad de Almacenamiento:</h3>
                  <p>{store.capacidadAlmacenamiento} unidades</p>
                </div>

                <div>
                <h3 className="font-bold">Horario de Operación:</h3>
                <p>{store.horarioOperacion}</p>
                <p className="text-gray-600 mt-2">
                  Registrado el:{" "}
                  {new Date(store.createdAt).toLocaleDateString("es-ES", {
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
            No hay tiendas disponibles.
          </p>
        )}
      </main>
    </div>
  );
}
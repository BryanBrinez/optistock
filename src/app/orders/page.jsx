"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las órdenes
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/order");
      setOrders(response.data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Cargando órdenes...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        {orders?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-4"></h2>
                <div className="mb-2">
                  <h3 className="font-bold">Productos:</h3>
                  {order.productos.map((producto) => (
                    <div key={producto.producto._id} className="ml-4 mb-2">
                      <p className="font-semibold">
                        {producto.producto.nombre}
                      </p>
                      <p>Cantidad: {producto.cantidad}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-2">
                  <h3 className="font-bold">Cliente:</h3>
                  <p>Nombre: {order.cliente.nombre}</p>
                  <p>Dirección: {order.cliente.direccionEnvio}</p>
                </div>

                <div>
                  <h3 className="font-bold">Estado:</h3>
                  <p>{order.estado}</p>
                  <p className="text-gray-600 mt-2">
                    {new Date(order.fecha_pedido).toLocaleDateString("es-ES", {
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
            No hay órdenes disponibles.
          </p>
        )}
      </main>
    </div>
  );
}

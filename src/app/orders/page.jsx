"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import CreateOrderForm from "./create/page";
import CreateReturnForm from "../return/page"; // Asegúrate de que el componente de devoluciones esté correctamente importado

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Estado para alternar entre lista y formulario
  const [showReturn, setShowReturn] = useState(false); // Estado para mostrar la sección de devoluciones

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
        <div className="mb-6 flex justify-between items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Ver Órdenes" : "Crear Orden"}
          </button>
          {/* Botón para activar el formulario de devolución */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowReturn(!showReturn)}
          >
            {showReturn ? "Ocultar Devoluciones" : "Reembolso"}
          </button>
        </div>

        {showForm ? (
          <CreateOrderForm />
        ) : showReturn ? (
          <CreateReturnForm /> // Asegúrate de tener el componente ReturnForm implementado
        ) : orders?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-4"></h2>
                <div className="mb-2">
                  <p>ID: {order._id}</p>
                  <h3 className="font-bold">Productos:</h3>
                  {order.productos.map((producto) => (
                    <div key={producto.producto._id} className=" mb-2">
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

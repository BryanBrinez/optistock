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
    return <p>Cargando órdenes...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Órdenes</h1>
      <div>
        {orders?.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="p-4 border rounded mb-4">
              <h2 className="text-lg font-semibold mb-2">
                Orden ID: {order._id}
              </h2>

              <div className="mb-2">
                <h3 className="font-bold">Productos:</h3>
                {order.productos.map((producto) => (
                  <div key={producto.producto._id} className="ml-4 mb-2">
                    <p className="font-semibold">{producto.producto.nombre}</p>
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
                <p>
                  {new Date(order.fecha_pedido).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay órdenes disponibles.</p>
        )}
      </div>
    </div>
  );
}

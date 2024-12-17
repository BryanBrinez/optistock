"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function DetalleProveedor() {
  const router = useRouter();
  const { id } = router.query;

  const [proveedor, setProveedor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProveedor = async () => {
      try {
        const response = await fetch(`/api/supplier/${id}`);
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del proveedor");
        }
        const data = await response.json();
        setProveedor(data);
      } catch (error) {
        console.error("Error al obtener detalles del proveedor:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProveedor();
  }, [id]);

  if (isLoading) {
    return <p className="text-center">Cargando detalles del proveedor...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!proveedor) {
    return <p className="text-center text-gray-500">Proveedor no encontrado.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="bg-blue-500 text-white py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Detalles del Proveedor</h1>
        </div>
      </header>
      <main className="mt-8">
        <h2 className="text-xl font-bold text-gray-800">Proveedor: {proveedor.nombre}</h2>
        <p><strong>Identificación:</strong> {proveedor.identificacion}</p>
        <p><strong>Dirección:</strong> {proveedor.direccion}</p>
        <p><strong>Contacto:</strong> {proveedor.contacto.correo}, {proveedor.contacto.telefono}</p>

        <h3 className="text-lg font-bold mt-4">Productos Suministrados:</h3>
        {proveedor.productosSuministrados.length === 0 ? (
          <p className="text-gray-600">Este proveedor no ha suministrado productos.</p>
        ) : (
          <ul className="mt-4">
            {proveedor.productosSuministrados.map((producto, index) => (
              <li key={index} className="border-b py-4">
                <p><strong>Nombre:</strong> {producto.idProduct?.nombre || "Producto no disponible"}</p>
                <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                <p><strong>Precio:</strong> ${producto.precio}</p>
                <p><strong>Término de Entrega:</strong> {producto.terminoEntrega}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

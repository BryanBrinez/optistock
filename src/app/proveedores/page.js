"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch("/api/supplier");
        if (!response.ok) {
          throw new Error("Error al cargar los proveedores");
        }
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-500 text-white py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Gestión de Proveedores</h1>
          <p className="mt-2 text-lg">Administra tus proveedores de forma eficiente</p>
        </div>
      </header>
      <main className="p-8">
        {isLoading ? (
          <p className="text-center text-gray-600">Cargando proveedores...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : proveedores.length === 0 ? (
          <p className="text-center text-gray-600">No hay proveedores registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Identificación</th>
                  <th className="px-4 py-2 text-left">Contacto</th>
                  <th className="px-4 py-2 text-left">Dirección</th>
                  <th className="px-4 py-2 text-left">Productos</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor) => (
                  <tr key={proveedor._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                  
                    <Link href={`/proveedores/${proveedor._id}`} className="text-blue-600 hover:underline">
                      {proveedor.nombre}
                    </Link>


                    </td>
                    <td className="border px-4 py-2">{proveedor?.identificacion}</td>
                    <td className="border px-4 py-2">
                      <p>Correo: {proveedor?.contacto?.correo}</p>
                      <p>Teléfono: {proveedor?.contacto?.telefono}</p>
                    </td>
                    <td className="border px-4 py-2">{proveedor?.direccion}</td>
                    <td className="border px-4 py-2">
                      {proveedor?.productosSuministrados?.map((producto, index) => (
                        <div key={index}>
                          <p><strong>Producto:</strong> {producto.idProduct?.nombre}</p>
                          <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                          <p><strong>Precio:</strong> ${producto.precio}</p>
                          <p><strong>Término de Entrega:</strong> {producto.terminoEntrega}</p>
                          <hr className="my-2"/>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

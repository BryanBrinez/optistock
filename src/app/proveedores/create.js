// /pages/proveedores/create.js

"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateProveedor() {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [contactoCorreo, setContactoCorreo] = useState("");
  const [contactoTelefono, setContactoTelefono] = useState("");
  const [condicionesPago, setCondicionesPago] = useState("");
  const [productosSuministrados, setProductosSuministrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const newSupplier = {
      nombre,
      direccion,
      identificacion,
      contacto: { correo: contactoCorreo, telefono: contactoTelefono },
      condicionesPago,
      productosSuministrados,
    };

    try {
      const response = await fetch("/api/supplier/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) {
        throw new Error("Error al crear el proveedor");
      }

      // Redirigir a la lista de proveedores
      router.push("/proveedores");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-500 text-white py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Crear Proveedor</h1>
          <p className="mt-2 text-lg">Ingresa los datos del nuevo proveedor</p>
        </div>
      </header>
      <main className="p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Identificación</label>
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Correo de Contacto</label>
              <input
                type="email"
                value={contactoCorreo}
                onChange={(e) => setContactoCorreo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Teléfono de Contacto</label>
              <input
                type="text"
                value={contactoTelefono}
                onChange={(e) => setContactoTelefono(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Condiciones de Pago</label>
              <input
                type="text"
                value={condicionesPago}
                onChange={(e) => setCondicionesPago(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Productos Suministrados</label>
              {/* Aquí agregarías la funcionalidad para agregar productos suministrados */}
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Crear Proveedor"}
              </button>
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        </form>
      </main>
    </div>
  );
}

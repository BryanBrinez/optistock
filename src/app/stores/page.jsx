"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({}); // Controla qué tienda está en modo edición

  // Función para obtener las tiendas
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

  // Función para manejar la edición
  const toggleEditMode = (idStore) => {
    setEditMode((prev) => ({ ...prev, [idStore]: !prev[idStore] }));
  };

  // Función para guardar los cambios
  const saveChanges = async (idStore) => {
    const updatedStore = stores.find((store) => store.idStore === idStore);

    try {
      const response = await axios.put("/api/store", {
        idStore,
        ...updatedStore,
      });
      console.log("Tienda actualizada:", response.data);

      // Actualizar la lista de tiendas con los datos guardados
      setStores((prev) =>
        prev.map((store) =>
          store.idStore === idStore ? response.data : store
        )
      );

      // Desactivar el modo edición para esta tienda
      toggleEditMode(idStore);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

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
                {editMode[store.idStore] ? (
                  <>
                    <input
                      className="border rounded w-full p-2 mb-2"
                      value={store.nombre}
                      onChange={(e) =>
                        setStores((prev) =>
                          prev.map((s) =>
                            s.idStore === store.idStore
                              ? { ...s, nombre: e.target.value }
                              : s
                          )
                        )
                      }
                    />
                    <input
                      className="border rounded w-full p-2 mb-2"
                      value={store.direccion}
                      onChange={(e) =>
                        setStores((prev) =>
                          prev.map((s) =>
                            s.idStore === store.idStore
                              ? { ...s, direccion: e.target.value }
                              : s
                          )
                        )
                      }
                    />
                    <input
                      className="border rounded w-full p-2 mb-2"
                      value={store.ciudad}
                      onChange={(e) =>
                        setStores((prev) =>
                          prev.map((s) =>
                            s.idStore === store.idStore
                              ? { ...s, ciudad: e.target.value }
                              : s
                          )
                        )
                      }
                    />
                    <input
                      className="border rounded w-full p-2 mb-2"
                      value={store.codigoPostal}
                      onChange={(e) =>
                        setStores((prev) =>
                          prev.map((s) =>
                            s.idStore === store.idStore
                              ? { ...s, codigoPostal: e.target.value }
                              : s
                          )
                        )
                      }
                    />
                    <input
                      className="border rounded w-full p-2 mb-2"
                      type="number"
                      value={store.capacidadAlmacenamiento}
                      onChange={(e) =>
                        setStores((prev) =>
                          prev.map((s) =>
                            s.idStore === store.idStore
                              ? { ...s, capacidadAlmacenamiento: e.target.value }
                              : s
                          )
                        )
                      }
                    />
                    <input
                      className="border rounded w-full p-2 mb-2"
                      value={store.horarioOperacion}
                      onChange={(e) =>
                        setStores((prev) =>
                          prev.map((s) =>
                            s.idStore === store.idStore
                              ? { ...s, horarioOperacion: e.target.value }
                              : s
                          )
                        )
                      }
                    />
                    <button
                      onClick={() => saveChanges(store.idStore)}
                      className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold mb-4">{store.nombre}</h2>
                    <p>Dirección: {store.direccion}</p>
                    <p>Ciudad: {store.ciudad}</p>
                    <p>Código Postal: {store.codigoPostal}</p>
                    <p>Capacidad: {store.capacidadAlmacenamiento} unidades</p>
                    <p>Horario: {store.horarioOperacion}</p>
                    <button
                      onClick={() => toggleEditMode(store.idStore)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors w-full"
                    >
                      Editar
                    </button>
                  </>
                )}
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

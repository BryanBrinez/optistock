"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({}); // Controla qué tienda está en modo edición

  // Función obtener tiendas
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

  useEffect(() => {
    fetchStores();
  }, []);

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

      // Actualizar lista de tiendas con los datos guardados
      setStores((prev) =>
        prev.map((store) =>
          store.idStore === idStore ? response.data : store
        )
      );

      toggleEditMode(idStore); // Salir de edición
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Función para eliminar una tienda
  const deleteStore = async (idStore) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta tienda? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/store?idStore=${idStore}`);
      setStores((prev) => prev.filter((store) => store.idStore !== idStore));
      console.log("Tienda eliminada");
    } catch (error) {
      console.error("Error al eliminar la tienda:", error);
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
                      type="text"
                      className="mb-2 p-2 border rounded w-full"
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
                      type="text"
                      className="mb-2 p-2 border rounded w-full"
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
                      type="text"
                      className="mb-2 p-2 border rounded w-full"
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
                      type="text"
                      className="mb-2 p-2 border rounded w-full"
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
                      type="number"
                      className="mb-2 p-2 border rounded w-full"
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
                      type="text"
                      className="mb-2 p-2 border rounded w-full"
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
                    <div className="flex">
                      <div className="flex-1">
                        <button
                          className="bg-green-500 text-white px-4 py-2 w-full rounded-l"
                          onClick={() => saveChanges(store.idStore)}
                        >
                          Guardar
                        </button>
                      </div>
                      <div className="flex-1">
                        <button
                          className="bg-red-500 text-white px-4 py-2 w-full rounded-r"
                          onClick={() => deleteStore(store.idStore)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold mb-4">{store.nombre}</h2>
                    <p className="mb-2">Dirección: {store.direccion}</p>
                    <p className="mb-2">Ciudad: {store.ciudad}</p>
                    <p className="mb-2">Código Postal: {store.codigoPostal}</p>
                    <p className="mb-2">
                      Capacidad: {store.capacidadAlmacenamiento} unidades
                    </p>
                    <p className="mb-2">Horario: {store.horarioOperacion}</p>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors w-full"
                      onClick={() => toggleEditMode(store.idStore)}
                    >
                      Editar
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No hay tiendas disponibles.</p>
        )}
      </main>
    </div>
  );
}

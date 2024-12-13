"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({}); // Controla qué tienda está en modo edición
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    idStore: "",
    nombre: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    capacidadAlmacenamiento: "",
    horarioOperacion: "",
  });

  // Obtener tiendas
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

  // Alternar modo de edición
  const toggleEditMode = (idStore) => {
    setEditMode((prev) => ({ ...prev, [idStore]: !prev[idStore] }));
  };

  // Guardar cambios
  const saveChanges = async (idStore) => {
    const updatedStore = stores.find((store) => store.idStore === idStore);

    try {
      const response = await axios.put("/api/store", updatedStore);
      setStores((prev) =>
        prev.map((store) =>
          store.idStore === idStore ? response.data : store
        )
      );
      toggleEditMode(idStore);
      console.log("Tienda actualizada:", response.data);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Eliminar tienda
  const deleteStore = async (idStore) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta tienda?"
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

  // Crear nueva tienda
  const createStore = async () => {
    try {
      const response = await axios.post("/api/store", newStore);
      setStores((prev) => [...prev, response.data]);
      setShowCreateForm(false);
      setNewStore({
        idStore: "",
        nombre: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        capacidadAlmacenamiento: "",
        horarioOperacion: "",
      });
      console.log("Tienda creada:", response.data);
    } catch (error) {
      console.error("Error al crear la tienda:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Cargando tiendas...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Gestión de Tiendas</h1>

      <div className="flex flex-wrap gap-4">
        {stores.map((store, index) => (
          <div
            key={store.idStore || index}
            className="bg-gray-100 rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-grow"
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
                  type="text"
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
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => saveChanges(store.idStore)}
                >
                  Guardar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold">{store.nombre}</h2>
                <p>Dirección: {store.direccion}</p>
                <p>Ciudad: {store.ciudad}</p>
                <p>Código Postal: {store.codigoPostal}</p>
                <p>Capacidad: {store.capacidadAlmacenamiento}</p>
                <p>Horario: {store.horarioOperacion}</p>
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mx-2 rounded"
                    onClick={() => toggleEditMode(store.idStore)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 mx-2 rounded"
                    onClick={() => deleteStore(store.idStore)}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full mb-4"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancelar" : "Crear nueva tienda"}
        </button>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <input
              type="text"
              placeholder="ID de la tienda"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.idStore}
              onChange={(e) =>
                setNewStore({ ...newStore, idStore: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Nombre de tienda"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.nombre}
              onChange={(e) =>
                setNewStore({ ...newStore, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Dirección de tienda"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.direccion}
              onChange={(e) =>
                setNewStore({ ...newStore, direccion: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ciudad de tienda"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.ciudad}
              onChange={(e) =>
                setNewStore({ ...newStore, ciudad: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Código Postal de Tienda"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.codigoPostal}
              onChange={(e) =>
                setNewStore({ ...newStore, codigoPostal: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Capacidad de Almacenamiento"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.capacidadAlmacenamiento}
              onChange={(e) =>
                setNewStore({
                  ...newStore,
                  capacidadAlmacenamiento: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Horario de Operación"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.horarioOperacion}
              onChange={(e) =>
                setNewStore({ ...newStore, horarioOperacion: e.target.value })
              }
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={createStore}
            >
              Guardar Tienda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
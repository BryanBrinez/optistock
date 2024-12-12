"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});

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

  //Función Crear Nueva Tienda
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    idStore: "", // Nuevo campo agregado
    nombre: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    capacidadAlmacenamiento: "",
    horarioOperacion: "",
  });

  const createStore = async () => {
    if (!newStore.idStore) {
      alert("El campo 'idStore' es obligatorio.");
      return;
    }

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
      <h1 className="text-2xl font-bold mb-6">Gestión de Tiendas</h1>
      <div>
        {stores.map((store, index) => (
          <div
            key={store.id || index}
            className="bg-gray-100 rounded-lg shadow-md p-4 mb-4"
          >
            <h2 className="text-lg font-bold">{store.nombre}</h2>
            <p>Dirección: {store.direccion}</p>
            <p>Ciudad: {store.ciudad}</p>
            <p>Código Postal: {store.codigoPostal}</p>
            <p>Capacidad de Almacenamiento: {store.capacidadAlmacenamiento}</p>
            <p>Horario de Operación: {store.horarioOperacion}</p>
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
              placeholder="ID de la tienda (idStore)"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.idStore}
              onChange={(e) =>
                setNewStore({ ...newStore, idStore: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Nombre"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.nombre}
              onChange={(e) =>
                setNewStore({ ...newStore, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Dirección"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.direccion}
              onChange={(e) =>
                setNewStore({ ...newStore, direccion: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="mb-2 p-2 border rounded w-full"
              value={newStore.ciudad}
              onChange={(e) =>
                setNewStore({ ...newStore, ciudad: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Código Postal"
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

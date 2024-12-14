"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    nombre: "",
    direccion_envio: {
      calle: "",
      ciudad: "",
      codigo_postal: "",
    },
    historial_pedidos: [],
  });

  // Obtener clientes
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Alternar modo de edición
  const toggleEditMode = (customerId) => {
    setEditMode((prev) => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  // Guardar cambios
  const saveChanges = async (customerId) => {
    const updatedCustomer = customers.find((customer) => customer._id === customerId);

    try {
      const response = await axios.put(`/api/customers`, updatedCustomer);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === customerId ? response.data : customer
        )
      );
      toggleEditMode(customerId);
      console.log("Cliente actualizado:", response.data);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Eliminar cliente
  const deleteCustomer = async (customerId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/customers?id=${customerId}`);
      setCustomers((prev) => prev.filter((customer) => customer._id !== customerId));
      console.log("Cliente eliminado");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  // Crear nuevo cliente
  const createCustomer = async () => {
    try {
      const response = await axios.post("/api/customers", newCustomer);
      setCustomers((prev) => [...prev, response.data]);
      setShowCreateForm(false);
      setNewCustomer({
        nombre: "",
        direccion_envio: {
          calle: "",
          ciudad: "",
          codigo_postal: "",
        },
        historial_pedidos: [],
      });
      console.log("Cliente creado:", response.data);
    } catch (error) {
      console.error("Error al crear el cliente:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Cargando clientes...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Gestión de Clientes</h1>

      <div className="flex flex-wrap gap-4">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="bg-gray-100 rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-grow"
          >
            {editMode[customer._id] ? (
              <>
                <input
                  type="text"
                  className="mb-2 p-2 border rounded w-full"
                  value={customer.nombre}
                  onChange={(e) =>
                    setCustomers((prev) =>
                      prev.map((c) =>
                        c._id === customer._id
                          ? { ...c, nombre: e.target.value }
                          : c
                      )
                    )
                  }
                />
                <input
                  type="text"
                  className="mb-2 p-2 border rounded w-full"
                  value={customer.direccion_envio.calle}
                  onChange={(e) =>
                    setCustomers((prev) =>
                      prev.map((c) =>
                        c._id === customer._id
                          ? {
                              ...c,
                              direccion_envio: {
                                ...c.direccion_envio,
                                calle: e.target.value,
                              },
                            }
                          : c
                      )
                    )
                  }
                />
                <input
                  type="text"
                  className="mb-2 p-2 border rounded w-full"
                  value={customer.direccion_envio.ciudad}
                  onChange={(e) =>
                    setCustomers((prev) =>
                      prev.map((c) =>
                        c._id === customer._id
                          ? {
                              ...c,
                              direccion_envio: {
                                ...c.direccion_envio,
                                ciudad: e.target.value,
                              },
                            }
                          : c
                      )
                    )
                  }
                />
                <input
                  type="text"
                  className="mb-2 p-2 border rounded w-full"
                  value={customer.direccion_envio.codigo_postal}
                  onChange={(e) =>
                    setCustomers((prev) =>
                      prev.map((c) =>
                        c._id === customer._id
                          ? {
                              ...c,
                              direccion_envio: {
                                ...c.direccion_envio,
                                codigo_postal: e.target.value,
                              },
                            }
                          : c
                      )
                    )
                  }
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => saveChanges(customer._id)}
                >
                  Guardar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold">{customer.nombre}</h2>
                <p>Dirección: {customer.direccion_envio.calle}</p>
                <p>Ciudad: {customer.direccion_envio.ciudad}</p>
                <p>Código Postal: {customer.direccion_envio.codigo_postal}</p>
                <p>Historial de Pedidos:</p>
                <ul className="list-disc pl-5">
                  {Array.isArray(customer.historial_pedidos) && customer.historial_pedidos.length > 0 ? (
                    customer.historial_pedidos.map((pedido, index) => (
                      <li key={index}>
                        {pedido.nombre} - {pedido.estado}
                      </li>
                    ))
                  ) : (
                    <li>No hay pedidos en el historial.</li>
                  )}
                </ul>

                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mx-2 rounded"
                    onClick={() => toggleEditMode(customer._id)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 mx-2 rounded"
                    onClick={() => deleteCustomer(customer._id)}
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
          {showCreateForm ? "Cancelar" : "Crear nuevo cliente"}
        </button>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <input
              type="text"
              placeholder="Nombre del cliente"
              className="mb-2 p-2 border rounded w-full"
              value={newCustomer.nombre}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Calle"
              className="mb-2 p-2 border rounded w-full"
              value={newCustomer.direccion_envio.calle}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  direccion_envio: {
                    ...newCustomer.direccion_envio,
                    calle: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="mb-2 p-2 border rounded w-full"
              value={newCustomer.direccion_envio.ciudad}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  direccion_envio: {
                    ...newCustomer.direccion_envio,
                    ciudad: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Código Postal"
              className="mb-2 p-2 border rounded w-full"
              value={newCustomer.direccion_envio.codigo_postal}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  direccion_envio: {
                    ...newCustomer.direccion_envio,
                    codigo_postal: e.target.value,
                  },
                })
              }
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={createCustomer}
            >
              Guardar Cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function InventoryPage({ params }) {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedProducts, setEditedProducts] = useState({});
  const storeId = React.use(params).storeId; // Desempaquetar params con React.use()

  // Función para obtener el inventario
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/inventory/${storeId}`);
      setInventory(response.data);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar al montar el componente o cuando `storeId` cambie
  useEffect(() => {
    if (storeId) {
      fetchInventory();
    }
  }, [storeId]);

  // Manejar cambios en la cantidad
  const handleQuantityChange = (productId, quantity) => {
    setEditedProducts({
      ...editedProducts,
      [productId]: parseInt(quantity, 10), // Asegurar que sea un número
    });
  };

  // Guardar los cambios realizados en el inventario
  const saveChanges = async () => {
    const updatedProducts = inventory.productos.map((item) => ({
      producto: item.producto._id,
      cantidad: editedProducts[item.producto._id] ?? item.cantidad,
    }));

    try {
      await axios.put(`/api/inventory/${storeId}`, { productos: updatedProducts });
      fetchInventory(); // Actualizar la información después de guardar
    } catch (error) {
      console.error("Error al guardar los cambios en el inventario:", error);
    }
  };

  if (loading) return <p>Cargando inventario...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Inventario de la Tienda {storeId}</h1>
      <div>
      {inventory?.productos?.length > 0 ? (
  inventory.productos.map((item, index) => (
    <div key={item.producto._id} className="p-4 border rounded mb-4">
      <h2 className="text-lg font-semibold">{item.producto.nombre}</h2>
      <p>Descripción: {item.producto.descripcion}</p>
      <p>Precio: ${item.producto.precio}</p>
      <div className="mt-2">
        <label className="mr-2">Cantidad:</label>
        <input
          type="number"
          value={editedProducts[item.producto._id] ?? item.cantidad}
          onChange={(e) => handleQuantityChange(item.producto._id, e.target.value)}
          className="border p-2 w-24"
          min="0" // Evitar valores negativos
        />
      </div>
    </div>
  ))
) : (
  <p>No hay productos en este inventario.</p>
)}
      </div>
      <button
        onClick={saveChanges}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Guardar Cambios
      </button>
    </div>
  );
}

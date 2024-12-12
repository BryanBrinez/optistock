"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function CreateOrderForm() {
  const [formData, setFormData] = useState({
    cliente: "",
    tienda: "",
    productos: [{ producto: "", cantidad: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.productos];
    updatedProducts[index][name] = value;
    setFormData({ ...formData, productos: updatedProducts });
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { producto: "", cantidad: "" }],
    });
  };

  const removeProductField = (index) => {
    const updatedProducts = formData.productos.filter((_, i) => i !== index);
    setFormData({ ...formData, productos: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Datos enviados:", formData);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Enviar los datos tal cual
      });

      if (response.ok) {
        setMessage("Orden creada exitosamente.");
        setFormData({
          cliente: "",
          tienda: "",
          productos: [{ producto: "", cantidad: "" }],
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al crear la orden.");
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Crear Orden</h1>

      {message && <p className="mb-4 text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="cliente"
            className="block text-gray-700 font-medium mb-2"
          >
            Cliente
          </label>
          <input
            type="text"
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="tienda"
            className="block text-gray-700 font-medium mb-2"
          >
            Tienda
          </label>
          <input
            type="text"
            id="tienda"
            name="tienda"
            value={formData.tienda}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Productos
          </label>
          {formData.productos.map((producto, index) => (
            <div key={index} className="flex space-x-4 mb-2">
              <input
                type="text"
                name="producto"
                placeholder="Manzana, Pera, etc."
                value={producto.producto}
                onChange={(e) => handleProductChange(index, e)}
                className="flex-1 border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                value={producto.cantidad}
                onChange={(e) => handleProductChange(index, e)}
                className="w-24 border border-gray-300 rounded px-4 py-2"
                required
              />
              <button
                type="button"
                onClick={() => removeProductField(index)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProductField}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Agregar Producto
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Creando orden..." : "Crear Orden"}
        </button>
      </form>
    </div>
  );
}

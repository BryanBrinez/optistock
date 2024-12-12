"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
    });
  };

  const saveChanges = async () => {
    try {
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        precio: parseFloat(formData.precio),
      };

      await axios.post("/api/product", updatedProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="p-8">
        {loading ? (
          <p className="text-center text-gray-600">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.idProduct}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                {editingProduct &&
                editingProduct.idProduct === product.idProduct ? (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Editando: {product.nombre}
                    </h2>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 mb-2 w-full"
                      placeholder="Nombre"
                    />
                    <textarea
                      name="descripcion"
                      value={formData.descripcion} //
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 mb-2 w-full"
                      placeholder="Descripción"
                    />
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 mb-2 w-full"
                      placeholder="Precio"
                    />
                    <button
                      onClick={saveChanges}
                      className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold">{product.nombre}</h2>
                    <p className="text-gray-700">{product.descripcion}</p>
                    <p className="text-gray-600 font-bold mt-2">
                      ${product.precio.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors w-full"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
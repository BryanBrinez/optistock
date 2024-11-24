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

  // Función para cargar productos desde el backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product"); // Llama al endpoint GET
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Seleccionar un producto para editar
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
    });
  };

  // Guardar cambios en un producto
  const saveChanges = async () => {
    try {
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        precio: parseFloat(formData.precio), // Asegurar que el precio sea un número
      };

      await axios.post("/api/product", updatedProduct); // Llama al endpoint POST
      setEditingProduct(null); // Salir del modo de edición
      fetchProducts(); // Recargar los productos para ver los cambios
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div
              key={product.idProduct}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              {editingProduct && editingProduct.idProduct === product.idProduct ? (
                <div>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Nombre"
                  />
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Descripción"
                  />
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Precio"
                  />
                  <button
                    onClick={saveChanges}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold">{product.nombre}</h2>
                  <p>{product.descripcion}</p>
                  <p className="text-gray-600">${product.precio.toFixed(2)}</p>
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

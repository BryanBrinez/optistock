"use client";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  return (
    <nav className="bg-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold">
          <a href="#" className="hover:text-blue-200">
            Mi Aplicación
          </a>
        </div>

        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <a href="#inventario" className="hover:text-blue-200">
            Inventario
          </a>
          <a href="#reportes" className="hover:text-blue-200">
            Reportes
          </a>
          <a href="#productos" className="hover:text-blue-200">
            Productos
          </a>
          <a href="#ordenes" className="hover:text-blue-200">
            Órdenes
          </a>
          <a href="#tiendas" className="hover:text-blue-200">
            Tiendas
          </a>
          <a href="#proveedores" className="hover:text-blue-200">
            Proveedores
          </a>
        </div>

        {/* Botón para menú móvil */}
        <div className="md:hidden">
          <button
            className="focus:outline-none text-white hover:text-blue-200"
            onClick={() => {
              const menu = document.getElementById("mobileMenu");
              menu.classList.toggle("hidden");
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div id="mobileMenu" className="hidden md:hidden bg-blue-500">
        <div className="flex flex-col space-y-2 p-4">
          <a href="#inventario" className="hover:text-blue-200">
            Inventario
          </a>
          <a href="#reportes" className="hover:text-blue-200">
            Reportes
          </a>
          <a href="#productos" className="hover:text-blue-200">
            Productos
          </a>
          <a href="#ordenes" className="hover:text-blue-200">
            Órdenes
          </a>
          <a href="#tiendas" className="hover:text-blue-200">
            Tiendas
          </a>
          <a href="#proveedores" className="hover:text-blue-200">
            Proveedores
          </a>
        </div>
      </div>
    </nav>
  );
}

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
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Gestión de Productos</h1>
          <p className="mt-2 text-lg">Administra tus productos de manera sencilla y eficiente</p>
        </div>
      </header>

      {/* Main Content */}
      <Navbar />
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
                {editingProduct && editingProduct.idProduct === product.idProduct ? (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Editando: {product.nombre}</h2>
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
                      value={formData.descripcion}//
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
                    <p className="text-gray-600 font-bold mt-2">${product.precio.toFixed(2)}</p>
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

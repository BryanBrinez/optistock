"use client";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-8" style={{ backgroundImage: 'url(/img/texture.jpg)', backgroundSize: 'cover' }}> {/* Fondo con textura */}
        <div className="text-center">
          {/* Logo */}
          <img src="/img/logo.png" alt="Logo" className="mx-auto mb-4 w-32 h-32" />
          <h1 className="text-4xl font-bold text-yellow-500" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Optistock</h1> {/* Título en dorado con sombra */}
          <p className="mt-2 text-lg text-yellow-500" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            De todo, para todos y en todo momento..! 
          </p> {/* Eslogan en dorado con sombra */}
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-gray-800 text-black shadow-md" style={{ backgroundImage: 'url(/img/texture.jpg)', backgroundSize: 'cover', borderTop: '2px solid #555', borderBottom: '2px solid #555', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}> {/* Fondo gris sólido con efecto de relieve suave */}
        <div className="container mx-auto px-4 py-4 flex justify-center items-center">
          {/* Links para pantallas grandes */}
          <div className="hidden md:flex space-x-6">
            <a href="#inventario" className="hover:text-yellow-500 font-semibold">
              Inventario
            </a>
            <a href="#reportes" className="hover:text-yellow-500 font-semibold">
              Reportes
            </a>
            <a href="#productos" className="hover:text-yellow-500 font-semibold">
              Productos
            </a>
            <a href="/orders" className="hover:text-yellow-500 font-semibold">
              Órdenes
            </a>
            <a href="#tiendas" className="hover:text-yellow-500 font-semibold">
              Tiendas
            </a>
            <a href="#proveedores" className="hover:text-yellow-500 font-semibold">
              Proveedores
            </a>
          </div>

          {/* Botón para menú móvil */}
          <div className="md:hidden">
            <button
              className="focus:outline-none text-black hover:text-yellow-500"
              onClick={toggleMobileMenu}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800" style={{ backgroundImage: 'url(/img/texture.jpg)', backgroundSize: 'cover' }}>
            <div className="flex flex-col space-y-2 p-4">
              <a href="#inventario" className="hover:text-yellow-500 font-semibold">
                Inventario
              </a>
              <a href="#reportes" className="hover:text-yellow-500 font-semibold">
                Reportes
              </a>
              <a href="#productos" className="hover:text-yellow-500 font-semibold">
                Productos
              </a>
              <a href="/orders" className="hover:text-yellow-500 font-semibold">
                Órdenes
              </a>
              <a href="#tiendas" className="hover:text-yellow-500 font-semibold">
                Tiendas
              </a>
              <a href="#proveedores" className="hover:text-yellow-500 font-semibold">
                Proveedores
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
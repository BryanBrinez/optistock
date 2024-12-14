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
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Gestión de Productos</h1>
          <p className="mt-2 text-lg">
            Administra tus productos de manera sencilla y eficiente
          </p>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-blue-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-lg font-bold">
            <a href="#" className="hover:text-blue-200">
              Mi Aplicación
            </a>
          </div>

          {/* Links para pantallas grandes */}
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
            <a href="/orders" className="hover:text-blue-200">
              Órdenes
            </a>
            <a href="/stores" className="hover:text-blue-200">
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
              onClick={toggleMobileMenu}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-500">
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
              <a href="/orders" className="hover:text-blue-200">
                Órdenes
              </a>
              <a href="/stores" className="hover:text-blue-200">
                Tiendas
              </a>
              <a href="#proveedores" className="hover:text-blue-200">
                Proveedores
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

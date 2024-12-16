"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/img/image1.jpg",
    "/img/image2.jpg",
    "/img/image3.jpg",
    "/img/image4.jpg"
  ];

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Cambia de imagen cada 3 segundos

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="carousel relative mx-auto" style={{ height: "60vh", width: "90vw", position: "relative", marginTop: '20px' }}> {/* Ajusta la altura, el ancho y la posición del carrusel aquí */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-item absolute ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ height: "100%", transition: "opacity 0.5s ease-in-out", width: "100%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }} // Añade sombra al contorno de las imágenes
        >
          <img src={image} alt={`Slide ${index + 1}`} className="block h-full w-full object-cover" />
        </div>
      ))}
      <button onClick={prevSlide} className="prev control-1 w-10 h-10 absolute cursor-pointer block text-3xl font-bold text-white hover:text-black rounded-full bg-white hover:bg-gray-400 leading-tight text-center z-10" style={{ top: "50%", transform: "translateY(-50%)", left: "10px" }}>‹</button> {/* Botón de anterior */}
      <button onClick={nextSlide} className="next control-1 w-10 h-10 absolute cursor-pointer block text-3xl font-bold text-white hover:text-black rounded-full bg-white hover:bg-gray-400 leading-tight text-center z-10" style={{ top: "50%", transform: "translateY(-50%)", right: "10px" }}>›</button> {/* Botón de siguiente */}
    </div>
  );
};

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#E0E0E0" }}> {/* Fondo gris claro */}
      <div className="flex-grow flex justify-center items-center" style={{ marginTop: '20px' }}> {/* Ajusta el margen superior */}
        {/* Carrusel */}
        <Carousel />
      </div>
      <div className="flex justify-start items-start w-full px-4" style={{ marginTop: '100px', marginLeft: '50px', marginBottom: '120px' }}> {/* Ajusta el margen superior, izquierdo e inferior */}
        {/* Formulario de inscripción */}
        <form className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md"> {/* Fondo gris claro para el formulario */}
          <h2 className="text-2xl font-bold mb-4 text-blue-500">Suscribirse para recibir ofertas</h2> {/* Título en azul */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
              Nombre
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nombre"
              type="text"
              placeholder="Nombre"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Correo Electrónico"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
              Teléfono
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="telefono"
              type="tel"
              placeholder="Teléfono"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Suscribirse
            </button>
          </div>
        </form>
      </div>
      {/* Botón de volver arriba */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        >
          ↑ Volver arriba
        </button>
      )}
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8">
            <p>📞 Teléfono: +52 555 555 5555</p>
            <p>✉️ Correo: soporte@tutienda.com</p>
            <p>🏠 Dirección: Av. Principal 123, Ciudad, País</p>
            <p>⏰ Horario de atención: Lunes a Viernes, 9:00 a.m. - 6:00 p.m.</p>
          </div>
          <p className="mt-4">&copy; 2024 Optistock. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
// "use client";
// import { useState } from "react";

// export default function CreateReturnForm() {
//   const [formData, setFormData] = useState({
//     producto: "",
//     pedido: "",
//     cantidad: 1,
//     razon: "",
//     tipo: "reembolso",
//     montoReembolso: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]:
//         name === "cantidad" || name === "montoReembolso"
//           ? Number(value)
//           : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const response = await fetch("/api/return", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setMessage("Devolución creada exitosamente.");
//         setFormData({
//           producto: "",
//           pedido: "",
//           cantidad: 1,
//           razon: "",
//           tipo: "reembolso",
//           montoReembolso: 0,
//         });
//       } else {
//         const errorData = await response.json();
//         setMessage(errorData.message || "Error al crear la devolución.");
//       }
//     } catch (error) {
//       setMessage("Error al conectar con el servidor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
//       <h1 className="text-2xl font-bold mb-6">Crear Devolución</h1>

//       {message && <p className="mb-4 text-center text-red-500">{message}</p>}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label
//             htmlFor="producto"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Producto
//           </label>
//           <input
//             type="text"
//             id="producto"
//             name="producto"
//             value={formData.producto}
//             onChange={handleInputChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="pedido"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Pedido
//           </label>
//           <input
//             type="text"
//             id="pedido"
//             name="pedido"
//             value={formData.pedido}
//             onChange={handleInputChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="cantidad"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Cantidad
//           </label>
//           <input
//             type="number"
//             id="cantidad"
//             name="cantidad"
//             value={formData.cantidad}
//             onChange={handleInputChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             min="1"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="razon"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Razón
//           </label>
//           <input
//             type="text"
//             id="razon"
//             name="razon"
//             value={formData.razon}
//             onChange={handleInputChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="tipo"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Tipo de Devolución
//           </label>
//           <select
//             id="tipo"
//             name="tipo"
//             value={formData.tipo}
//             onChange={handleInputChange}
//             className="w-full border border-gray-300 rounded px-4 py-2"
//             required
//           >
//             <option value="reembolso">Reembolso</option>
//             <option value="reemplazo">Reemplazo</option>
//           </select>
//         </div>

//         {formData.tipo === "reembolso" && (
//           <div className="mb-4">
//             <label
//               htmlFor="montoReembolso"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Monto del Reembolso
//             </label>
//             <input
//               type="number"
//               id="montoReembolso"
//               name="montoReembolso"
//               value={formData.montoReembolso}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2"
//               min="0"
//               required
//             />
//           </div>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//           disabled={loading}
//         >
//           {loading ? "Creando devolución..." : "Crear Devolución"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function CreateReturnForm() {
  const [formData, setFormData] = useState({
    producto: "",
    pedido: "",
    cantidad: 1,
    razon: "",
    tipo: "reembolso",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "cantidad" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Calcular el monto de reembolso en base a la cantidad (esto depende de la lógica de tu negocio)
    const montoReembolso = formData.cantidad * 10; // Ejemplo: 10 es el valor por unidad de producto

    // Añadir montoReembolso al objeto formData antes de enviarlo
    const dataToSend = { ...formData, montoReembolso };

    try {
      const response = await fetch("/api/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setMessage("Devolución creada exitosamente.");
        setFormData({
          producto: "",
          pedido: "",
          cantidad: 1,
          razon: "",
          tipo: "reembolso",
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al crear la devolución.");
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Crear Devolución</h1>

      {message && <p className="mb-4 text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="producto"
            className="block text-gray-700 font-medium mb-2"
          >
            Producto
          </label>
          <input
            type="text"
            id="producto"
            name="producto"
            value={formData.producto}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="pedido"
            className="block text-gray-700 font-medium mb-2"
          >
            Pedido
          </label>
          <input
            type="text"
            id="pedido"
            name="pedido"
            value={formData.pedido}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cantidad"
            className="block text-gray-700 font-medium mb-2"
          >
            Cantidad
          </label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="razon"
            className="block text-gray-700 font-medium mb-2"
          >
            Razón
          </label>
          <input
            type="text"
            id="razon"
            name="razon"
            value={formData.razon}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="tipo"
            className="block text-gray-700 font-medium mb-2"
          >
            Tipo de Devolución
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          >
            <option value="reembolso">Reembolso</option>
            <option value="reemplazo">Reemplazo</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Creando devolución..." : "Crear Devolución"}
        </button>
      </form>
    </div>
  );
}

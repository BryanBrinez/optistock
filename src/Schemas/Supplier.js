import mongoose from "mongoose";

// Asegúrate de que el modelo Product esté correctamente definido
const SupplierSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    identificacion: { type: String, required: true },
    contacto: {
      correo: { type: String, required: true },
      telefono: { type: String, required: true },
    },
    productosSuministrados: [
      {
        idProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Referencia al modelo Product
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true },
        terminoEntrega: { type: String, required: true },
      },
    ],
    condicionesPago: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);

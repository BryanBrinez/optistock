import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    idProduct: { type: String, required: true, unique: true }, // Aseguramos que sea único
    precio: { type: Number, required: true },
    proveedores: [
      {
        proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }, // Referencia al proveedor
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

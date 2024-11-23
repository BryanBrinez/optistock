// models/Store.js
import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    capacidadAlmacenamiento: { type: Number, required: true },
    horarioOperacion: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Store || mongoose.model("Store", storeSchema);

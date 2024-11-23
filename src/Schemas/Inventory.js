import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    tienda: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    productos: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        cantidad: { type: Number, required: true },
        fechaLlegada: { type: Date, default: Date.now },
        fechaUltimaActualizacion: { type: Date, default: Date.now },
        nivelAlerta: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

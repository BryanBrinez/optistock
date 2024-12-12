import mongoose from "mongoose";

const ReturnSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    pedido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    razon: {
      type: String,
      required: true,
      maxlength: 500, // Limitar la longitud de la razón
    },
    tipo: {
      type: String,
      enum: ["reembolso", "reemplazo"],
      required: true,
    },
    montoReembolso: {
      type: Number,
      required: function () {
        return this.tipo === "reembolso";
      },
      validate: {
        validator: function (v) {
          return this.tipo !== "reembolso" || (typeof v === "number" && v >= 0);
        },
        message: "El monto de reembolso debe ser un número no negativo.",
      },
    },
  },
  {
    timestamps: true, // Incluye automáticamente `createdAt` y `updatedAt`
  }
);

const Return = mongoose.models.Return || mongoose.model("Return", ReturnSchema);

export default Return;

import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion_envio: {
    calle: { type: String },
    ciudad: { type: String },
    codigo_postal: { type: String },
  },
  historial_pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Referencia a Pedidos
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

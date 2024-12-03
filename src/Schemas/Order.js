import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  tienda: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      cantidad: { type: Number, required: true },
    }
  ],
  estado: { type: String, enum: ['pendiente', 'entregado', 'cancelado'], default: 'pendiente' },
  fecha_pedido: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

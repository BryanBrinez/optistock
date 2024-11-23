import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  datos: { type: mongoose.Schema.Types.Mixed, required: true }, // Campo dinámico para datos
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);

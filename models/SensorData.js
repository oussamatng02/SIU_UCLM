import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
    sensorId: { type: String, required: true },
    tipo: { type: String, required: true },
    valor: { type: Number, required: true },
    unidad: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('SensorData', sensorSchema);
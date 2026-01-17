import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SensorData from '../models/SensorData.js';

const router = express.Router();


const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Acceso denegado: Falta Token' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token no válido' });
    }
};


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
  
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


router.post('/datos', verifyToken, async (req, res) => {
    try {
        const nuevoDato = new SensorData(req.body);
        await nuevoDato.save();
        console.log(`📥 [API] Recibido: ${req.body.tipo} -> ${req.body.valor} ${req.body.unidad}`);
        res.status(201).json({ msg: 'Guardado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
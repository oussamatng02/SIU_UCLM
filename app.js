import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import apiRouter from './routes/api.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const connectionString = `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;


mongoose.connect(connectionString)
    .then(() => console.log('Base de Datos Conectada a la Nube (Atlas)'))
    .catch(err => {
        console.error('Error de conexión:', err);
        console.error('Revisa que tu IP esté permitida en MongoDB Atlas (Network Access)');
    });


app.use('/api', apiRouter);


const initAdmin = async () => {
    const adminUser = 'admin';
    const adminPass = '123456'; 
    
    try {
        const existe = await User.findOne({ username: adminUser });
        if (!existe) {
            const hash = bcrypt.hashSync(adminPass, 10);
            await User.create({ username: adminUser, password: hash });
            console.log(`Admin creado: Usuario='${adminUser}' / Password='${adminPass}'`);
        }
    } catch (e) {
        console.error('Error creando admin:', e);
    }
};


app.listen(PORT, async () => {
    await initAdmin();
    console.log(`Servidor listo en http://localhost:${PORT}`);
});
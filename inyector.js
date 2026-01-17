import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';


const API_URL = 'http://localhost:3000/api';
const CSV_FILE = 'datos.csv'; 
const DELAY_MS = 1500; 
const run = async () => {
    console.log('INICIANDO SIMULADOR DE DATOS DE SENSORES');


    let token;
    try {
        console.log('Autenticando...');
        const res = await axios.post(`${API_URL}/login`, { username: 'admin', password: '123456' });
        token = res.data.token;
        console.log('Token obtenido.');
    } catch (e) {
        console.error('Error de Login. ¿Está el servidor (npm start) corriendo?');
        process.exit(1);
    }

    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (row) => filas.push(row))
        .on('end', async () => {
            console.log(`Cargados ${filas.length} datos. Iniciando transmisión...`);
            
            for (const row of filas) {
                try {
             
                    await new Promise(r => setTimeout(r, DELAY_MS));

           
                    await axios.post(`${API_URL}/datos`, {
                        sensorId: row.sensorId,
                        tipo: row.tipo,
                        valor: parseFloat(row.valor), 
                        unidad: row.unidad
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    console.log(`Enviado: ${row.tipo} (${row.valor} ${row.unidad})`);
                } catch (err) {
                    console.error('Error enviando dato:', err.message);
                }
            }
            console.log('Fin de la simulación.');
        });
};

run();
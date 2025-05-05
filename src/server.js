import APP from './app.js'
import {configDotenv} from "dotenv"
import connectDB from "./config/database.config.js";
import cluster from 'node:cluster'
import process from "node:process";
import os from "node:os";

configDotenv()
if (cluster.isPrimary) {
    console.log(`Master process is running on PID ${process.pid}. Forking workers...`);
    const numCPUs = os.cpus().length
    let i = 0
    for (i; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        console.log('Starting a new worker...');
        cluster.fork();
    })

}
const PORT = process.env._PORT || 5000
connectDB().then(() => {
    APP.listen(PORT, () => {
        console.log(`🚀 Server is running, Worker ${process.pid} is listening on port ${PORT}`)
    })
})

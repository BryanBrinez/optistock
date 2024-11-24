import { createClient } from "redis";

// Crear y exportar la instancia de Redis
const redisClient = createClient({
    password: "mapPGfa2KewrDOnW6AZejOSwHzTwrEIo",
    socket: {
      host: "redis-13248.c263.us-east-1-2.ec2.redns.redis-cloud.com",
      port: 13248,
    },
  });

// Conectar a Redis si aún no está conectado
async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

// Exportar cliente y la función de conexión
export { redisClient, connectRedis };

import { connectDB } from "@/libs/mongodb";
import { redisClient } from "@/libs/redis";
import Inventory from "../../../../../Schemas/Inventory"; // Modelo de inventario
import Report from "../../../../../Schemas/Report"; // Modelo de reportes
import Product from "../../../../../Schemas/Product"; // Modelo de reportes
import mongoose from 'mongoose';

async function ensureRedisConnection() {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }
  
  export async function GET(request, { params }) {
    try {
      await connectDB(); // Conectar a MongoDB
      await ensureRedisConnection(); // Conectar a Redis
  
      const { id } = params; // ID de la tienda
      const redisKey = `inventoryCost:${id}`; // Clave para Redis
  
      // Verificar si el reporte ya está en caché
      const cachedReport = await redisClient.get(redisKey);
      if (cachedReport) {
        console.log("Reporte de costo encontrado en caché.");
        return new Response(cachedReport, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Obtener inventario desde la base de datos
      const inventory = await Inventory.findOne({ tienda: id }).populate("productos.producto");
  
      if (!inventory) {
        return new Response(
          JSON.stringify({ message: "Inventario no encontrado para la tienda" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Calcular el costo del inventario
      let totalCost = 0;
      const reportDetails = inventory.productos.map((item) => {
        const cost = item.producto.precio * item.cantidad; // Costo por producto
        totalCost += cost; // Acumular el costo total
        return {
          producto: item.producto.nombre,
          precio: item.producto.precio,
          cantidad: item.cantidad,
          costo: cost, // Costo total de este producto
        };
      });
  
      // Crear el reporte en la base de datos
      const newReport = await Report.create({
        datos: {
          tiendaId: id,
          fecha: new Date(),
          totalCosto: totalCost, // Costo total del inventario
          detalles: reportDetails,
        },
      });
  
      // Guardar el reporte en Redis con una expiración de 1 hora
      const reportToCache = JSON.stringify(newReport);
      await redisClient.set(redisKey, reportToCache, { EX: 3600 });
  
      return new Response(reportToCache, {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al generar el reporte de costo:", error);
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

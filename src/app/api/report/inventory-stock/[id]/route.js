import { connectDB } from "@/libs/mongodb";
import { redisClient } from "@/libs/redis";
import Inventory from "../../../../../Schemas/Inventory"; // Modelo de inventario
import Report from "../../../../../Schemas/Report"; // Modelo de reportes
import Product from "../../../../../Schemas/Product"; // Modelo de reportes

async function ensureRedisConnection() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB(); // Conectar a la base de datos
    await ensureRedisConnection(); // Asegurar conexión con Redis

    const { id } = params; // ID de la tienda
    const redisKey = `inventoryReport:${id}`; // Clave para Redis

    // Verificar si el reporte ya está en Redis
    const cachedReport = await redisClient.get(redisKey);
    if (cachedReport) {
      console.log("Reporte encontrado en caché.");
      return new Response(cachedReport, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtener inventario de la tienda
    const inventory = await Inventory.findOne({ tienda: id }).populate("productos.producto");

    if (!inventory) {
      return new Response(
        JSON.stringify({ message: "Inventario no encontrado para la tienda" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Preparar datos del reporte
    const reportData = inventory.productos.map((item) => ({
      producto: item.producto.nombre,
      descripcion: item.producto.descripcion,
      precio: item.producto.precio,
      cantidad: item.cantidad,
    }));

    // Crear el reporte en la base de datos
    const newReport = await Report.create({
      datos: {
        tiendaId: id,
        fecha: new Date(),
        totalProductos: reportData.length,
        detalles: reportData,
      },
    });

    // Almacenar el reporte en Redis con una expiración de 1 hora
    const reportToCache = JSON.stringify(newReport);
    await redisClient.set(redisKey, reportToCache, { EX: 3600 });

    return new Response(reportToCache, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

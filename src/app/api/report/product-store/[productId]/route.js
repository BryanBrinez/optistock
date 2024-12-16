import { connectDB } from "@/libs/mongodb";
import Inventory from "../../../../../Schemas/Inventory"; // Modelo de inventario
import Report from "../../../../../Schemas/Report"; // Modelo de reportes
import Product from "../../../../../Schemas/Product"; // Modelo de productos
import { redisClient } from "@/libs/redis";
import mongoose from 'mongoose';

async function ensureRedisConnection() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function POST(request, { params }) {
  try {
    // Conectar a MongoDB y Redis
    await connectDB();
    await ensureRedisConnection();

    const { productId } = params; // Obtener el ID del producto desde el cuerpo de la solicitud
    const redisKey = `product_availability_report:${productId}`;

    console.log(productId);

    // Verificar si el reporte ya está en Redis
    const cachedReport = await redisClient.get(redisKey);
    if (cachedReport) {
      console.log("Reporte de disponibilidad de producto obtenido desde Redis.");
      return new Response(cachedReport, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtener el producto
    const product = await Product.findOne({ idProduct: productId });

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Producto no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener las tiendas con inventario que contengan el producto
    const inventories = await Inventory.find({ "productos.producto": product._id });

    if (!inventories || inventories.length === 0) {
      return new Response(
        JSON.stringify({ message: "El producto no está disponible en ninguna tienda" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Estructurar datos del reporte
    const reportData = inventories.map((inventory) => {
      const productInInventory = inventory.productos.find(
        (item) => item.producto.toString() === product._id.toString()
      );
      return {
        tienda: inventory.tienda,  // Se asume que la tienda tiene un campo de nombre o ID
        cantidadDisponible: productInInventory ? productInInventory.cantidad : 0,
      };
    });

    // Crear el reporte
    const newReport = await Report.create({
      datos: {
        fecha: new Date(),
        producto: product.nombre,
        productoId: product.idProduct,
        disponibilidad: reportData,
      },
    });

    // Guardar el reporte en Redis con expiración de 1 hora
    await redisClient.set(redisKey, JSON.stringify(newReport), "EX", 3600);

    return new Response(JSON.stringify(newReport), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al generar el reporte de disponibilidad de producto:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

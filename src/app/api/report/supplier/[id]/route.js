import { connectDB } from "@/libs/mongodb";
import Supplier from "../../../../../Schemas/Supplier";
import Product from "../../../../../Schemas/Product";
import Report from "../../../../../Schemas/Report";
import { redisClient } from "@/libs/redis";

async function ensureRedisConnection() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function POST() {
  try {
    // Conectar a MongoDB y Redis
    await connectDB();
    await ensureRedisConnection();

    const redisKey = "suppliers_products_report";

    // Verificar si el reporte ya está en Redis
    const cachedReport = await redisClient.get(redisKey);
    if (cachedReport) {
      console.log("Reporte de proveedores obtenido desde Redis.");
      return new Response(cachedReport, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtener todos los proveedores
    const suppliers = await Supplier.find();

    // Estructurar datos del reporte
    const reportData = await Promise.all(
      suppliers.map(async (supplier) => {
        // Obtener los detalles de los productos suministrados
        const productDetails = await Promise.all(
          supplier.productosSuministrados.map(async (product) => {
            const productInfo = await Product.findOne({ idProduct: product.idProduct });
            return {
              nombre: productInfo?.nombre || "Producto desconocido",
              descripcion: productInfo?.descripcion || "Sin descripción",
              precioCompra: product.precio,
              cantidad: product.cantidad,
              terminoEntrega: product.terminoEntrega,
            };
          })
        );

        return {
          proveedor: {
            nombre: supplier.nombre,
            direccion: supplier.direccion,
            contacto: supplier.contacto,
            condicionesPago: supplier.condicionesPago,
          },
          productos: productDetails,
        };
      })
    );

    // Crear el reporte
    const newReport = await Report.create({
      datos: {
        fecha: new Date(),
        totalProveedores: reportData.length,
        detalles: reportData,
      },
    });

    // Guardar el reporte en Redis con expiración de 1 hora
    await redisClient.set(redisKey, JSON.stringify(newReport), "EX", 3600);

    return new Response(JSON.stringify(newReport), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al generar el reporte de proveedores:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

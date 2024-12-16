import { connectDB } from "@/libs/mongodb";
import Supplier from "../../../../../Schemas/Supplier";
import Report from "../../../../../Schemas/Report";
import { redisClient } from "@/libs/redis";

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

    const { id } = params; // _id
    const redisKey = `suppliers_products_report:${id}`;

    // Verificar si el reporte ya está en Redis
    const cachedReport = await redisClient.get(redisKey);
    if (cachedReport) {
      console.log("Reporte de proveedores obtenido desde Redis.");
      return new Response(cachedReport, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch product by _id from /api/product
    const productResponse = await fetch(`/api/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id })
    });

    if (!productResponse.ok) {
      throw new Error("Error fetching product data");
    }

    const productData = await productResponse.json();
    const product = productData.find(p => p._id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    const idProduct = product.idProduct;

    // Obtener todos los proveedores que suministran el producto
    const suppliers = await Supplier.find({ "productosSuministrados.idProduct": idProduct });

    // Estructurar datos del reporte
    const reportData = suppliers.map((supplier) => {
      const productDetails = supplier.productosSuministrados
        .filter((product) => product.idProduct === idProduct)
        .map((product) => ({
          nombre: product.idProduct,
          descripcion: "Descripción no disponible",
          precioCompra: product.precio,
          cantidad: product.cantidad,
          terminoEntrega: product.terminoEntrega,
        }));

      return {
        proveedor: {
          nombre: supplier.nombre,
          direccion: supplier.direccion,
          contacto: supplier.contacto,
          condicionesPago: supplier.condicionesPago,
        },
        productos: productDetails,
      };
    });

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

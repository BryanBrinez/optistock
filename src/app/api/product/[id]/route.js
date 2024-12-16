import { connectDB } from "@/libs/mongodb";
import { redisClient } from "@/libs/redis";
import Product from "../../../../Schemas/Product";

// Obtener el producto por ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    // Acceder al parámetro dinámico 'id' de la URL
    const { id } = params;

    // Validar que el 'id' esté presente
    if (!id) {
      return new Response(
        JSON.stringify({ message: "El ID del producto es obligatorio." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Intentar obtener el producto desde Redis
    const redisKey = `product:${id}`;
    const cachedProduct = await redisClient.get(redisKey);

    if (cachedProduct) {
      // Retornar el producto desde Redis si existe
      return new Response(cachedProduct, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Si no está en Redis, consultar MongoDB
    const product = await Product.findOne({ idProduct: id }).populate(
      "proveedores.proveedor"
    );

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Producto no encontrado." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Guardar el producto en Redis para futuras consultas
    await redisClient.set(redisKey, JSON.stringify(product), {
      EX: 3600, // Expiración de 1 hora
    });

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

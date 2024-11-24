import { createClient } from "redis";
import { connectDB } from "@/libs/mongodb";
import { redisClient, connectRedis } from "@/libs/redis";
import Product from "../../../Schemas/Product";
import Supplier from "../../../Schemas/Supplier";



// Conectar Redis al iniciar
redisClient.connect().catch((err) => console.error("Error connecting to Redis", err));

export async function POST(request) {
  try {
    await connectDB();

    const productData = await request.json();

    // Buscar si el producto ya existe
    let product = await Product.findOne({ idProduct: productData.idProduct });

    if (!product) {
      // Crear un nuevo producto si no existe
      product = new Product({
        idProduct: productData.idProduct,
        nombre: productData.nombre,
        descripcion: productData.descripcion,
        precio: productData.precio,
        proveedores: productData.proveedores,
      });
    } else {
      // Actualizar el producto si ya existe
      product.nombre = productData.nombre || product.nombre;
      product.descripcion = productData.descripcion || product.descripcion;
      product.precio = productData.precio || product.precio;

      // Actualizar los proveedores
      for (let newSupplier of productData.proveedores) {
        const existingSupplier = product.proveedores.find(
          (supplier) => supplier.proveedor.toString() === newSupplier.proveedor
        );

        if (!existingSupplier) {
          product.proveedores.push(newSupplier);
        }
      }
    }

    // Guardar cambios en la base de datos
    const savedProduct = await product.save();

    // Actualizar en Redis (individual)
    const redisKey = `product:${savedProduct.idProduct}`;
    await redisClient.set(redisKey, JSON.stringify(savedProduct));

    // Invalida la clave de todos los productos en Redis
    await redisClient.del("all_products");

    return new Response(JSON.stringify(savedProduct), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}






export async function GET() {
  try {
    await connectDB();

    // Intentar obtener productos desde Redis
    const redisKey = "all_products";
    const cachedProducts = await redisClient.get(redisKey);

    if (cachedProducts) {
      // Retornar productos de Redis si existen
      return new Response(cachedProducts, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Si no están en Redis, consultar MongoDB
    const products = await Product.find().populate("proveedores.proveedor");

    // Guardar los productos en Redis
    await redisClient.set(redisKey, JSON.stringify(products), {
      EX: 3600, // Expiración de 1 hora
    });

    return new Response(JSON.stringify(products), {
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



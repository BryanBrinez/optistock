import { connectDB } from "@/libs/mongodb";
import { redisClient } from "@/libs/redis";  // Asegúrate de que estás importando tu cliente Redis
import Inventory from "../../../Schemas/Inventory";
import Product from "../../../Schemas/Product";
import Store from "../../../Schemas/Store";

export async function POST(request) {
  try {
    await connectDB();

    // Obtener los datos del inventario desde la solicitud
    const inventoryData = await request.json();

    // Validar que la tienda exista
    const store = await Store.findById(inventoryData.tienda);
    if (!store) {
      return new Response(JSON.stringify({ message: "Tienda no encontrada" }), {
        status: 404,
      });
    }

    // Intentar obtener el inventario desde Redis usando el ID de la tienda
    const redisKey = `inventory:${inventoryData.tienda}`;
    const cachedInventory = await redisClient.get(redisKey);

    let inventory;
    if (cachedInventory) {
      // Si el inventario está en caché, usarlo
      inventory = JSON.parse(cachedInventory);
    } else {
      // Si no está en caché, buscar en la base de datos
      inventory = await Inventory.findOne({ tienda: inventoryData.tienda });

      if (!inventory) {
        // Si no existe el inventario para la tienda, crearlo
        inventory = new Inventory({ tienda: inventoryData.tienda, productos: [] });
      }
    }

    // Asegurarse de que `productos` siempre sea un array
    inventory.productos = inventory.productos || [];

    // Procesar cada producto en la solicitud
    for (let item of inventoryData.productos) {
      // Verificar que el producto exista
      const product = await Product.findById(item.producto);
      if (!product) {
        return new Response(
          JSON.stringify({ message: `Producto con ID ${item.producto} no encontrado` }),
          { status: 404 }
        );
      }

      // Buscar si el producto ya existe en el inventario
      const existingProduct = inventory.productos.find(
        (p) => p.producto.toString() === item.producto
      );

      if (existingProduct) {
        // Actualizar la cantidad y la fecha de actualización
        existingProduct.cantidad += item.cantidad;
        existingProduct.fechaUltimaActualizacion = new Date();
      } else {
        // Agregar un nuevo producto al inventario
        inventory.productos.push({
          producto: item.producto,
          cantidad: item.cantidad,
          fechaLlegada: item.fechaLlegada || new Date(),
          nivelAlerta: item.nivelAlerta,
        });
      }
    }

    // Guardar los cambios en la base de datos
    const updatedInventory = await inventory.save();

    // Actualizar en Redis
    await redisClient.set(redisKey, JSON.stringify(updatedInventory), {
      EX: 3600, // Expiración de 1 hora
    });

    return new Response(JSON.stringify(updatedInventory), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Manejo de errores
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(request) {
  try {
    const storeId = request.url.split("/").pop(); // Usamos la tienda (storeId) de la URL

    // Intentar obtener el inventario de Redis
    const redisKey = `inventory:${storeId}`;
    const cachedInventory = await redisClient.get(redisKey);

    if (cachedInventory) {
      // Si los productos están en Redis, los retornamos
      return new Response(cachedInventory, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Si no están en Redis, obtenerlos de MongoDB
    await connectDB();
    const inventory = await Inventory.findOne({ tienda: storeId }).populate("productos.producto");

    if (!inventory) {
      return new Response(JSON.stringify({ message: "Inventario no encontrado" }), { status: 404 });
    }

    // Guardar el inventario en Redis para futuras consultas
    await redisClient.set(redisKey, JSON.stringify(inventory), { EX: 3600 }); // Expiración en 1 hora

    return new Response(JSON.stringify(inventory), {
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
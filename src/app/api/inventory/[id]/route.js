import { redisClient } from "@/libs/redis";
import { connectDB } from "@/libs/mongodb";
import Inventory from "../../../../Schemas/Inventory";
import Product from "../../../../Schemas/Product";
import Store from "../../../../Schemas/Store";



async function ensureRedisConnection() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function GET(request, { params }) {
  try {
    // Conectar a la base de datos y asegurarse de que Redis está conectado
    await connectDB();
    await ensureRedisConnection();

    // Obtener el ID de la tienda desde los parámetros
    const { id } = params;
    const redisKey = `inventory:${id}`; // Clave única para este inventario en Redis

    // Verificar si el inventario está en Redis
    const cachedInventory = await redisClient.get(redisKey);

    if (cachedInventory) {
      console.log("Inventario encontrado en caché");
      return new Response(cachedInventory, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const inventory = await Inventory.findOne({ tienda: id })
  .populate("productos.producto", "nombre descripcion precio"); // Poblar con campos específicos

if (!inventory) {
  return new Response(
    JSON.stringify({ message: "Inventario no encontrado para la tienda" }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}
    // Guardar el inventario en Redis con una expiración de 1 hora
    await redisClient.set(redisKey, JSON.stringify(inventory), { EX: 3600 });

    return new Response(JSON.stringify(inventory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function PUT(request, { params }) {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Asegurarse de que Redis está conectado
    await ensureRedisConnection();

    const { id } = params; // Obtener el ID de la tienda desde la URL
    const updateData = await request.json(); // Obtener los datos de actualización del cuerpo de la solicitud

    console.log("Tienda ID:", id);
    console.log("Datos de actualización:", id);

    // Buscar el inventario de la tienda
    const inventory = await Inventory.findOne({ tienda: id });
    if (!inventory) {
      return new Response(JSON.stringify({ message: "Inventario no encontrado para la tienda" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Actualizar cantidades en el inventario
    for (const updatedProduct of updateData.productos) {
      const productInInventory = inventory.productos.find(
        (item) => item.producto.toString() === updatedProduct.producto
      );

      if (productInInventory) {
        productInInventory.cantidad = updatedProduct.cantidad; // Actualizar cantidad
      } else {
        // Si el producto no existe en el inventario, agregarlo
        inventory.productos.push({
          producto: updatedProduct.producto,
          cantidad: updatedProduct.cantidad,
        });
      }
    }

    // Actualizar la fecha de última modificación
    inventory.fechaUltimaActualizacion = new Date();

    // Guardar los cambios en la base de datos
    const updatedInventory = await inventory.save();

    // Volver a cargar el inventario con las referencias llenas
    const populatedInventory = await Inventory.findById(updatedInventory._id).populate("productos.producto");

    // Actualizar en Redis
    const redisKey = `inventory:${id}`;
    await redisClient.set(redisKey, JSON.stringify(populatedInventory), "EX", 3600); // Actualizar caché con una expiración de 1 hora

    return new Response(JSON.stringify(populatedInventory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al actualizar el inventario:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

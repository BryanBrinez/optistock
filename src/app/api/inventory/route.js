import { connectDB } from "@/libs/mongodb";
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

    // Buscar el inventario de la tienda
    let inventory = await Inventory.findOne({ tienda: inventoryData.tienda });

    if (!inventory) {
      // Si no existe el inventario para la tienda, crearlo
      inventory = new Inventory({ tienda: inventoryData.tienda, productos: [] });
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

    // Guardar los cambios en el inventario
    const updatedInventory = await inventory.save();

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

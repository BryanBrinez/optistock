import { connectDB } from "@/libs/mongodb";
import Order from "../../../../Schemas/Order";
import Inventory from "../../../../Schemas/Inventory";
import Product from "../../../../Schemas/Product";
import Store from "../../../../Schemas/Store";

export async function PUT(request, { params }) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener el ID del pedido desde los parámetros de la URL
    const { id } = await params;  // Esperamos para obtener el id correctamente

    // Obtener los datos de actualización del cuerpo de la solicitud
    const updateData = await request.json();
    console.log("Pedido ID:", id);
    console.log("Datos de actualización:", updateData);

    // Buscar el pedido por ID
    const order = await Order.findById(id);
    if (!order) {
      return new Response(JSON.stringify({ message: "Pedido no encontrado" }), {
        status: 404,
      });
    }
    console.log("Pedido encontrado:", order);

    // Solo actualizar el estado, sin modificar otros campos
    if (updateData.estado) {
      order.estado = updateData.estado; // Actualizar estado (pendiente, entregado, cancelado)
    }

    // Si el estado es "cancelado", devolver la cantidad al inventario
    if (updateData.estado === "cancelado") {
      // Para cada producto del pedido, devolver la cantidad al inventario
      for (let item of order.productos) {
        const inventory = await Inventory.findOne({
          tienda: order.tienda,  // Usamos el ID de la tienda del pedido
        });

        if (inventory) {
          // Buscar el producto dentro del inventario de esa tienda
          const productInventory = inventory.productos.find(
            (product) => product.producto.toString() === item.producto.toString()
          );

          if (productInventory) {
            console.log("Producto encontrado en inventario:", productInventory);
            productInventory.cantidad += item.cantidad;  // Aumentar cantidad en inventario
            inventory.fechaUltimaActualizacion = new Date(); // Actualizar la fecha de la última modificación

            // Guardar la actualización del inventario
            await inventory.save();
            console.log(`Cantidad de ${item.producto} aumentada a ${productInventory.cantidad}`);
          } else {
            console.log(`Producto ${item.producto} no encontrado en el inventario de la tienda ${order.tienda}`);
          }
        } else {
          console.log(`Inventario no encontrado para la tienda ${order.tienda}`);
        }
      }
    }

    // Guardar los cambios en la base de datos
    const updatedOrder = await order.save();

    // Retornar la respuesta con el pedido actualizado
    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
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

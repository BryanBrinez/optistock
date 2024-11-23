import { connectDB } from "@/libs/mongodb";
import Order from "../../../../Schemas/Order";
import Inventory from "../../../../Schemas/Inventory";
import Customer from "../../../../Schemas/Customer";
import Product from "../../../../Schemas/Product";
import Store from "../../../../Schemas/Store";
import { ClientPageRoot } from "next/dist/client/components/client-page";


export async function PUT(request, {params}) {
    try {
      // Conectar a la base de datos
      await connectDB();
  
      // Obtener el ID del pedido y los datos de actualización desde la solicitud
      const { id } = params;

      console.log(id)
      const updateData = await request.json();
  
      // Buscar el pedido por ID
      const order = await Order.findById(id);
      if (!order) {
        return new Response(JSON.stringify({ message: "Pedido no encontrado" }), {
          status: 404,
        });
      }
  
      // Actualizar los campos deseados
      if (updateData.estado) {
        order.estado = updateData.estado; // Actualizar estado (pendiente, entregado, cancelado)
      }
  
      // Si es necesario, podrías agregar más campos a actualizar aquí
  
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
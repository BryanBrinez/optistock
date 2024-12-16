import { connectDB } from "@/libs/mongodb";
import Order from "../../../Schemas/Order";
import Product from "../../../Schemas/Product";
import Inventory from "../../../Schemas/Inventory";
import Return from "../../../Schemas/Return";

// export async function POST(request) {
//   try {
//     await connectDB();

//     // Obtener los datos de la devolución desde la solicitud
//     const returnData = await request.json();

//     // Validar que el pedido exista
//     const order = await Order.findById(returnData.pedido);
//     if (!order) {
//       return new Response(JSON.stringify({ message: "Pedido no encontrado" }), {
//         status: 404,
//       });
//     }

//     // Validar que el producto exista dentro del pedido
//     const orderProduct = order.productos.find(
//       (item) => item.producto.toString() === returnData.producto
//     );
//     if (!orderProduct) {
//       return new Response(
//         JSON.stringify({ message: "Producto no encontrado en el pedido" }),
//         { status: 404 }
//       );
//     }

//     // Validar cantidad de devolución
//     if (returnData.cantidad > orderProduct.cantidad) {
//       return new Response(
//         JSON.stringify({
//           message: "La cantidad a devolver excede la cantidad del pedido",
//         }),
//         { status: 400 }
//       );
//     }

//     // Buscar el inventario asociado al producto y la tienda
//     const inventory = await Inventory.findOne({
//       // producto: returnData.producto,
//       tienda: order.tienda,
//     });
//     if (!inventory) {
//       return new Response(
//         JSON.stringify({
//           message: "Inventario no encontrado para este producto",
//         }),
//         { status: 404 }
//       );
//     }

//     // Procesar la devolución según el tipo
//     let montoReembolso = null;

//     if (returnData.tipo === "reembolso") {
//       // Calcular monto de reembolso
//       montoReembolso = orderProduct.precioUnitario * returnData.cantidad;

//       // Actualizar la cantidad del producto en el pedido
//       orderProduct.cantidad -= returnData.cantidad;

//       // Si no queda cantidad del producto, eliminarlo del pedido
//       if (orderProduct.cantidad === 0) {
//         order.productos = order.productos.filter(
//           (item) => item.producto.toString() !== returnData.producto
//         );
//       }
//     } else if (returnData.tipo === "reemplazo") {
//       // Reintegrar la cantidad al inventario
//       inventory.cantidad += returnData.cantidad;
//     }

//     // Actualizar el inventario y guardar cambios
//     await inventory.save();

//     // Crear un registro de la devolución
//     const newReturn = new Return({
//       producto: returnData.producto,
//       cantidad: returnData.cantidad,
//       razon: returnData.razon,
//       tipo: returnData.tipo,
//       montoReembolso,
//       pedido: order._id,
//     });
//     await newReturn.save();

//     // Guardar cambios en el pedido
//     await order.save();

//     // Retornar la devolución registrada como respuesta
//     return new Response(JSON.stringify(newReturn), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: error.message }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

export async function POST(request) {
  try {
    await connectDB();

    // Obtener los datos de la devolución desde la solicitud
    const returnData = await request.json();
    console.log("Datos de devolución:", returnData);

    // Validar que el pedido exista
    const order = await Order.findById(returnData.pedido);
    if (!order) {
      return new Response(JSON.stringify({ message: "Pedido no encontrado" }), {
        status: 404,
      });
    }

    // Validar que el producto exista dentro del pedido
    const orderProduct = order.productos.find(
      (item) => item.producto.toString() === returnData.producto
    );
    if (!orderProduct) {
      return new Response(
        JSON.stringify({ message: "Producto no encontrado en el pedido" }),
        { status: 404 }
      );
    }

    // Validar cantidad de devolución
    if (returnData.cantidad > orderProduct.cantidad) {
      return new Response(
        JSON.stringify({
          message: "La cantidad a devolver excede la cantidad del pedido",
        }),
        { status: 400 }
      );
    }

    // Buscar el inventario asociado al producto y la tienda
    const inventory = await Inventory.findOne({
      // producto: returnData.producto,
      tienda: order.tienda,
    });
    if (!inventory) {
      return new Response(
        JSON.stringify({
          message: "Inventario no encontrado para este producto",
        }),
        { status: 404 }
      );
    }

    // Procesar la devolución según el tipo
    let montoReembolso = null;

    if (returnData.tipo === "reembolso") {
      // Calcular monto de reembolso
      const producto = await Product.findById(orderProduct.producto);
      montoReembolso = producto.precio * returnData.cantidad;

      // Actualizar la cantidad del producto en el pedido
      orderProduct.cantidad -= returnData.cantidad;

      // Si no queda cantidad del producto, eliminarlo del pedido
      if (orderProduct.cantidad === 0) {
        order.productos = order.productos.filter(
          (item) => item.producto.toString() !== returnData.producto
        );
      }
    } else if (returnData.tipo === "reemplazo") {
      // Reintegrar la cantidad al inventario
      inventory.cantidad += returnData.cantidad;
    }

    // Actualizar el inventario y guardar cambios
    await inventory.save();

    // Crear un registro de la devolución
    const newReturn = new Return({
      producto: returnData.producto,
      cantidad: returnData.cantidad,
      razon: returnData.razon,
      tipo: returnData.tipo,
      montoReembolso: montoReembolso || null, // Asegurarse de enviar un número o null
      pedido: order._id,
    });
    await newReturn.save();

    // Guardar cambios en el pedido
    await order.save();

    // Retornar la devolución registrada como respuesta
    return new Response(JSON.stringify(newReturn), {
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

    // Consultar todas las devoluciones y popular las referencias de producto y pedido
    const returns = await Return.find()
      .populate("producto", "nombre precio") // Populate para mostrar campos específicos del producto
      .populate("pedido", "productos cliente tienda"); // Populate para mostrar campos específicos del pedido

    return new Response(JSON.stringify(returns), {
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

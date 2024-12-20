import { connectDB } from "@/libs/mongodb";
import Order from "../../../Schemas/Order";
import Inventory from "../../../Schemas/Inventory";
import Customer from "../../../Schemas/Customer";
import Product from "../../../Schemas/Product";
import Store from "../../../Schemas/Store";

export async function POST(request) {
  try {
    await connectDB();
    const orderData = await request.json();

    // Verificar existencia de la tienda
    const store = await Store.findById(orderData.tienda);
    if (!store) {
      return new Response(JSON.stringify({ message: "Tienda no encontrada" }), { status: 404 });
    }

    // Verificar disponibilidad de productos
    const unavailableProducts = [];
    for (let item of orderData.productos) {
      const inventory = await Inventory.findOne({
        tienda: orderData.tienda,
        "productos.producto": item.producto, // Asegurar que busque el producto en la tienda correcta
      });

      if (inventory) {
        // Buscar el producto específico en el inventario de la tienda
        const productInInventory = inventory.productos.find(
          (p) => p.producto.toString() === item.producto.toString()
        );

        if (!productInInventory || productInInventory.cantidad < item.cantidad) {
          const product = await Product.findById(item.producto);
          unavailableProducts.push(product ? product.nombre : "Producto no encontrado");
        }
      } else {
        const product = await Product.findById(item.producto);
        unavailableProducts.push(product ? product.nombre : "Producto no encontrado");
      }
    }

    if (unavailableProducts.length > 0) {
      return new Response(
        JSON.stringify({
          message: `Los siguientes productos no están disponibles: ${unavailableProducts.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    // Crear el pedido
    const newOrder = new Order(orderData);

    // Actualizar inventario: Reducir la cantidad de los productos en inventario
    for (let item of orderData.productos) {
      const inventory = await Inventory.findOne({
        tienda: orderData.tienda,
      });

      if (inventory) {
        // Encontrar el producto en el inventario
        const productInInventory = inventory.productos.find(
          (p) => p.producto.toString() === item.producto.toString()
        );

        if (productInInventory) {
          // Reducir la cantidad del producto en inventario
          productInInventory.cantidad -= item.cantidad;
          productInInventory.fechaUltimaActualizacion = new Date();
        }

        // Guardar el inventario actualizado
        await inventory.save();
      }
    }

    // Guardar el pedido
    const savedOrder = await newOrder.save();

    return new Response(JSON.stringify(savedOrder), {
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
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los pedidos con cliente y productos poblados
    const orders = await Order.find()
      .populate("cliente", "nombre direccionEnvio") // Poblar datos del cliente
      .populate("productos.producto", "nombre precioUnitario"); // Poblar datos de cada producto

    // Retornar los pedidos como respuesta
    return new Response(JSON.stringify(orders), {
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




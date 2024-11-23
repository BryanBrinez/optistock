import { connectDB } from "@/libs/mongodb";
import Store from "../../../Schemas/Store";

export async function POST(request) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener datos del cuerpo de la solicitud
    const storeData = await request.json();

    // Crear y guardar una nueva tienda
    const newStore = new Store(storeData);
    const savedStore = await newStore.save();

    // Responder con la tienda creada
    return new Response(JSON.stringify(savedStore), {
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

export async function GET() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todas las tiendas
    const stores = await Store.find();

    // Responder con la lista de tiendas
    return new Response(JSON.stringify(stores), {
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
 
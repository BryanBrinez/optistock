import { connectDB } from "@/libs/mongodb";
import Store from "../../../../Schemas/Store";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Obtener el ID de la tienda desde los parámetros de la URL (params)
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "El ID de la tienda es obligatorio." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Buscar la tienda por ID
    const store = await Store.findById(id);

    if (!store) {
      return new Response(
        JSON.stringify({ message: "Tienda no encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Retornar la tienda encontrada
    return new Response(JSON.stringify(store), {
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

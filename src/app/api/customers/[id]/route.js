import { connectDB } from "@/libs/mongodb";
import Customer from "../../../../Schemas/Customer";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Obtener el ID del cliente desde los parámetros de la URL
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "El ID del cliente es obligatorio." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Buscar el cliente por ID
    const customer = await Customer.findById(id);

    if (!customer) {
      return new Response(
        JSON.stringify({ message: "Cliente no encontrado." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Retornar el cliente encontrado
    return new Response(JSON.stringify(customer), {
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

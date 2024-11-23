import { connectDB } from "@/libs/mongodb";
import Customer from "../../../Schemas/Customer";

export async function POST(request) {
  try {
    await connectDB();

    // Extrae los datos del cliente desde el cuerpo de la solicitud
    const customerData = await request.json();

    // Crea una nueva instancia del modelo de Cliente
    const newCustomer = new Customer(customerData);

    // Guarda el cliente en la base de datos
    const savedCustomer = await newCustomer.save();

    return new Response(JSON.stringify(savedCustomer), {
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

// Listar todos los clientes
export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find();

    return new Response(JSON.stringify(customers), {
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

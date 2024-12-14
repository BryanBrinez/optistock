import { connectDB } from "@/libs/mongodb";
import Customer from "../../../Schemas/Customer";

// Crear un nuevo cliente
export async function POST(request) {
  try {
    await connectDB();

    // Extrae los datos del cliente desde el cuerpo de la solicitud
    const customerData = await request.json();

    // Valida que los datos requeridos estén presentes
    if (!customerData.nombre) {
      return new Response(JSON.stringify({ message: "El nombre es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Obtener todos los clientes
export async function GET() {
  try {
    await connectDB();

    // Recupera todos los clientes
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

// Actualizar un cliente por ID
export async function PUT(request) {
  try {
    await connectDB();

    const { id } = await request.json();
    const updateData = await request.json();

    // Verifica que el ID esté presente
    if (!id) {
      return new Response(JSON.stringify({ message: "El ID es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Actualiza el cliente en la base de datos
    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCustomer) {
      return new Response(JSON.stringify({ message: "Cliente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedCustomer), {
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

// Eliminar un cliente por ID
export async function DELETE(request) {
  try {
    await connectDB();

    const { id } = await request.json();

    // Verifica que el ID esté presente
    if (!id) {
      return new Response(JSON.stringify({ message: "El ID es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Elimina el cliente de la base de datos
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return new Response(JSON.stringify({ message: "Cliente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(deletedCustomer), {
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
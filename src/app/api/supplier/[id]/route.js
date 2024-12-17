import { connectDB } from "@/libs/mongodb";
import Supplier from "../../../../Schemas/Supplier";

export async function GET(request,{ params }) {
  const { id } = params;  // Obtener el ID del proveedor desde los parámetros de la URL

  try {
    // Conectar a la base de datos
    await connectDB();

    // Buscar el proveedor por su ID
    const supplier = await Supplier.findById(id).populate("productosSuministrados.producto");

    if (!supplier) {
      return new Response(JSON.stringify({ message: "Proveedor no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retornar el proveedor encontrado
    return new Response(JSON.stringify(supplier), {
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


export async function PUT(request, { params}) {
  const { id } = params;  // Obtener el ID del proveedor desde los parámetros de la URL

  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener los datos que se desean actualizar desde el cuerpo de la solicitud
    const updateData = await request.json();

    // Buscar el proveedor por su ID
    const supplier = await Supplier.findByIdAndUpdate(id, updateData, { new: true });

    if (!supplier) {
      return new Response(JSON.stringify({ message: "Proveedor no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retornar el proveedor actualizado
    return new Response(JSON.stringify(supplier), {
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

export async function DELETE(request, { params}) {
  const { id } = params;  // Obtener el ID del proveedor desde los parámetros de la URL

  try {
    // Conectar a la base de datos
    await connectDB();

    // Eliminar el proveedor por su ID
    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return new Response(JSON.stringify({ message: "Proveedor no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retornar un mensaje de éxito
    return new Response(JSON.stringify({ message: "Proveedor eliminado" }), {
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
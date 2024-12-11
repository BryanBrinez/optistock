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

export async function PUT(request) {
  try {
    await connectDB();

    // Parsear los datos enviados
    const { idStore, ...updatedData } = await request.json();

    // Verificar que se envíe el ID
    if (!idStore) {
      return new Response(
        JSON.stringify({ message: "El ID de la tienda es obligatorio." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualizar la tienda en la base de datos
    const updatedStore = await Store.findOneAndUpdate(
      { idStore },
      updatedData,
      { new: true } // Devuelve la tienda actualizada
    );

    if (!updatedStore) {
      return new Response(
        JSON.stringify({ message: "Tienda no encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(updatedStore), {
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

export async function DELETE(request) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Extraer idStore de los parámetros de la consulta
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");

    if (!idStore) {
      return new Response(
        JSON.stringify({ message: "idStore es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Eliminar la tienda
    const deletedStore = await Store.findOneAndDelete({ idStore });

    if (!deletedStore) {
      return new Response(
        JSON.stringify({ message: "Tienda no encontrada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Tienda eliminada correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

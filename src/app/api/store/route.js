import { connectDB } from "@/libs/mongodb";
import Store from "../../../Schemas/Store";

export async function POST(request) {
  try {
    await connectDB();

    // Obtener datos del cuerpo de la solicitud
    const storeData = await request.json();

    // Crear y guarda una nueva tienda
    const newStore = new Store(storeData);
    const savedStore = await newStore.save();

    return new Response(JSON.stringify(savedStore), {
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

    // Obtenerlas tiendas
    const stores = await Store.find();

    // Lista rde tiendas
    return new Response(JSON.stringify(stores), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const { idStore, ...updatedData } = await request.json();

    if (!idStore) {
      return new Response(
        JSON.stringify({ message: "El ID de la tienda es obligatorio." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualiza store
    const updatedStore = await Store.findOneAndUpdate(
      { idStore },
      updatedData,
      { new: true }
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
    await connectDB();

    // Extraer id de la consulta
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");

    if (!idStore) {
      return new Response(
        JSON.stringify({ message: "idStore es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Eliminar store
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

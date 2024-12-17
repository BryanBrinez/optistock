import { connectDB } from "@/libs/mongodb";
import Supplier from "../../../Schemas/Supplier";
import Product from "../../../Schemas/Product";

export async function POST(request) {
  try {
    await connectDB();

    const supplierData = await request.json();

    if (!supplierData.identificacion) {
      return new Response(
        JSON.stringify({ message: "El proveedor no tiene una identificación válida." }),
        { status: 400 }
      );
    }

    let supplier = await Supplier.findOne({ identificacion: supplierData.identificacion });

    if (!supplier) {
      supplier = new Supplier({
        nombre: supplierData.nombre,
        direccion: supplierData.direccion,
        identificacion: supplierData.identificacion,
        contacto: supplierData.contacto,
        productosSuministrados: [],
        condicionesPago: supplierData.condicionesPago,
      });
    }

    for (const item of supplierData.productosSuministrados) {
      let product = await Product.findOne({ idProduct: item.idProduct });

      if (!product) {
        product = new Product({
          idProduct: item.idProduct,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          proveedores: [
            {
              proveedor: supplier._id,
            },
          ],
        });
        await product.save();
      }

      const existingProduct = supplier.productosSuministrados.find(
        (prod) => prod.idProduct === item.idProduct
      );

      if (!existingProduct) {
        supplier.productosSuministrados.push({
          idProduct: item.idProduct,
          precio: item.precio,
          cantidad: item.cantidad,
          terminoEntrega: item.terminoEntrega,
        });
      } else {
        existingProduct.cantidad += item.cantidad;
      }
    }

    await supplier.save();

    return new Response(JSON.stringify(supplier), {
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

    // Populate correctamente productosSuministrados
    const suppliers = await Supplier.find()
      .populate({
        path: "productosSuministrados.idProduct", // La relación con los productos
        model: "Product", // Asegúrate de que el modelo Product esté correcto
        select: "nombre precio descripcion" // Puedes seleccionar los campos que necesites
      })
      .exec();

    return new Response(JSON.stringify(suppliers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}

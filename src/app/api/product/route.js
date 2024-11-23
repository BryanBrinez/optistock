import { connectDB } from "@/libs/mongodb";
import Product from "../../../Schemas/Product";

export async function POST(request) {
  try {
    await connectDB();

    const productData = await request.json();

    // Buscar si el producto ya existe
    let product = await Product.findOne({ idProduct: productData.idProduct });

    if (!product) {
      // Crear un nuevo producto si no existe
      product = new Product({
        idProduct: productData.idProduct,
        nombre: productData.nombre,
        descripcion: productData.descripcion,
        precio: productData.precio,
        proveedores: productData.proveedores, // Lista inicial de proveedores
      });
    } else {
      // Actualizar el producto si ya existe
      product.nombre = productData.nombre || product.nombre;
      product.descripcion = productData.descripcion || product.descripcion;
      product.precio = productData.precio || product.precio;

      // Actualizar los proveedores
      for (let newSupplier of productData.proveedores) {
        const existingSupplier = product.proveedores.find(
          (supplier) => supplier.proveedor.toString() === newSupplier.proveedor
        );

        if (!existingSupplier) {
          product.proveedores.push(newSupplier);
        }
      }
    }

    // Guardar cambios en el producto
    const savedProduct = await product.save();

    return new Response(JSON.stringify(savedProduct), {
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

    const products = await Product.find().populate("proveedores.proveedor");

    return new Response(JSON.stringify(products), {
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

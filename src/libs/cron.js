import mongoose from "mongoose";
import { connectDB } from "@/libs/mongodb";
import { Collection } from "mongoose";
import Product from "../Schemas/Product";


const eliminarProductosVencidos = async () => {
    try {
  
      const fechaActual = new Date();
  
      const result = await Product.deleteMany({
        fechaCaducidad: { $lt: fechaActual },
      });
  
      console.log(`${result.deletedCount} productos vencidos eliminados.`);
    } catch (error) {console.error("Error al eliminar productos vencidos:", error);
    }
  };
  
  // Programar la tarea cada día a la medianoche
  cron.schedule("55 21 2 12 *", () => {
    console.log("Verificando productos vencidos...");
    eliminarProductosVencidos();
  });
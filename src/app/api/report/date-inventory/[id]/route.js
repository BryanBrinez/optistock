import { connectDB } from "@/libs/mongodb";
import { redisClient } from "@/libs/redis";
import Order from "../../../../../Schemas/Order"; // Modelo de órdenes
import Report from "../../../../../Schemas/Report"; // Modelo de reportes

// Asegurar conexión con Redis
async function ensureRedisConnection() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

export async function POST(request) {
    try {
        await connectDB(); // Conectar a la base de datos
        await ensureRedisConnection(); // Asegurar conexión con Redis

        const body = await request.json(); // Obtener datos de la solicitud
        const { tiendaId, fechaInicio, fechaFin } = body;

        // Validar parámetros
        if (!tiendaId || !fechaInicio || !fechaFin) {
            return new Response(JSON.stringify({ message: "Faltan parámetros necesarios" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const redisKey = `salesReport:${tiendaId}:${fechaInicio}:${fechaFin}`; // Clave única para Redis

        // Verificar si el reporte ya está en Redis
        const cachedReport = await redisClient.get(redisKey);
        if (cachedReport) {
            console.log("Reporte de ventas encontrado en caché.");
            return new Response(cachedReport, {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Convertir las fechas al formato completo en UTC
        const fechaInicioISO = new Date(`${fechaInicio}T00:00:00.000Z`);
        const fechaFinISO = new Date(`${fechaFin}T23:59:59.999Z`);

        console.log(fechaInicioISO)
        // Consulta en MongoDB
        const orders = await Order.find({
            tienda: tiendaId,
            estado: "entregado",
            fecha_pedido: { $gte: fechaInicioISO, $lte: fechaFinISO },
        }).populate("productos.producto", "nombre descripcion precio");

        if (!orders || orders.length === 0) {
            return new Response(JSON.stringify({ message: "No hay ventas en este rango de fechas." }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Estructurar el reporte
        const reportData = orders.map((order) => ({
            fecha: order.fecha_pedido,
            productos: order.productos.map((item) => ({
                nombre: item.producto.nombre,
                descripcion: item.producto.descripcion,
                precio: item.producto.precio,
                cantidad: item.cantidad,
            })),
        }));

        const newReport = await Report.create({
            datos: {
                tiendaId,
                fechaInicio: fechaInicioISO,
                fechaFin: fechaFinISO,
                totalVentas: reportData.length,
                detalles: reportData,
            },
        });

        return new Response(JSON.stringify(newReport), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error al generar el reporte de ventas:", error);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

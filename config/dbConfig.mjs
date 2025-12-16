import mongoose from "mongoose"; // Importamos la librería de Mongoose

// Función asíncrona para iniciar la conexión
export const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI; // Busca la dirección en el archivo .env

    // Si no encuentra la URL, lanza un error manual
    if (!url) {
        throw new Error("❌ La variable MONGO_URI no está definida en el archivo .env");
    }

    await mongoose.connect(url); // Intenta conectar (espera la respuesta)
    console.log("✅ Conectado exitosamente a MongoDB Atlas");

  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
    process.exit(1); // Cierra la aplicación si falla la conexión (es crítico)
  }
};
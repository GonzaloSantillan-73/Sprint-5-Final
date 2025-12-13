import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;
    if (!url) {
        throw new Error("❌ La variable MONGO_URI no está definida en el archivo .env");
    }

    await mongoose.connect(url);
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
};
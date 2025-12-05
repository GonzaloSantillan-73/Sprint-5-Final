import mongoose from "mongoose"

export async function connectDB(){
  try{
    await mongoose.connect("mongodb+srv://lsantillangonzalo73_db_user:xdWOythobVKMdAaX@sprint5paisesamerica.zgk331b.mongodb.net/")
    console.log("Conexion exitosa a MongoDB")
  }
  catch(error){
    console.error("Error al conectar a MongoDB: ",error)
    process.exit(1)
  }
}
// 1. IMPORTACIONES
import 'dotenv/config'
import express from "express"
import { connectDB } from "./config/dbConfig.mjs"
import paisesRoutes from "./routes/paisesRoutes.mjs"
import path from "path"
import { fileURLToPath } from 'url';
import expressLayouts from "express-ejs-layouts"
import morgan from "morgan" // Librería para logs (ver peticiones en consola)
import methodOverride from 'method-override'

// 2. CONFIGURACIÓN INICIAL
const app = express()
const PORT = process.env.PORT || 8080

// Truco para obtener __dirname en módulos ES6 (necesario para las rutas de carpetas)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. MOTORES DE VISTA (Frontend)
app.set("view engine", "ejs")       // Le decimos a Express que usaremos EJS
app.use(expressLayouts)             // Activamos el sistema de plantillas base (layouts)
app.set("layout", "layout")         // Definimos que el archivo base se llama 'layout.ejs'
app.set('views', path.join(__dirname, 'views')); // Indicamos dónde está la carpeta 'views'

// 4. ARCHIVOS ESTÁTICOS
// Permite que el navegador acceda a tu CSS, imágenes y scripts públicos
app.use(express.static(path.resolve(__dirname, 'public')))

// 5. BASE DE DATOS
connectDB() // Iniciamos la conexión a MongoDB

// 6. MIDDLEWARES (Procesamiento intermedio)
// Permiten leer datos JSON y datos de formularios (req.body)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Activa Morgan: Muestra en la consola info de colores sobre cada petición (GET, POST, etc.)
app.use(morgan('dev'));

// Activa Method-Override: Busca "?_method=DELETE" en la URL y transforma la petición
app.use(methodOverride('_method'));

// 7. RUTAS
// Todas las rutas que empiecen con "/" se manejan en paisesRoutes
app.use("/", paisesRoutes)

// 8. MANEJO DE ERRORES (404)
// Si llega aquí, es que ninguna ruta anterior coincidió
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" })
})

// 9. ARRANQUE DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`\n============================================`)
  console.log(`🚀 Servidor levantado exitosamente`)
  console.log(`👉 Accede aquí: http://localhost:${PORT}`)
  console.log(`============================================\n`)
});
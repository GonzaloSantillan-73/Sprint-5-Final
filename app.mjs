import express from "express"
import { connectDB } from "./config/dbConfig.mjs"
import paisesRoutes from "./routes/paisesRoutes.mjs"
import path from "path"
import { fileURLToPath } from 'url';
import expressLayouts from "express-ejs-layouts"

const app = express()
const PORT = process.env.PORT || 8080

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de EJS y layouts
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layout")

// Configurar vistas
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.resolve(__dirname, 'public')))

connectDB()

// Middlewares de Express para parsear datos
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Middleware de registro de peticiones
const loggerMiddleware = (req, res, next) => {
  console.log(`\nRequest received: ${req.method} ${req.url}`)
  next();
}
app.use(loggerMiddleware);

app.use("/", paisesRoutes)

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" })
})

app.listen(PORT, '0.0.0.0', () => {
console.log(`\n============================================`)
  console.log(`🚀 Servidor levantado exitosamente`)
  console.log(`👉 Accede aquí: http://localhost:${PORT}`)
  console.log(`============================================\n`)
});
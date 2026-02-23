import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// Importacion de las rutas
import marcaRouter from "./routes/marca.routes";
import unidadMedidaRouter from "./routes/unidadesM.routes";
import usuarioRouter from "./routes/usuario.routes";

dotenv.config();
const PORT = process.env.PORT || 3006;
const app = express();

app.use(cors());

app.use(express.json());

// Rutas
app.use("/api", marcaRouter);
app.use("/api", unidadMedidaRouter);
app.use("/api", usuarioRouter);

app.listen(PORT, () => {
  console.log(
    `Servidor en el Puerto: ${PORT} Consultas: http://localhost:${PORT}`
  );
});

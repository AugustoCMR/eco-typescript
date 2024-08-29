require("dotenv").config();

import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";

import customerRoutes from "./routes/customerRoutes";
import residueRoutes from "./routes/residueRoutes";
import materialRoutes from "./routes/materialRoutes";
import productRoutes from "./routes/productRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { error } from "./middlewares/errorMiddleware";


const app = express();
app.use(express.json());

app.use("/customers", customerRoutes);

app.use(authMiddleware);

app.use("/residues", residueRoutes);
app.use("/materials", materialRoutes);
app.use("/products", productRoutes);

app.use(error);

app.listen(process.env.PORT, () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
    })
    .catch((error) => console.log(error));
  console.log(`Server running on port 3000`);
});

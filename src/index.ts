require("dotenv").config();

import "reflect-metadata"
import { AppDataSource } from "./data-source";
import express from 'express';


const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
		AppDataSource.initialize()
		  .then(() => {
		    console.log('Conexão com o banco de dados estabelecida com sucesso!')
		  })
		  .catch((error) => console.log(error))
    console.log(`Server running on port 3000`);
});
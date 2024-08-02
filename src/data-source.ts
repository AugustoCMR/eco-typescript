import { DataSource } from "typeorm";
import { Customer } from "./models/customerModel";
import { Residue } from "./models/residueModel";

export const AppDataSource = new DataSource({
  type: process.env.DB as any,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [Customer, Residue],
  subscribers: [],
  migrations: [],
});

import { Sequelize } from "sequelize";

const sequelize = new Sequelize("project2", "root", "Password123#@!", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Disable logging for cleaner console output
});

export default sequelize;

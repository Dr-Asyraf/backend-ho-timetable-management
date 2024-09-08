import pg from "pg";
import dotenv from "dotenv";
import createUsersTable from "../models/user.js";
import createWardsTable from "../models/ward.js";
import createShiftsTable from "../models/shift.js";
import createWardAssignmentsTable from "../models/ward-assignment.js";

const { Pool } = pg;

dotenv.config();

const database = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === "true",
});

async function testConnectionAndLog() {
  try {
    await database.connect();
    const queryTime = await database.query("SELECT NOW()");
    const databaseName = await database.query("SELECT current_database()");
    const currentTime = queryTime.rows[0].now;
    const currentDatabase = databaseName.rows[0].current_database;
    console.log(`Connected to ${currentDatabase} at ${currentTime}`);
    await createUsersTable();
    await createWardsTable();
    await createShiftsTable();
    await createWardAssignmentsTable();
  } catch (err) {
    console.error("Error connecting to database", err);
  }
}

testConnectionAndLog();

export default database;

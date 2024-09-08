import database from "../database/connection.js";

const createNewWardSQL = `
CREATE TABLE IF NOT EXISTS wards (
    ward_id SERIAL PRIMARY KEY,
    ward_name VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`;

async function createWardsTable() {
  try {
    await database.query(createNewWardSQL);
    console.log("Wards table created");
  } catch (error) {
    return console.log("Error creating wards table", error);
  }
}

export default createWardsTable;

import database from "../database/connection.js";

const createNewUserSQL = `
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    join_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`;

async function createUsersTable() {
  try {
    await database.query(createNewUserSQL);
    console.log("Users table created");
  } catch (error) {
    return console.log("Error creating users table", error);
  }
}

export default createUsersTable;

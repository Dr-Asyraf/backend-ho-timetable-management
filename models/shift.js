import database from "../database/connection.js";

const createNewShiftSQL = `
CREATE TABLE IF NOT EXISTS shifts (
    shift_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    ward_id INT REFERENCES wards(ward_id),
    shift_type VARCHAR(50),
    date DATE,
    is_absent BOOLEAN DEFAULT FALSE,
    replacement_user_id INT REFERENCES users(user_id),
    is_tagging BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`;

async function createShiftsTable() {
  try {
    await database.query(createNewShiftSQL);
    console.log("Shifts table created");
  } catch (error) {
    return console.log("Error creating shifts table", error);
  }
}

export default createShiftsTable;

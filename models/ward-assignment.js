import database from "../database/connection.js";

const createNewWardAssignmentSQL = `
CREATE TABLE IF NOT EXISTS ward_assignments (
    assignment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    ward_id INT REFERENCES wards(ward_id),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`;

async function createWardAssignmentsTable() {
  try {
    await database.query(createNewWardAssignmentSQL);
    console.log("Ward Assignments table created");
  } catch (error) {
    return console.log("Error creating ward assignments table", error);
  }
}

export default createWardAssignmentsTable;

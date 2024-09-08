import database from "../../database/connection.js";

// Function to suggest a replacement HO
async function suggestReplacement(shiftId) {
  // 1. Get the details of the shift where HO is absent
  const shift = await database.query(
    "SELECT * FROM shifts WHERE shift_id = $1",
    [shiftId]
  );
  const { date, ward_id, shift_type } = shift.rows[0];

  // 2. Find a list of HOs who are available on the same day
  const availableHOs = await database.query(
    `SELECT s.user_id, u.username FROM shifts s JOIN users u ON s.user_id = u.user_id WHERE s.date = $1 AND s.ward_id = $2 AND s.shift_type != $3 AND s.is_absent = FALSE`,
    [date, ward_id, shift_type]
  );

  // Return a suggestion
  return availableHOs.rows.length > 0 ? availableHOs.rows[0] : null;
}

export default suggestReplacement;

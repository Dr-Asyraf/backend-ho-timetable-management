import database from "../../database/connection.js";

async function getAllShifts(req, res) {
  const { username } = req.params; // Extract the username from the URL
  try {
    // Find the HO by their username
    const ho = await database.query(
      "SELECT user_id FROM users WHERE username = $1 AND role = $2",
      [username, "HO"]
    );
    if (ho.rows.length === 0) {
      return res.status(404).json({ message: "HO not found" });
    }

    const hoId = ho.rows[0].user_id;

    // Get all shifts for the found HO (user_id)
    const shifts = await database.query(
      `SELECT s.shift_id, s.user_id, s.ward_id, s.shift_type, s.date, s.is_absent, s.replacement_user_id, w.ward_name
          FROM shifts s
          JOIN wards w ON s.ward_id = w.ward_id
          WHERE s.user_id = $1
          ORDER BY s.date ASC`,
      [hoId]
    );

    res.json(shifts.rows); // Return the list of shifts
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export default getAllShifts;

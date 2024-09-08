import database from "../../database/connection.js";

async function getShifts(req, res) {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the JWT token
    const { startOfWeek, endOfWeek } = getCurrentWeekRange();

    // Query to get all shifts for the current week for the logged-in user
    const shifts = await database.query(
      "SELECT s.shift_id, s.user_id, s.ward_id, s.shift_type, s.date, s.is_absent, s.replacement_user_id, w.ward_name FROM shifts s JOIN wards w ON s.ward_id = w.ward_id WHERE s.user_id = $1 AND s.date BETWEEN $2 AND $3 ORDER BY s.date ASC",
      [userId, startOfWeek, endOfWeek]
    );

    return res.json(shifts.rows); // Send the list of shifts to the frontend
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

// function getCurrentWeekRange() {
//   const today = new Date();

//   const startOfWeek = today.toISOString().split("T")[0]; // Today in YYYY-MM-DD format
//   const endOfWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // Add 7 days
//     .toISOString()
//     .split("T")[0];

//   return { startOfWeek, endOfWeek };
// }

//Initial Code
function getCurrentWeekRange() {
  const today = new Date();
  const first = today.getDate() - today.getDay(); // Get the first day of the week (Sunday)
  const last = first + 6; // Get the last day of the week (Saturday)

  const startOfWeek = new Date(today.setDate(first))
    .toISOString()
    .split("T")[0]; // Format as YYYY-MM-DD
  const endOfWeek = new Date(today.setDate(last)).toISOString().split("T")[0];

  return { startOfWeek, endOfWeek };
}

export default getShifts;

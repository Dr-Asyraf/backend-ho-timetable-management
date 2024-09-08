import database from "../../database/connection.js";

async function deleteShift(req, res) {
  try {
    const { shiftId } = req.params;
    // Check if the shift exists
    const shift = await database.query(
      "SELECT * FROM shifts WHERE shift_id = $1",
      [shiftId]
    );
    if (shift.rows.length === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    // Delete the shift from the database
    await database.query("DELETE FROM shifts WHERE shift_id = $1", [shiftId]);

    return res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

export default deleteShift;

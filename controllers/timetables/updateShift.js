import database from "../../database/connection.js";

async function updateShift(req, res) {
  const { shiftId } = req.params;
  const { newShiftType, newDate, newWardId } = req.body; // Expect new shift data from the frontend
  try {
    // Check if the shift exists
    const shift = await database.query(
      "SELECT * FROM shifts WHERE shift_id = $1",
      [shiftId]
    );
    if (shift.rows.length === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    // Update the shift with the new details
    await database.query(
      "UPDATE shifts SET shift_type = $1, date = $2, ward_id = $3 WHERE shift_id = $4",
      [newShiftType, newDate, newWardId, shiftId]
    );

    res.json({ message: "Shift updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export default updateShift;

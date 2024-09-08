import database from "../../database/connection.js";
import suggestReplacement from "./suggestReplacement.js";

async function markAbsent(req, res) {
  try {
    const { shiftId, reason } = req.body;
    // 1. Mark the HO as absent for the shift
    await database.query(
      "UPDATE shifts SET is_absent = $1 WHERE shift_id = $2",
      [true, shiftId]
    );

    // 2. Suggest a replacement for the shift
    const replacement = await suggestReplacement(shiftId);
    res.json({ message: "HO marked absent", replacement });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export default markAbsent;

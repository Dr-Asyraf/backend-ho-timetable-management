import database from "../../database/connection.js";

async function confirmReplacement(req, res) {
  try {
    const { shiftId, replacementUserId } = req.body;
    // Update the shift with the chosen replacement HO
    await database.query(
      "UPDATE shifts SET replacement_user_id = $1 WHERE shift_id = $2",
      [replacementUserId, shiftId]
    );

    res.json({ message: "Replacement confirmed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export default confirmReplacement;

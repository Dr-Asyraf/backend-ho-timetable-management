import Timetable from "./timetable.js";

async function createTimetable(req, res) {
  try {
    const { weekStart, weekEnd } = req.body; // Frontend sends weekStart and weekEnd
    const result = await Timetable.generateTimetable(weekStart, weekEnd); // Call the function to generate shifts
    res.json(result); // Return a response to the client (frontend)
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export default createTimetable;

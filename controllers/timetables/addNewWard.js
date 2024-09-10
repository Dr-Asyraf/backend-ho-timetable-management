import database from "../../database/connection.js";

async function addNewWard(req, res) {
  try {
    const { wardName } = req.body;
    await database.query("INSERT INTO wards (ward_name) VALUES ($1)", [
      wardName,
    ]);
    res.json({ message: "Ward added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
}

export default addNewWard;

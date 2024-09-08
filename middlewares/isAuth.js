import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import database from "../database/connection.js";
dotenv.config();

async function isAuth(req, res, next) {
  const headers = req.headers;
  const token = headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // check if user is valid in the database
    const query = `
      SELECT * FROM users WHERE user_id = $1 AND username = $2 AND role = $3
      `;
    const resDb = await database.query(query, [
      decoded.id,
      decoded.username,
      decoded.role,
    ]);

    if (resDb.rows.length === 0) {
      // error message must be very generic to avoid leaking information
      return res.status(401).json({ message: "Unauthorized" });
    }
    // IMPORTANT: reassign req.user to the decoded token
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default isAuth;

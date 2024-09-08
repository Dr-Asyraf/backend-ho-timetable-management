import database from "../database/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function registerUser(req, res) {
  const insertUserSQL =
    "INSERT INTO users (username, password, role, join_date) VALUES ($1, $2, $3, $4) RETURNING user_id";
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const joinDate = req.body.join_date;

  // Check all fields are present
  if (!username || !password || !role || !joinDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // convert password to hash using bcryptjs
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // after all the data are valid then insert user into database
  // store the hashed password in the database
  try {
    const resDb = await database.query(insertUserSQL, [
      username,
      hashedPassword,
      role,
      joinDate,
    ]);
    const userId = resDb.rows[0].user_id;
    const resData = {
      message: "User registered successfully",
      data: {
        userId: userId,
        username: username,
        role: role,
      },
    };
    return res.status(201).json(resData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function loginUser(req, res) {
  const selectUserSQL = "SELECT * FROM users WHERE username = $1";
  const username = req.body.username;
  const password = req.body.password;

  // Check all fields are present
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // get user from database using email
  try {
    const resDb = await database.query(selectUserSQL, [username]);
    if (resDb.rows.length === 0) {
      // we want to keep the error message generic and not give away any information for security purposes
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = resDb.rows[0];
    const dbPassword = user.password;

    // compare the password with the hashed password in the database
    const isPasswordMatch = bcrypt.compareSync(password, dbPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // create a jwt token and send it to the user
    // tokenData not include password or any sensitive information
    // this is an encoded token which can be decoded by anyone
    const tokenData = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET);

    const resData = {
      message: "Login successful",
      token: token,
    };
    return res.status(200).json(resData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const authController = {
  registerUser,
  loginUser,
};

export default authController;

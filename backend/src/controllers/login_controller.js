// This is the controller for the users route for Login and Register
// It defines the logic for the routes
import { db } from "../db.js";


// Login a user
export const login = async (req, res) => {
  const data = req.body;
  const { user_id, password } = data;
  const query = `SELECT * FROM users WHERE user_id = $1 AND password_hash = $2`;
  const values = [user_id, password];
  const result = await db.query(query, values);
    if (err) {
      res.status(500);
      res.json({
        success:false,
        message :"You've entered the wrong user id or password."
      })
    }
    res.status(200).send("User logged in successfully");
    res.json({
      success: true,
      message: "User logged in successfully",
      data: result.rows[0],
    });
};

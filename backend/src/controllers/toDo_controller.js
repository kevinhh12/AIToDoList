import { db } from "../db.js";

export const createToDo = async (req, res) => {
  try {
    const { username, title, is_completed = false, color, todo } = req.body;
    const query = `
      INSERT INTO tdl (username, title, is_completed, created_at, color, todo)
      VALUES ($1, $2, $3, NOW(), $4, $5)
      RETURNING *;
    `;
    const values = [
      username,
      title,
      is_completed,
      color,
      JSON.stringify(todo), // todo should be an array of objects
    ];
    const result = await db.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error inserting tdl: ${error}`);
    res.status(500).send(error);
  }
};

export const getAllToDos = async (req, res) => {
  try {
    const { username } = req.params; 
    const query = `SELECT * FROM tdl WHERE username = $1 ORDER BY created_at DESC;`;
    const result = await db.query(query, [username]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting todos:", error);
    res.status(500).send(error);
  }
};

export const updateToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_completed, color, todo } = req.body;
    const query = `
      UPDATE tdl
      SET title = $1, is_completed = $2, color = $3, todo = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [
      title,
      is_completed,
      color,
      JSON.stringify(todo), // todo should be an array of objects
      id,
    ];
    const result = await db.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send(error);
  }
};

export const deleteToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM tdl WHERE id = $1;`;
    await db.query(query, [id]);
    res.status(200).send("ToDo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send(error);
  }
};



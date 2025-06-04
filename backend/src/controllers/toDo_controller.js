import { db } from "../db";

export const createToDo = async (req,res)=>{
    
    try {
        const {user_id, tile, description, due_date} = req.body; 
        const values = [user_id, tile, description, due_date]
        const query = `
            INSERT INTO tdl
            (user_id, title, description, due_date) VALUE ($1, $2, $3, $4);
        `
        await db.query(query,values);
        res.status(200).send('successfully inserted tdl')


    } catch (error) {
        console.log(`error in inserting the tdl: ${error}`)
        res.status(500).send(error);
    }
}

export const getAllToDos = async (req, res) => {
    try {
      const { user_id } = req.params; // or req.query if sent as query param
      const query = `SELECT * FROM tdl WHERE user_id = $1 ORDER BY created_at DESC;`;
      const result = await db.query(query, [user_id]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error getting todos:", error);
      res.status(500).send(error);
    }
  };

  export const updateToDo = async (req, res) => {
    try {
      const { id } = req.params; // ToDo item id
      const { title, description, is_completed } = req.body;
      const query = `
        UPDATE tdl 
        SET title = $1, description = $2, is_completed = $3
        WHERE id = $4;
      `;
      await db.query(query, [title, description, is_completed, id]);
      res.status(200).send("ToDo updated successfully");
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



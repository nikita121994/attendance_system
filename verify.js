const express = require('express');
const connection = require('./db_connection');
const app = express();

app.get('/employee/:emp_id', (req, res) => {
  const emp_id = req.params.emp_id;
  
  const query = `SELECT * FROM emp_details WHERE emp_id = ?`;
  
  connection.query(query, [emp_id], (error, result) => {
    if (error) {
      res.status(500).send({ error });
    } else {
      if (result.length > 0) {
        res.send({ exists: true,  message: 'Employee exists' });
      } else {
        res.send({ exists: false, message: 'Employee does not exist' });
      }
    }
  });
});

module.exports = app;


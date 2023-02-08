// const mysql = require('mysql2');

// // create connection with mysql
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'employee_schema'
// });

// connection.connect();
// const data = { emp_id: "E1001", is_training_completed: 1 };
//     const query = `INSERT INTO training_details(emp_id, is_training_completed) VALUES (?, ?)`;
//     connection.execute(query, [data.emp_id, data.is_training_completed], (error, result) => {
//         if (error) {
//             console.log(error);
//         } else {
//           console.log(result);
//         }
//     });

// module.exports = connection;


const mysql = require('mysql2');

// create connection with mysql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_schema'
});

connection.connect();


module.exports = connection;

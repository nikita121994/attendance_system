const express = require('express');
const request = require("request");
const crypto = require('crypto');
const connection = require('./db_connection');
const verify = require('./verify');
const fs = require("fs");

const app = express();
// app.use(express.json({ limit: '50mb' }));
app.use("/", verify);

//to parse json object
const bodyParser = require("body-parser");
app.use(bodyParser.json( {limit: '50mb' }));

app.post('/upload/', (req, res)=>{
    const images = req.body.images;
    const emp_id = req.body.emp_id;

    request(`http://localhost:3000/employee/${emp_id}`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const employee = JSON.parse(body);
            if (employee.exists) {
                var folderName = `uploads/${emp_id}`;
                fs.mkdir(folderName, { recursive: true }, (error) => {
                    if (error) {
                        res.send(error);
                    } else {
                        // Store the pictures in the folder
                        let imgArr = Object.values(images);
                        Promise.all(imgArr.map(async (image) => {
                            // Remove header
                            let base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                            let imageData = Buffer.from(base64Data, "base64");
                            let randomName = crypto.randomBytes(20).toString('hex');
                            await fs.promises.writeFile(`${folderName}/${randomName}.png`, imageData)
                            .then(() => {
                                // res.send(`Image ${randomName}.png saved.`);                                
                            })
                            .catch((error) => {
                                res.send(error);
                            });
                        }))
                        .then(() => {                            
                            const data = { emp_id: emp_id, is_training_completed: true };
                            const query = `INSERT INTO training_details(emp_id, is_training_completed) 
                                        SELECT ?, ? FROM DUAL WHERE NOT EXISTS 
                                        (SELECT * FROM training_details WHERE emp_id = ?) LIMIT 1`;
                            connection.execute(query, [data.emp_id, data.is_training_completed, data.emp_id], (error, result) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(result);
                                }
                            });
                            res.send("Upload successful");
                        })
                        .catch((error) => {
                            res.send(error);
                        });
                    }
                });
            } else {
                res.send("Employee does not exist");
            }
        } else {
            res.send("Error verifying employee");
        }
    });    
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

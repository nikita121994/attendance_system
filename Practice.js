const express = require('express');
const request = require("request");
const crypto = require('crypto');
const verify = require('./verify');
var fs = require("fs");

const app = express();
app.use("/", verify);

//to parse json object
const bodyParser = require("body-parser");
app.use(bodyParser.json());
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
                        res.send(imgArr);
                        imgArr.forEach(image => {
                            // Remove header
                            let base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                            let imageData = Buffer.from(base64Data, "base64");
                            let randomName = crypto.randomBytes(20).toString('hex');
                            fs.writeFileSync(`${folderName}/${randomName}.png`, imageData, function (error) {
                                if (error) {
                                    res.send(error);
                                } else {
                                    res.send(`Image ${image.originalname} saved.`);
                                }
                            });
                        });
                        res.send("Upload successful");
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
  
// request(`http://localhost:3000/employee/${emp_id}`, function (error, response, body) {
//         if (!error && response.statusCode === 200) {
//             const employee = JSON.parse(body);
//             if (employee.exists) {
//                 const folderName = `uploads/${emp_id}`;
//                 fs.mkdir(folderName, { recursive: true }, (error) => {
//                     if (error) {
//                         res.send(error);
//                     } else {
//                         // Store the pictures in the folder
//                         let imgArr = Object.values(images);
//                         let processed = 0;
//                         imgArr.forEach(image => {
//                              // Remove header
//                             let base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//                             let imageData  = Buffer.from(base64Data, "base64");
//                             let randomName = crypto.randomBytes(20).toString('hex');
//                             fs.writeFile(`${folderName}/${randomName}.png`, imageData, function (error) {
//                                 processed++;
//                                 if (error) {
//                                     res.send(error);
//                                 } else if (processed === imgArr.length) {
//                                     res.send("Upload successful");
//                                 }
//                             });
//                         });
//                     }
//                 });
//             } else {
//                 res.send("Employee does not exist");
//             }
//         } else {
//             res.send("Error verifying employee");
//         }
//     });



// Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });
// Newsletter-signup page
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
    console.log("Connected");
})

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us14.api.mailchimp.com/3.0/lists/ad191c2a6f';

    const options = {
        method: "POST",
        auth: "JAGG1:847b1904d9a8bf3952e3717a097714f8-us14"
    };

    const request = https.request(url, options, (response) => {

        const resStatus = response.statusCode;
        console.log("resStatus " + resStatus);

        if (resStatus === 200) {
            // res.send(__dirname + "/success.html");
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.post("/success", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || port, () => {
    console, console.log("Mail server running on port " + port);
})

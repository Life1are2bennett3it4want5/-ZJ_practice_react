import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const app = express()

app.use(bodyParser.urlencoded());

app.get("/Workout-Complete", async (req,res) => {
    res.statusCode=200;
    res.setHeader("Content-Type", "text/html");
    try{
        await client.connect();
        const myDB = client.db("pracZJ");
        const myCollection = myDB.collection("ZJL");

        await myCollection.insertOne({
            workoutDuration: req.query.duration
        });
    } finally {
        await client.close();
    }
    res.end("<h1>Your workout took" + req.query.duration + "!</h1>")
})
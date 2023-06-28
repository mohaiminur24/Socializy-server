const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB server is start from here
const uri = `mongodb+srv://${process.env.SERVER_USERNAME}:${process.env.SERVER_PASSWORD}@cluster0.85env82.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("Socializy");
    const datapost = database.collection("post");

    // get all post route is here
    app.get("/getallpost", async (req, res) => {
      try {
        const result = await datapost.find().toArray();
        res.send(result);
      } catch (error) {
        console.log("get all post route is not wokring!");
      }
    });

    // new post route is here
    app.post("/postdatainsert", async (req, res) => {
      try {
        const data = req.body;
        const result = await datapost.insertOne(data);
        res.send(result);
      } catch (error) {
        console.log("new user post route is not working!");
      }
    });

    // handle like button route is here
    app.patch('/handlepostlikebutton',async(req,res)=>{
      try {
        const info = req.body;
        const query = {_id: new ObjectId(info.postid)};
        const update = {
            $addToSet:{
              likes: info.email
            }
        };
        const result = await datapost.updateOne(query,update);
        res.send(result);

      } catch (error) {
        console.log('post insert like button route is not working!')
      }
    });

    // handle unlike post button
    app.delete('/unlikepostbutton', async(req,res)=>{
      try {
        const info = req.body;
        const query = {_id: new ObjectId(info.postid)};
        const deleted = {
          $pull:{
            likes: info.email
          }
        }
        const result =await datapost.updateOne(query,deleted);
        res.send(result);
      } catch (error) {
        console.log('post unlike button is not working!')
      }
    })








  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Default Home route is here
app.get("/", (req, res) => {
  res.send("Socializy server is running well!");
});

app.listen(PORT, () => {
  console.log(`Socializy server is running with ${PORT}`);
});

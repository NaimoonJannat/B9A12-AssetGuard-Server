const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// middleware 
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
  }));
  app.use(express.json())

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ywizof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();

     const database = client.db('assetGuardDb');
     const assetCollection = database.collection("assetCollection");

       // to send assets backend 
    app.post('/assets', async (req, res) => {
        const newAsset = req.body;
        console.log(newAsset);
        const result = await assetCollection.insertOne(newAsset);
        res.send(result);
      })

     
    app.get('/assets', async (req, res) => {
        const cursor = assetCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })


        // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
      //   await client.close();
      }

    }

    run().catch(console.log);
  app.get('/', (req, res) => {
    res.send('All Assets are Guarded and Server is Running')
  })
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
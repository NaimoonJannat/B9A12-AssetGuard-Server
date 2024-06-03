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
     const hrCollection = database.collection("hrCollection");
     const employeeCollection = database.collection("employeeCollection");
     const usersCollection = database.collection("usersCollection");
     const teamCollection = database.collection("teamCollection");

    //  to delete employees data after team selection 
       app.delete('/employees/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await employeeCollection.deleteOne(query);
        res.send(result);
      })

      // to add employees data to teamCollection after adding them 
    app.post('/teams', async (req, res) => {
      const newMember = req.body;
      console.log(newMember);
      const result = await teamCollection.insertOne(newMember);
      res.send(result);
    })

   
  app.get('/teams', async (req, res) => {
      const cursor = teamCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

     //  to delete employees data from team after removing it
     app.delete('/teams/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await teamCollection.deleteOne(query);
      res.send(result);
    })

    // to add employees data to employeeCollection after removing them 
  app.post('/employees', async (req, res) => {
    const newMember = req.body;
    console.log(newMember);
    const result = await employeeCollection.insertOne(newMember);
    res.send(result);
  })

        // to send users backend 
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    })

   
  app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

        // to send hrs backend 
    app.post('/hrs', async (req, res) => {
      const newHR = req.body;
      console.log(newHR);
      const result = await hrCollection.insertOne(newHR);
      res.send(result);
    })

   
  app.get('/hrs', async (req, res) => {
      const cursor = hrCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

        // to send employees backend 
    app.post('/employees', async (req, res) => {
      const newEmployee = req.body;
      console.log(newEmployee);
      const result = await employeeCollection.insertOne(newEmployee);
      res.send(result);
    })

   
  app.get('/employees', async (req, res) => {
      const cursor = employeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

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

      // delete an asset
      app.delete('/assets/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await assetCollection.deleteOne(query);
        res.send(result);
      })

    // to update cards 
    app.get('/assets/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await assetCollection.findOne(query);
        res.send(result);
      })
  
      app.put('/assets/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updatedAsset = req.body;
        const asset = {
          $set: {
            product: updatedAsset.product,
            quantity: updatedAsset.quantity,
            type: updatedAsset.type,
          }
        }
        const result = await assetCollection.updateOne(filter, asset);
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
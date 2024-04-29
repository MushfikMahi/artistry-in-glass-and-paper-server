const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middlewere

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Artistry server is running')
})

app.listen(port, ()=>{
    console.log(`Artistry server is running on port : ${port}`);
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.04rw29h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const craftsCollection = client.db('craftsDB').collection('crafts')
    const craftsCategoryCollection = client.db('craftsDB').collection('subcategory')

    app.get('/crafts', async(req, res)=>{
        const cursor = craftsCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/crafts/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id)}
      const crafts = await craftsCollection.findOne(query)
      res.send(crafts)
    })

    app.get('/mycrafts/:email', async(req, res)=>{
      console.log(req.params.email);
      const result = await craftsCollection.find({userEmail: req.params.email}).toArray();
      res.send(result)
    })

    app.get('/update/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id)}
      const find = await craftsCollection.findOne(query)
      res.send(find)
    })
    app.get('/subcategory', async(req, res)=>{
      const cursor = craftsCategoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.put('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const option = { upsert: true }
      const craft = req.body;
      const updatedCraft = {
        $set:{
          photo: craft.photo,
          name: craft.name,
          subcategory:craft.subcategory,
          time:craft.time,
          price:craft.price,
          rating:craft.rating,
          customization:craft.customization,
          stockStatus:craft.stockStatus,
          description:craft.description
        }
      }
      const update = await craftsCollection.updateOne(filter, updatedCraft, option)
      res.send(update)
    })

    app.post('/crafts', async(req, res)=>{
        const craft = req.body;
        console.log(craft)
        const result = await craftsCollection.insertOne(craft)
        res.send(result)
    })

    app.delete('/delete/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await craftsCollection.deleteOne(query)
      res.send(result)
    })




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



















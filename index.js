const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6yteddn.mongodb.net/?retryWrites=true&w=majority`;

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


        const toyCollection = client.db("toyDB").collection("toys");


        app.get('/toys', async (req, res) => {
            const cursor = toyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/toys/myToys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/toys/myToys/ascending', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const options = {
                sort: { price: 1 },
            }
            const result = await toyCollection.find(query, options).toArray();
            res.send(result);
        });

        app.get('/toys/myToys/descending', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const options = {
                sort: { price: -1 },
            }
            const result = await toyCollection.find(query, options).toArray();
            res.send(result);
        });

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        });


        app.post('/toys', async (req, res) => {
            const newToy = req.body;
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("My Toy Land Server Is Running");
});

app.listen(port, () => {
    console.log(`My server port is: ${port}`);
})
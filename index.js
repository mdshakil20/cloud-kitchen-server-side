const express = require("express");
const cors = require("cors");
const { application } = require("express");
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

// user : cloud-kichen
// password: d5TFAy2jShvMHIzq

const uri = "mongodb+srv://cloud-kichen:d5TFAy2jShvMHIzq@cluster0.davow0l.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoDB').collection('services');

        // read operation for 3 service
        app.get('/services_3', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        // read operation for all service
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // read operation for service details
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = userCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post('/services/review/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body;
            const result = await userCollection.updateOne({ _id: ObjectId(id) },
                {
                    $push: {
                        reviews: {
                            $each: [review ]
                        }
                    }
                });
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('server running');
});

app.listen(port, () => {
    console.log(`Listen from port ${port}`);
})




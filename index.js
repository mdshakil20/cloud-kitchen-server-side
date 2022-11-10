const express = require("express");
const cors = require("cors");
const { application } = require("express");
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.davow0l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('nodeMongoDB').collection('services');
        const reviewCollection = client.db('nodeMongoDB').collection('service_review');

        // read operation for 3 service
        app.get('/services_3', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            const reviewList = [...services].reverse().slice(0, 3);
            res.send(reviewList);
        })

        //add service to db 
        app.post('/add-service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // read operation for all service
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // read operation for review by id 
        app.get('/services/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = {service_id : id};
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // read operation for service details
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // read operation for my reviews
        app.get('/services/my-reviews/:email', async (req, res) => {
            const email = req.params.email;
            const query = {   reviewer_email : email };
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // read operation for my reviews by id
        app.get('/services/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {   _id : ObjectId(id) };
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        //reveiw add 
        app.post('/services/review/addReview', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // update api 
        app.put('/update-review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const newReview = req.body;
            // console.log(newReview)
            const option = {upsert: true};
            const updatedReview = {
                $set: {
                    text:newReview.text
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option);
            res.send(result);
        })


        // delete review api 
        app.delete('/review/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
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




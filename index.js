const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqech.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("RepairGeekdb").collection("services");
  const appointmentCollection = client.db("RepairGeekdb").collection("appoinments");
  const adminCollection = client.db("RepairGeekdb").collection("admin");
  const reviewCollection = client.db("RepairGeekdb").collection("reviews");

  app.post('/addService', (req, res) =>{
    const newService = req.body;
    serviceCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  app.post('/addReview', (req, res) =>{
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addServiceAppoinment', (req, res) =>{
    const newAppoinment = req.body;
    console.log(newAppoinment);
    appointmentCollection.insertOne(newAppoinment)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addAdmin', (req, res) =>{
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/isAdmin',(req, res) => {
    const email =req.body.email;
    adminCollection.find({email: email})
    .toArray( (err, admin) => {
      res.send(admin.length > 0);
    })

  })


  app.get('/services',(req,res) => {
    serviceCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })

  app.get('/reviews',(req,res) => {
    reviewCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })

  })

  app.get('/service/:id',(req, res) => {
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, items) => {
      res.send(items[0]);
    })

  })

  app.get('/appointments',(req,res) => {
    appointmentCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })

  })

  app.get('/bookings',(req, res) => {
    console.log(req.query.email);
    appointmentCollection.find({email: req.query.email})
    .toArray((err, items)=>{
     res.send(items);
      console.log(items);
    })

  })

  app.delete('/delete/:id', (req,res) =>{
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

  app.patch('/update/:_id', (req, res) => {
    appointmentCollection
        .updateOne(
            { _id: ObjectId(req.params._id) },
            {
                $set: {
                    status: req.body.status,
                },
            },
        )
        .then((result) => {
            res.send(result.modifiedCount > 0);
        });
});



  app.get('/', (req, res) => {
    res.send('Database Connected Successfully')
  })

  //client.close();
});

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// .MONGODB
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yedps.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('listening');
});

client.connect((err) => {
  const foodsCollection = client.db('FoodBazar').collection('foods');
  const ordersCollection = client.db('FoodBazar').collection('orders');
  console.log('connection Successfull');
  //.add foods
  app.post('/addProduct', (req, res) => {
    const food = req.body;
    // console.log(food);
    foodsCollection.insertOne(food).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // . read data
  app.get('/allProducts', (req, res) => {
    foodsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  // . read specific data
  app.get('/product/:id', (req, res) => {
    foodsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, item) => {
        res.send(item);
      });
  });
  // . delete product
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    foodsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
        res.send(result.deletedCount > 0);
      });
  });
  // / order
  // . add order
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // . read order
  app.get('/orders', (req, res) => {
    const queryEmail = req.query.email;
    console.log(queryEmail);
    ordersCollection.find({ email: queryEmail }).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(port, () => console.log('listening to port ' + port));

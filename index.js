const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// .MONGODB
const MongoClient = require('mongodb').MongoClient;
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
  console.log('connection Successfull');

  //.add foods
  app.post('/addProduct', (req, res) => {
    const food = req.body;
    console.log(food);
    // foodsCollection.insertOne(food).then((result) => {
    //   res.send(result.insertedCount > 0);
    //   console.log(result);
    // });
  });
});

app.listen(port, () => console.log('listening to port ' + port));

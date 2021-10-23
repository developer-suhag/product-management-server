const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://sfirstDb:6Ppyx1F067W1SCL2@cluster0.qow90.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("productManagement");
    const productsCollection = database.collection("products");

    // GET API
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // get single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // UPDATE API / put api
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProdcut = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          productName: updatedProdcut.productName,
          productPrice: updatedProdcut.productPrice,
          productQuantity: updatedProdcut.productQuantity,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // POST API
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      console.log("got the user", req.body);
      console.log("insert sucess", result);
      res.json(result);
    });

    // DELETE API
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      console.log("deleting the user with id", id);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// listening
app.listen(port, () => {
  console.log("lisenting from port", port);
});

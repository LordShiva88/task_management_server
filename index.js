const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.rqtbidh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const tasksCollection = client.db("Task_Magnet").collection("Tasks");

    app.get("/tasks", async (req, res) => {
      const tasks = await tasksCollection.find().toArray();
      res.send(tasks);
    });

    app.post("/tasks", async (req, res) => {
      const data = req.body;
      const doc = {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        priority: data.priority,
        status: "todo",
        email: data.email,
        date: Date.now(),
      };
      const result = await tasksCollection.insertOne(doc);
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const newTask = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: newTask.title,
          description: newTask.description,
          deadline: newTask.deadline,
          priority: newTask.priority,
          status: "todo",
          email: newTask.email,
          date: Date.now(),
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put("/tasks/status/:id", async (req, res) => {
      const id = req.params.id;
      const newStatus = req.body;
      console.log(newStatus);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: newStatus.status,
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`My Task Management server is running with port:${port}`);
});

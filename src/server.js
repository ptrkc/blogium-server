import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
    res.send("get /posts");
});

app.get("/posts/:id", (req, res) => {
    res.send("get /posts/" + req.params.id);
});

app.post("/posts", (req, res) => {
    res.send("post /posts");
});

app.get("/posts/:id/comments", (req, res) => {
    res.send("get /posts/" + req.params.id + "/comments");
});

app.post("/posts/:id/comments", (req, res) => {
    res.send("post /posts/" + req.params.id + "/comments");
});

app.put("/posts/:id", (req, res) => {
    res.send("put /posts/" + req.params.id);
});

app.delete("/posts/:id", (req, res) => {
    res.send("delete /posts/" + req.params.id);
});

app.listen(4000);

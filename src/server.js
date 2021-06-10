import express from "express";
import cors from "cors";
import fs from "fs";

let blogiumData = {
    posts: [],
    comments: [],
    idCounter: { post: 0, comment: 0 },
};
if (fs.existsSync("./data/blogiumData.json")) {
    blogiumData = JSON.parse(fs.readFileSync("./data/blogiumData.json"));
}

function saveJSON() {
    fs.writeFileSync("./data/blogiumData.json", JSON.stringify(blogiumData));
}
const app = express();
app.use(cors());
app.use(express.json());

const posts = blogiumData.posts;
const comments = blogiumData.comments;
const idCounter = blogiumData.idCounter;

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.get("/posts/:id", (req, res) => {
    res.send(posts.find((p) => p.id === parseInt(req.params.id)));
});

app.post("/posts", (req, res) => {
    posts.push({
        ...req.body,
        id: idCounter.post + 1,
        contentPreview: "preview",
        commentCount: 0,
    });
    idCounter.post++;
    saveJSON();
    res.send("OK");
});

app.get("/posts/:id/comments", (req, res) => {
    res.send(comments.filter((c) => c.postId === parseInt(req.params.id)));
});

app.post("/posts/:id/comments", (req, res) => {
    comments.push({
        id: idCounter.comment + 1,
        ...req.body,
    });
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    post.commentCount++;
    idCounter.comment++;
    saveJSON();
    res.send("OK");
});

app.put("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    post.title = req.body.title;
    post.coverUrl = req.body.coverUrl;
    post.content = req.body.content;
    saveJSON();
    res.send("OK");
});

app.delete("/posts/:id", (req, res) => {
    const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
    posts.splice(index, 1);
    saveJSON();
    res.send("OK");
});

app.listen(4000);

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

const posts = blogiumData.posts;
const comments = blogiumData.comments;
const idCounter = blogiumData.idCounter;

function saveJSON() {
    fs.writeFileSync("./data/blogiumData.json", JSON.stringify(blogiumData));
}

function isURL(url) {
    const re =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return re.test(String(url).toLowerCase());
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.get("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (post === undefined) {
        res.status(400);
        res.send("Post not found.");
    } else {
        res.send(post);
    }
});

app.post("/posts", (req, res) => {
    let error = "";
    if (!String(req.body.coverUrl).trim()) {
        error += '"Image cover url" can not be blank.\n';
    } else if (!isURL(req.body.coverUrl)) {
        error += '"Image cover url" must be a valid URL.\n';
    }
    if (!String(req.body.title).trim()) {
        error += '"Title" can not be blank.\n';
    }
    if (!String(req.body.content).trim()) {
        error += '"Post content" can not be blank.\n';
    }
    if (error.length) {
        res.status(400);
        res.send(error);
    } else {
        idCounter.post++;
        posts.push({
            ...req.body,
            id: idCounter.post,
            contentPreview: "preview",
            commentCount: 0,
        });
        saveJSON();
        res.send("OK");
    }
});

app.get("/posts/:id/comments", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (post === undefined) {
        res.status(400);
        res.send("Post not found.");
    } else {
        res.send(comments.filter((c) => c.postId === parseInt(req.params.id)));
    }
});

app.post("/posts/:id/comments", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (post === undefined) {
        res.status(400);
        res.send("Post not found.");
        return;
    }
    let error = "";
    if (!String(req.body.author).trim()) {
        error += '"Name" can not be blank.\n';
    }
    if (!String(req.body.content).trim()) {
        error += '"Comment" can not be blank.\n';
    }
    if (error.length) {
        res.status(400);
        res.send(error);
    } else {
        idCounter.comment++;
        comments.push({
            id: idCounter.comment,
            ...req.body,
        });
        saveJSON();
        res.send("OK");
    }
});

app.put("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (post === undefined) {
        res.status(400);
        res.send("Post not found.");
        return;
    }
    let error = "";
    if (!String(req.body.coverUrl).trim()) {
        error += '"Image cover url" can not be blank.\n';
    } else if (!isURL(req.body.coverUrl)) {
        error += '"Image cover url" must be a valid URL.\n';
    }
    if (!String(req.body.title).trim()) {
        error += '"Title" can not be blank.\n';
    }
    if (!String(req.body.content).trim()) {
        error += '"Post content" can not be blank.\n';
    }
    if (error.length) {
        res.status(400);
        res.send(error);
    } else {
        post.title = req.body.title;
        post.coverUrl = req.body.coverUrl;
        post.content = req.body.content;
        saveJSON();
        res.send("OK");
    }
});

app.delete("/posts/:id", (req, res) => {
    const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(400);
        res.send("Post not found.");
    } else {
        posts.splice(index, 1);
        const filteredComments = comments.filter(
            (c) => c.postId !== parseInt(req.params.id)
        );
        comments.splice(0, comments.length, ...filteredComments);
        saveJSON();
        res.send("OK");
    }
});

app.listen(4000);

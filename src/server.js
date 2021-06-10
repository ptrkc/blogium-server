import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const blogiumData = {
    posts: [
        {
            id: 1,
            title: "Hello World",
            coverUrl:
                "https://miro.medium.com/max/1024/1*OohqW5DGh9CQS4hLY5FXzA.png",
            contentPreview:
                "Esta é a estrutura de um post esperado pelo front-end",
            content:
                "Este é o conteúdo do post, o que realmente vai aparecer na página do post...",
            commentCount: 2,
        },
        {
            id: 2,
            title: "Segundo Post",
            coverUrl:
                "https://miro.medium.com/max/1024/1*OohqW5DGh9CQS4hLY5FXzA.png",
            contentPreview: "Esta é o segundo post",
            content: "Este é o conteúdo do SEGUNDO post, O MELHOR POST...",
            commentCount: 2,
        },
    ],
    comments: [
        {
            id: 1,
            postId: 1,
            author: "João",
            content: "Muito bom esse post! Tá de parabéns",
        },
        {
            id: 2,
            postId: 1,
            author: "Maria",
            content: "Como faz pra dar palmas?",
        },
        {
            id: 3,
            postId: 2,
            author: "Anakin",
            content: "Esse post é brabo",
        },
        {
            id: 4,
            postId: 2,
            author: "Darth Vader",
            content: "Venha para o lado sombrio!",
        },
    ],
    idCounter: { post: 2, comment: 4 },
};

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
    res.send("OK");
});

app.put("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    post.title = req.body.title;
    post.coverUrl = req.body.coverUrl;
    post.content = req.body.content;
    res.send("OK");
});

app.delete("/posts/:id", (req, res) => {
    const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
    posts.splice(index, 1);
    res.send("OK");
});

app.listen(4000);

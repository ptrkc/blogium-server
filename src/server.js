import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const posts = [
    {
        id: 1,
        title: "Hello World",
        coverUrl:
            "https://miro.medium.com/max/1024/1*OohqW5DGh9CQS4hLY5FXzA.png",
        contentPreview: "Esta é a estrutura de um post esperado pelo front-end",
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
        commentCount: 3,
    },
];

const comments = {
    1: [
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
    ],
    2: [
        {
            id: 1,
            postId: 2,
            author: "Anakin",
            content: "Esse post é brabo",
        },
        {
            id: 2,
            postId: 2,
            author: "Darth Vader",
            content: "Venha para o lado sombrio!",
        },
    ],
};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.get("/posts/:id", (req, res) => {
    res.send(posts.find((p) => p.id === Number(req.params.id)));
});

app.post("/posts", (req, res) => {
    posts.push({
        ...req.body,
        id: 3,
        contentPreview: "preview",
        commentCount: 0,
    });
    res.send(req.body);
});

app.get("/posts/:id/comments", (req, res) => {
    res.send(comments[Number(req.params.id)]);
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

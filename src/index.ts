import "dotenv/config"
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000 || process.env.PORT;

//get all posts
app.get("/posts", async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({ posts });
    } catch (error: any) {
        next(error.message);
    }
})

//create post
app.post("/posts", async (req, res, next) => {
    try {
        const post = await prisma.post.create({
            data: {
                authorId: 1,
                ...req.body
            }
        });

        res.json({ post })
    } catch (error: any) {
        next(error);
    }
});

//get post by id
app.get("/posts/:id", async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(req.params.id) 
            }
        })

        res.json(post);
    } catch (error: any) {
        next(error.message)
    }
});

//update post
app.patch("/posts/:id", async (req, res, next) => {
    try {
        const post = await prisma.post.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        })

        res.json({ post });
    } catch (error: any) {
        next(error.message);
    }
});

//delete post
app.delete("/posts/:id", async (req, res, next) => {
    try {
        await prisma.post.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.sendStatus(200);
    } catch (error: any) {
        next(error.message);
    }
});

//get a user's post by id
app.get("/users/:id/posts", async (req, res, next) => {
    try {
        const usersWithPosts = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            },
            include: {
                posts: {
                    where: {
                        published: true,
                    }
                },
            },
        })

        const posts = usersWithPosts?.posts;

        res.json({posts});
    } catch (error: any) {
        next(error.message)
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port http://localhost:${PORT}`);
})

import express from "express";
import {blogsRoutes} from "./routes/blogs-routes";
import {postsRoutes} from "./routes/posts-routes";
import {usersRoutes} from "./routes/users-routes";
import {authRoutes} from "./routes/auth-routes";
import {testingRoutes} from "./routes/testing-routes";
import {commentsRoutes} from "./routes/comments-routes";
import cookieParser from "cookie-parser";
import {devicesRoutes} from "./routes/devices-routes";

const app = express()

app.set('trust proxy', true)

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/hometask-02/blogs', blogsRoutes);
app.use('/hometask-02/posts', postsRoutes);
app.use('/hometask-02/users', usersRoutes);
app.use('/hometask-02/auth', authRoutes);
app.use('/hometask-02/comments', commentsRoutes);
app.use('/hometask-02/devices', devicesRoutes);
app.use('/hometask-02/testing/all-data', testingRoutes);

export default app
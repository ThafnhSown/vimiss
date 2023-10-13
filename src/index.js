import configs from "@/configs";
import cookieParser from 'cookie-parser';
import cors from "cors";
import express from "express";
import { handleAPIError, handleNotFoundError } from "middlewares/errorMiddlewares";
import logger from "utils/logger";
import { connectDb } from "utils/mongo";
import { v1Routers } from "./routers/app/v1";
import { cmsRouters } from "./routers/cms";
import { PREFIX_API_CMS, PREFIX_API_V1 } from "./routers/config";
import { getAccessTokenKey, getCMSAccessTokenKey, getCMSRefreshTokenKey, getRefreshTokenKey } from "./utils/token";
const redisClient = require("@/middlewares/redis")
const session = require('express-session')
const passport = require('passport');
require("dotenv").config();
import { createServer } from "http"
const { Server } = require("socket.io");

const RedisStore = require('connect-redis').default
let redisStore = new RedisStore({
    client: redisClient
})

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4002",
    method: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room)
  })
  socket.on('new-comment', (comment) => {
    io.in(comment.newsId).emit('comment',socket.id, comment)
  })

  socket.on('disconnect', () => {
    socket.disconnect()
    console.log('🔥: A user disconnected');
  });
})

app.use(session({
  secret: 'secret key',
  resave: false,
  store: redisStore,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//initialize passport

app.use(passport.initialize());
app.use(passport.session());
require("./middlewares/passport.GoogleSSO")

app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: `X-PINGOTHER, Content-Type, Authorization, X-Forwarded-For, x-requested-with, ${getAccessTokenKey()}, ${getRefreshTokenKey()}, ${getCMSAccessTokenKey()}, ${getCMSRefreshTokenKey()}`,
  methods: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
  optionsSuccessStatus: 200 
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(PREFIX_API_V1, v1Routers);
app.use(PREFIX_API_CMS, cmsRouters)

app.use(handleAPIError);
app.use(handleNotFoundError);

connectDb()
  .then(() => {
    httpServer.listen(configs.port, () => {
      logger.info('Server is running on port', configs.port);
    })
  });
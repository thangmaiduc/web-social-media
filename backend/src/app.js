const morgan = require('morgan');
const cors = require('cors');
const _ = require('lodash');
// const dotenv = require("dotenv");
const indexRouter = require('./routes/index');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');
const passport = require('passport');
const cookieSession = require('cookie-session');
const redisClient = require('./utils/redis');

// const session = require('express-session');
require('./passport-config');
const express = require('express');
const { createNotification } = require('./controller/posts');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const SERVER_HOST = process.env.SERVER_HOST;

// const redisClient = redis.createClient(6379);
// dotenv.config();
app.use(helmet());
app.use(morgan('common'));

app.use(express.json());

app.use(
  cookieSession({
    name: 'session',
    keys: ['thangmd'],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
// app.use(
//   cors({
//     origin: [`http://${SERVER_HOST}:3000`, `http://${SERVER_HOST}:3005`, `http://${SERVER_HOST}:80`, '*'],
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     credentials: true,
//   })
// );
app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});
const forwardedPrefixSwagger = async (req, res, next) => {
  req.originalUrl = (req.headers['x-forwarded-prefix'] || '') + req.url;
  next();
};
app.use(
  '/api/doc',
  forwardedPrefixSwagger,
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    swaggerOptions: { persistAuthorization: true },
  })
);
app.use(
  '/api',
  indexRouter
  // #swagger.tags = ['Api']
  /* #swagger.security = [{
        "Bearer": []
    }] */
);

app.use(function (req, res, next) {
  try {
    let err = new Error('Không tìm thấy trang');
    err.statusCode = 404;
    throw err;
  } catch (error) {
    next(error);
  }
});

// error handler
app.use((error, req, res, next) => {
  // console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;

  if (status === 422) {
    let errors = {};
    error.data.forEach((err) => {
      let key = err.param;
      let value = err.msg;

      errors[key] = value;
    });
    res.status(status).json({ message: message });
    return;
  }
  if (status !== 417) {
    console.error(error);
  }
  res.status(status).json({ message: message });
});

const db = require('./models').sequelize;

db.sync({ force: false, alter: false })
  .then()
  .catch((err) => {
    console.log(err);
    console.log('Syncing database was fail');
  });

// * SOCKET

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  try {
    //when ceonnect
    console.log('a user connected.');

    socket.on('addUser', (userId) => {
      console.log('[Event addUser]: ', JSON.stringify(userId));
      addUser(userId, socket.id);
      io.emit('getUsers', users);
      console.log('users::::::::::: ', users);
    });

    socket.on('pushNotification', async ({ userId, subjectId, text, type }) => {
      try {
        console.log(
          '[Event pushNotification]: ',
          JSON.stringify({ userId, subjectId, text, type })
        );
        const notification = await createNotification({
          userId,
          subjectId,
          text,
          type,
        });
        // if (notification.receiverId === userId) return;
        notification.receiverIds.forEach((receiverId) => {
          const receiver = getUser(receiverId);
          console.log(
            'receiver && userId !== receiverId',
            receiver && userId !== receiverId
          );
          console.log('receiver', receiverId);
          console.log('userId', userId);
          if (receiver && userId !== receiverId) {
            let contentObject =
              receiverId === notification.subjectOwnerId
                ? 'bạn'
                : notification.ownerFullName;
            let countStr = '';
            if (notification.total > 1)
              countStr = `và ${notification.total - 1} người khác`;
            let content = ` ${countStr} ${notification.content} ${contentObject}: ${text}`;
            const dataResponse = _.omit(notification, [
              'receiverIds',
              'ownerFullName',
              'subjectOwnerId',
            ]);
            io.to(receiver.socketId).emit('sendNotification', {
              ...dataResponse,
              content,
            });
            console.log('[sendNotification] đã gui thông báo cho userId: ', receiverId);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('sendMessage', ({ senderId, receiverId, text, fileUrl }) => {
      const user = getUser(receiverId);
      console.log(
        '[Event sendMessage]: ',
        JSON.stringify({ senderId, receiverId, text, fileUrl })
      );
      if (user)
        io.to(user.socketId).emit('getMessage', {
          senderId,
          text,
          fileUrl,
        });
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected!');
      removeUser(socket.id);
      io.emit('getUsers', users);
    });
  } catch (error) {
    console.log(error);
  }
});
//* ########==========#######

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('app listening on port ' + PORT);
});

module.exports = io;

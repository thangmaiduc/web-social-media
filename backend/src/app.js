const morgan = require('morgan');
const cors = require('cors');
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

const SERVER_HOST = process.env.SERVER_HOST;

const app = express();
// const redisClient = redis.createClient(6379);
// dotenv.config();
app.use(helmet());
app.use(morgan('common'));

app.use(express.json());

app.use(cookieSession({ name: 'session', keys: ['thangmd'], maxAge: 24 * 60 * 60 * 100 }));

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
app.use(
  '/api',
  indexRouter
  // #swagger.tags = ['Api']
  /* #swagger.security = [{
        "Bearer": []
    }] */
);

const forwardedPrefixSwagger = async (req, res, next) => {
  req.originalUrl = (req.headers['x-forwarded-prefix'] || '') + req.url;
  next();
};
app.use(
  '/doc',
  forwardedPrefixSwagger,
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    swaggerOptions: { persistAuthorization: true },
  })
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
app.use((error, req, res) => {
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
  res.status(status).json({ message: message });
});

const db = require('./models').sequelize;

db.sync({ force: false, alter: false })
  .then()
  .catch((err) => {
    console.log(err);
    console.log('Syncing database was fail');
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('app listening on port ' + PORT);
});

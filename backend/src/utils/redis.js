const Redis = require('ioredis');
const _ = require('lodash');
const redis = new Redis();

const set = (key, value, ttl) => {
  try {
    if (_.isNumber(ttl)) redis.set(key, JSON.stringify(value), 'ex', ttl);
    else redis.set(key, JSON.stringify(value));
  } catch (err) {
    console.error(err);
  }
};

const get = (key) => {
  return redis.get(key).then((value) => JSON.parse(value));
};
const getTTL = (key) => {
  return redis.ttl(key);
};

const del = (key) => {
  redis.del(key);
};

const keys = (k) => {
  return redis.keys(k);
};

module.exports = {
  set,
  get,
  del,
  getTTL,
  keys
};

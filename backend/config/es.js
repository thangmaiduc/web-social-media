const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '6.8',
});

module.exports = client;

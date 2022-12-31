const elasticsearch = require('elasticsearch');
const Post = require('../src/models/').Post;

const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});


module.exports = client;
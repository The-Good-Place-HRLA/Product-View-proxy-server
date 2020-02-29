const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const redis = require('redis');

const options = {
    target: 'http://localhost:3333',
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
        var productId = req.params['0'].slice(3) // product id number
        proxyRes.on('data', function (data) {
            client.setex(productId, 3600, data.toString('utf-8'))
        })
    }
}

const Proxy = createProxyMiddleware(options)

const app = express();
const port = 3000;
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

function checkCache(req, res, next) {
    var productId = req.params['0'].slice(3) // gets the product id number
    client.get(productId, (err, data) => {
        if (err) throw err;
        if (data !== null) { res.header(200).send(JSON.parse(data)) }
        else { next() }
    })
}

app.use('/*', checkCache, Proxy)
// app.use(express.static(path.join(__dirname, '../client/dist')));
// app.get('/:productId', express.static(path.join(__dirname, '../client/dist')));

app.listen(port, () => console.log(`\u001b[1;34m Server listening on port ${port}`));
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const options = {
    target: 'http://localhost:3333',
    changeOrigin: true
}

const Proxy = createProxyMiddleware(options)

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());

app.use('/*', Proxy)
// app.use(express.static(path.join(__dirname, '../client/dist')));
// app.get('/:productId', express.static(path.join(__dirname, '../client/dist')));

app.listen(port, () => console.log(`\u001b[1;34m Server listening on port ${port}`));
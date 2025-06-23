const path = require('path');
const express = require('express');
const compression = require('compression');
const cacheControl = require('./cacheControlMiddleware');
const schema = require('./schemaMiddleware');

module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(cacheControl());
  app.get('/api/schema', schema);
  app.use(publicPath, express.static(outputPath));
  // app.use('/api/schema', schema);

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(outputPath, 'index.html')),
  );
};

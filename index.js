const Console = require('console');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// proxy server setup
const port = process.env.PORT || 8080;
const app = express();
const proxyPath = path.join(__dirname);

// service routing setup
const descriptionHost = process.env.DESHOST || 'localhost:3000';
const reviewsHost = process.env.REVHOST || 'localhost:3002';
const reservationHost = process.env.RESHOST || 'localhost:3001';

const descriptionOptions = {
  target: `http://${descriptionHost}`,
  changeOrigin: true,
};
const reviewsOptions = {
  target: `http://${reviewsHost}`,
  changeOrigin: true,
}
const reservationOptions = {
  target: `http://${reservationHost}`,
  changeOrigin: true,
}
const proxyToDescription = createProxyMiddleware(descriptionOptions);
const proxyToReviews = createProxyMiddleware(reviewsOptions);
const proxyToReservation = createProxyMiddleware(reservationOptions);

// loader.io
const token = process.env.LIO || 'placeholder';
app.get(`/${token}`, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'loaderio.txt'));
});

// proxy home
app.use('/:id', express.static(proxyPath));

// proxy to description service
app.get('/description/main.js', proxyToDescription);
app.get('/api/description/:id', proxyToDescription);

// proxy to reviews service
app.get('/:id/reviews/bundle.js', proxyToReviews);
app.get('/api/reviews/:id', proxyToReviews);

// proxy to reservation service
app.get('/:id/reservation/reservationBundle.js', proxyToReservation);
app.get('/reservation/style.css', proxyToReservation);
app.get('/api/reservation/:id', proxyToReservation);



app.listen(port, () => {
  Console.log(`proxy listening on port ${port}`);
});

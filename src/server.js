require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'db not connected' });
});

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Đã kết nối MongoDB');
    app.listen(PORT, () => console.log(`API chạy tại http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });
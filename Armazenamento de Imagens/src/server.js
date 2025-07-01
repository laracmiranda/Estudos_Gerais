const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const produtoRoutes = require('./routes/produtoRoutes');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/produtos', produtoRoutes);
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

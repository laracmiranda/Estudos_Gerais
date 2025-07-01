const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuração do Multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  const { nome, descricao, preco } = req.body;

  try {
    // 1. Envia imagem do disco para Cloudinary
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'produtos',
    });

    // 2. Remove a imagem local (não precisamos mais dela)
    fs.unlinkSync(req.file.path);

    // 3. Salva os dados do produto + URL no banco de dados
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imageUrl: resultado.secure_url,
      },
    });

    // 4. Retorna o produto salvo para o front
    res.status(201).json({
      message: 'Produto criado com sucesso!',
      produto: novoProduto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer upload ou salvar produto' });
  }
});

router.get('/', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});


module.exports = router;

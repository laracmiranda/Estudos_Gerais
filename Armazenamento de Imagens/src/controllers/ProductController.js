import { prismaClient } from "../../database/prismaClient.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export class ProductController {

    async saveProduct(req, res){
        const { nome, descricao, preco } = req.body;

        try {
            // Inicializa a variável da imagem como nula (será preenchida após upload)
            let image = null;

            // Confere se o usuário realmente enviou um arquivo de imagem
            if (!req.file || !req.file.buffer) {
                return res.status(400).json({ erro: 'Arquivo não encontrado', mensagem: 'Nenhuma imagem foi enviada' });
            }

            // Faz o upload da imagem para o cloudinary
            const result = await new Promise((resolve, reject) => {
                // Cria uma stream de upload do Cloudinary
                const uploadStream = cloudinary.uploader.upload_stream({
                    // Pasta que será criada dentro do Cloudinary onde as imagens ficarão salvas
                    folder: "produtos",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                // Transforma o arquivo que chegou em uma Stream legível, que será enviada ao cloudinary
                // Isso é necessário porque o Cloudinary espera receber dados em stream
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });

            // Salva a URL da imagem retornada pelo Cloudinary
            image = result.secure_url;

            const newProduct = await prismaClient.produto.create({
                data: { nome, descricao, preco: parseFloat(preco), imageUrl: image},
            });
            return res.status(201).json({
                message: 'Produto criado com sucesso!',
                newProduct
            });
        } catch (error){
            return res.json(500).json({ error: "Erro ao cadastrar produto" });
        }
    }

    async findAllProducts(req, res){
        try{
            const products = await prismaClient.produto.findMany();

            return res.status(200).json(products);
        } catch(error){
            return res.status(500).json({ error: "Erro ao buscar produtos"} );
        }
    }

}
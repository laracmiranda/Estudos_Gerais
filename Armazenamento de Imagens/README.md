# 📦 Armazenamento de Imagens

Este projeto é um exemplo completo de como criar um sistema de cadastro de produtos com upload de imagem, utilizando:

- **Node.js + Express** para o back-end
- **Cloudinary** para armazenar imagens na nuvem
- **Neon** para criar o banco de dados na nuvem
- **Prisma ORM + PostgreSQL** para persistência de dados
- **HTML + JS** simples no front-end para testes

---

## 🚀 Funcionalidades

- Cadastro de produtos com imagem
- Upload da imagem para o Cloudinary
- Armazenamento automático da URL da imagem no banco
- Exibição dos produtos cadastrados com suas imagens

---

## 📁 Estrutura do Projeto

```
/backend
├── .env
├── public/
│   └── index.html         # Front-end HTML básico
├── prisma/
│   └── schema.prisma      # Schema do banco com Prisma
├── src/
│   ├── config/
│   │   └── cloudinary.js  # Configuração do Cloudinary
│   ├── routes/
│   │   └── produtoRoutes.js # Rotas de produto
│   └── server.js          # Entrada do servidor Express
```

---

## 📦 Dependências

Instale com:
```bash
npm install express dotenv cors multer cloudinary @prisma/client
```

Dev:
```bash
npm install -D nodemon prisma
```

---

## ⚙️ Configuração

### 1. Variáveis de ambiente (`.env`):
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/seubanco"
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

### 2. Configuração do Prisma (`prisma/schema.prisma`):
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Produto {
  id        Int     @id @default(autoincrement())
  nome      String
  descricao String?
  preco     Float
  imageUrl  String
}
```

Gere o cliente e as tabelas:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🔌 Back-end (Explicações)

### `src/server.js`
- Configura o Express
- Habilita `cors()` para permitir requisições do front
- Serve o HTML da pasta `public`
- Usa as rotas de produto (`/api/produtos`)

### `src/config/cloudinary.js`
- Configura o Cloudinary com as credenciais do `.env`

### `src/routes/produtoRoutes.js`
- POST `/upload`: recebe imagem, envia ao Cloudinary, salva URL no banco
- GET `/`: lista todos os produtos cadastrados

### `multer`
- Usado para processar uploads de imagem via `multipart/form-data`

---

## 🌐 Front-end HTML (`public/index.html`)

### `form`
- Permite cadastrar nome, descrição, preço e imagem
- Envia via `fetch` para `/api/produtos/upload`

### JS
- Após envio, limpa o formulário e recarrega os produtos
- Carrega automaticamente os produtos existentes via `GET /api/produtos`
- Insere as imagens usando `src=imageUrl`

---

## ▶️ Como rodar

1. Crie o `.env` com suas credenciais
2. Rode a migração:
```bash
npx prisma migrate dev --name init
```
3. Inicie o servidor:
```bash
npx nodemon src/server.js
```
ou 
```bash
npm start
```
4. Abra `public/index.html` no navegador
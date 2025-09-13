# 📩 Redefinição de Senha com Nodemailer

Este projeto é um exemplo completo de como criar um sistema de redefinição de senha com e-mail utilizando nodemailer!

- **Node.js + Express** para o back-end
- **nodemailer** para o envio do e-mail de redefinição
- **Neon** para criar o banco de dados na nuvem
- **Prisma ORM + PostgreSQL** para persistência de dados
- **JWT** para autenticação
- **Bcrypt** para criptografia/hash de senhas

---

## 👉 O que faremos?

- CRUD completo de usuários
- Gerar token para o reset da senha
- Enviar um e-mail de redefinição
- **Realizar a redefinição da senha com o token enviado no e-mail**

---

## 📁 Estrutura do Projeto

```
/backend
├── .env
├── prisma/
│   └── schema.prisma         # Schema do banco com Prisma
├── database/
│   └── PrismaClient.js       # Instância do Prisma
├── src/
│   ├── config/
│   │   └── mailer.js         # Configuração do nodemailer
│   ├── middlewares/
│   │   └── authenticate.js   # Função para autenticação JWT
│   ├── controllers/
│   │   └── UserController.js # CRUD de usuários
│   │   └── AuthController.js # Login, redefinição de senha
│   ├── routes/
│   │   └── index.js          # Rotas gerais
│   │   └── userRoutes.js     # Rotas de usuários
│   │   └── authRoutes.js     # Rotas de produtos
│   └── server.js             # Entrada do servidor Express
```
---

## ⚙️ Configuração

### 1. Configurações prévias para o nodemailer

Aqui eu recomendo que utilize uma conta no `gmail` pela praticidade

* Ativar a verificação de 2 etapas no seu e-mail
    * Vá em Minha Conta Google > Segurança
    * Ative a **Verificação em duas etapas**
* Gerar a senha de app
    * Ainda em **Segurança**, clique em **Senhas de app**
    * Escolha "Outro > Escolha um nome (Sugestão: nodemailer ou o nome da sua aplicação)
    * O google vai gerar uma senha de 16 caracteres
    * **Salve essa senha!**

### 2. Variáveis de ambiente (`.env`):
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/seubanco"
SECRET_JWT="sua_chave_secreta"
EMAIL_USER=email
EMAIL_PASS=senha_do_app
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

model User {
  id        String     @id @default(uuid())
  name      String     @db.VarChar(100)
  email     String     @unique @db.VarChar(150)
  password  String
  resetpassword  ResetPasswordToken[] // Relação com a tabela de redefinição de senha

  @@map("users")
}

 // Tabela para receber o token de reset da senha
model ResetPasswordToken {
  id           String     @id @default(uuid())
  token        String     @unique
  expiresAt    DateTime
  createdAt    DateTime   @default(now())
  userId       String
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Gere o cliente e as tabelas:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🔌 Back-end (Explicações)

O que cada parte do código faz? 

### 🔹 `src/server.js`
- Configura o Express
- Habilita `cors()` para permitir requisições do front
- Usa as rotas da api (`/api`)

### 🔹 `src/config/nodemailer.js`
Configura o transporte com as credenciais do `.env` e cria a função que realiza o disparo do e-mail

- Criando o transportador
```js
export const transpoter = nodemailer.createTransport({
    service: "gmail", // Já coloca o host e a porta padrão do gmail
    auth: {
        // Utilizando nossas variáveis configuradas no .env
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
```

- Função para disparo do e-mail
```js
export async function sendMail(to, subject, html){
    try {
        await transpoter.sendMail({
            from: `"Suporte" <${process.env.EMAIL_USER}>`, // Remetente
            to, // Destinarário
            subject, // Assunto do e-maiç
            html, // Corpo do e-mail em html
        });
        console.log("E-mail enviado com sucesso!");
    } catch (error){
        console.error("Erro ao enviar e-mail:", error);
        throw error;
    }
}
```
- 

### 🔹 `src/controllers/ProductController.js`
- Recebe os dados do frontend
```js
const { nome, descricao, preco } = req.body;
```

- Valida se a imagem foi enviada
```js
if (!req.file || !req.file.buffer) {
    return res.status(400).json({ erro: 'Arquivo não encontrado', mensagem: 'Nenhuma imagem foi enviada' });
}
```

- Faz o upload da imagem para o Cloudinary
```js
const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: "produtos" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
    });
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});
```

- Salva o produto no banco com Prisma
```js
const image = result.secure_url;
const newProduct = await prismaClient.produto.create({
    data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imageUrl: image,
    },
});
```

### 🔹 `src/utils/upload.js`
- Usado para processar uploads de imagem via `multipart/form-data`

---

## 🌐 Front-end HTML (`public/index.html`)

Frontend simples apenas para testes!
- Permite cadastrar nome, descrição, preço e imagem
- Envia via `fetch` para `/api/produtos/`
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
npm start
```
4. Abra `public/index.html` no navegador

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

### 3. Configuração do Prisma (`prisma/schema.prisma`):
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

- Importe o nodemailer
```js
import nodemailer from "nodemailer";
```

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

### 🔹 `src/controllers/UserController.js`
Faz o CRUD completo de usuários
- É importante porque precisamos ter usuários cadastrados de fato para testarmos nosso login e redefinição de senha
- Como o foco é a redefinição de senha, não entrarei em detalhes sobre esse código. Mas você pode conferir ele completo em [UserController.js](./src/controllers/UserController.js)

### 🔹 `src/controllers/AuthController.js`
Responsável pelas funções de `login`e nossa `redefinição de senha`. Novamente, como o foco é o reset, não entrarei em detalhes sobre o login. Porém você pode checar o código completo do login + autenticação JWT em [AuthController.js](./src/controllers/AuthController.js) e [authenticate.js](./src/middlewares/authenticate.js)

- Função que faz gera o token de reset e envia para o e-mail a solicitação
```js
    async requestPasswordReset(req, res){
        const { email } = req.body; // Recebe o e-mail do usuário

        try {
            // Verifica se o usuário existe no nosso banco de dados
            const user = await prismaClient.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Cria o token aleatório de 32 bytes de redefinição único e com validade de 15 minutos
            const resetToken = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 1000 * 60 * 15); 

            // Salva o token no banco
            await prismaClient.resetPasswordToken.create({
                data: { token: resetToken, userId: user.id, expiresAt }
            });
            
            // Lembra da função para envio de e-mail que criamos no mailer.js? É aqui que chamamos ela!
            await sendMail(
                // E-mail enviado contendo um link com o token que foi gerado
                user.email,
                "Redefinição de senha",
                `
                <h2> Olá, ${user.name} </h2>
                <p> Você solicitou redefinição de senha. Clique no link abaixo para redefinir: </p>
                <a href="http://localhost:${PORT}/api/auth/reset-password/${resetToken}">
                   👉 Redefinir minha senha
                </a>

                <p> Esse link expira em 15 minutos. </p>
                `
            );
    
            return res.json({ message: "E-mail de redefinição enviado!" });
        } catch (error){
            console.error("Erro em requestPasswordReset:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
```

- Função responsável por efetivamente redefinir a senha usando o token

```js
    async resetPassword(req, res) {
        const { token } = req.params; // Recebe o token na url 
        const { newPassword } = req.body; // Recebe a nova senha do usuário

        try {
            // Verifica se o token existe e se não está expirado
            const resetToken = await prismaClient.resetPasswordToken.findUnique({ where: { token }});
            if (!resetToken || resetToken.expiresAt < new Date()) {
                return res.status(400).json({ error: "Token inválido ou expirado" });
            }

            // Caso esteja tudo certo acima, ele vai gerar o hash(criptografar) a nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Atualiza a senha do usuário no banco com a nova senha criptografada
            await prismaClient.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword }
            });

            // Removendo o token depois de usado
            await prismaClient.resetPasswordToken.delete ({ where: { id: resetToken.id }});
            return res.json ({ message: "Senha redefinida com sucesso!" });
        } catch (error){
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
```

### 🔹 `src/routes`
Contem todas as rotas da api. Lembrando que ela sempre inicia com `http://localhost:3000/api`

#### `index.js`

| Método | Rota     | Descrição                    |
| ------ | -------- | ---------------------------- |
| use    | `/auth`  | Agrupa rotas de autenticação |
| use    | `/users` | Agrupa rotas de usuários     |

#### `authRoutes.js` 

| Método | Rota                     | Autenticação | Descrição                                    |
| ------ | ------------------------ | ------------ | -------------------------------------------- |
| POST   | `/login`                 | ❌            | Realiza login e retorna token JWT            |
| POST   | `/request-reset`         | ❌            | Solicita redefinição de senha (gera token)   |
| POST   | `/reset-password/:token` | ❌            | Redefine a senha a partir de um token válido |

#### `userRoutes.js`

| Método | Rota                  | Autenticação | Descrição                        |
| ------ | --------------------- | ------------ | -------------------------------- |
| GET    | `/`                   | ❌            | Lista todos os usuários          |
| GET    | `/me`                 | ✅            | Retorna o usuário autenticado    |
| POST   | `/`                   | ❌            | Cria um novo usuário             |
| PUT    | `/me`                 | ✅            | Atualiza dados do usuário logado |
| DELETE | `/me`                 | ✅            | Remove a conta do usuário logado |
| PATCH  | `/me/change-password` | ✅            | Altera a senha do usuário logado |

---

## ▶️ Como rodar

1. Clone o repositório
```bash
git clone https://github.com/laracmiranda/Estudos_Gerais.git
```

2. Entre na pasta
```bash
cd Estudos_Gerais/Redefinição de senha com nodemailer
```

3. Instale as dependências
```bash
npm install
```

4. Configure o arquivo `.env` com as credenciais </br>
5. Execute no terminal
```bash
npm start
```

## 📌 Testando
Fluxo sugerido para testes usando as ferramentas `Insomnia` ou `Postman`

1. Cadastre um usuário - `http://localhost:3000/api/users` </br>
_Recomendo que use um e-mail real para testar_ 
```json
{
    "name": "Teste",
    "email": "teste@gmail.com",
    "password": "testando123"
}
```

2. Solicite a redefinição da senha - `http://localhost:3000/api/auth/request-reset`
```json
{
    "email": "teste@gmail.com"
}
```

3. Cheque seu e-mail para verificar se recebeu
4. Clique no link de redefinição de senha
5. Copie o token enviado
6. Realize a redefinição de senha - `http://localhost:3000/api/auth/reset-password/Insira o token aqui!`
```json
{ 
    "newPassword": "redefinindo123"
}
```

---

✨ Esse repositório foi criado para fins de estudos!
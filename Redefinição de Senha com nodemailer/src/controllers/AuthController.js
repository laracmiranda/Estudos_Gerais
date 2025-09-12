import bcrypt from "bcryptjs";
import { prismaClient } from "../../database/PrismaClient.js";
import jwt from "jsonwebtoken";
import crypto, { hash } from "crypto";
import { sendMail } from "../../config/mailer.js";
import { send } from "process";
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

export class AuthController {
    
    async login(req,res){
        const { email, password } = req.body;

        const user = await prismaClient.user.findUnique({
            where: { email }
        })

        if (!user){
            return res.status(401).json({ error: "Usuário não existe"})
        }

        // Compara a senha vinda do body com o hash no banco
        const userValid = await bcrypt.compare(password, user.password);

        if (!userValid){
            return res.status(401).json({ error: "Credenciais inválidas"})
        }

        const payload = { userId: user.id }
        const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '1h' })

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name
            }
        })
    }

    async requestPasswordReset(req, res){
        const { email } = req.body;

        try {
            const user = await prismaClient.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const resetToken = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 1000 * 60 * 15); 

            await prismaClient.resetPasswordToken.create({
                data: { token: resetToken, userId: user.id, expiresAt }
            });
            
            await sendMail(
                user.email,
                "Redefinição de senha",
                `
                <h2> Olá, ${user.name} </h2>
                <p> Você solicitou redefinição de senha. Clique no link abaixo para redefinir: </p>
                <a href="http://localhost:${PORT}/ai/auth/reset-password/${resetToken}">
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

    async resetPassword(req, res) {
        const { token } = req.params;
        const { newPassword } = req.body;

        try {
            const resetToken = await prismaClient.resetPasswordToken.findUnique({ where: { token }});

            if (!resetToken || resetToken.expiresAt < new Date()) {
                return res.status(400).json({ error: "Token inválido ou expirado" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

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

}
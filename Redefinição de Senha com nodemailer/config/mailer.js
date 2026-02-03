import nodemailer from "nodemailer";

export const transpoter = nodemailer.createTransport({
    service: "gmail", // Já coloca o host e a porta padrão do gmail
    auth: {
        // Utilizando nossas variáveis configuradas no .env
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

import nodemailer from "nodemailer";

export const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendMail(to, subject, html){
    try {
        await transpoter.sendMail({
            from: `"Suporte" <${process.send.EMAIL_USER}>`,
            to, 
            subject,
            html,
        });
        console.log("E-mail enviado com sucesso!");
    } catch (error){
        console.error("Erro ao enviar e-mail:", error);
        throw error;
    }
}
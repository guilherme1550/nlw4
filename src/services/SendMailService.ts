import nodemailer, { Transporter } from "nodemailer"
import { resolve } from "path"
import fs from "fs"

import handlebars from "handlebars"



class SendMailService {

    private client: Transporter;
    
    constructor() {
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
            });
            
            this.client = transporter
        });
    }
    
    async execute(to: string, subject: string, variables: object, path: string) {
        
        //Ler o arquivo do handlebars(template)
        const templateFileContent = fs.readFileSync(path).toString("utf8")

        //Compila o arquivo do handleblars
        const mailTemplateParse = handlebars.compile(templateFileContent) 
        
        //Passo as variáveis para o arquivo do Handlebars
        const html = mailTemplateParse(variables)
        
        //Envia o email
        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: 'NPS <no-reply@rocketseat.com.br>'
        })

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService
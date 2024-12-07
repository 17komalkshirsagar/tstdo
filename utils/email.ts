import dotenv from 'dotenv';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';


dotenv.config();


interface Attachment {
    filename: string;
    path: string;
}

const sendEmail = (
    to: string,
    subject: string,
    message: string,
    attachment?: Attachment
): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {

            const mailer: Transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.FROM_EMAIL,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions: SendMailOptions = {
                from: process.env.FROM_EMAIL,
                to,
                subject,
                text: message,
                attachments: attachment ? [attachment] : [],
            };


            mailer.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending email: ', err);
                    return reject(err instanceof Error ? err.message : 'Unknown error');
                } else {
                    console.log('Email sent successfully', info);
                    return resolve('Email sent successfully');
                }
            });
        } catch (error) {
            console.error('Error in sendEmail: ', error);
            return reject(error instanceof Error ? error.message : 'Unknown error');
        }
    });
};

export default sendEmail;

import nodemailer from 'nodemailer';
import { CustomError, loadFile } from '../utils/utils.js';

// Replace the placeholders in the template
const replacePlaceholders = (template, name, recipientName, labels) => {
    try {
        let emailHtml = template;
        emailHtml = emailHtml.replace('{email.hi}', labels['email.hi']);
        emailHtml = emailHtml.replace('{email.text.1}', labels['email.text.1']);
        emailHtml = emailHtml.replace('{email.text.2}', labels['email.text.2']);
        emailHtml = emailHtml.replace('{email.text.3}', labels['email.text.3']);
        emailHtml = emailHtml.replace('{email.text.4}', labels['email.text.4']);
        emailHtml = emailHtml.replace('{email.footer.text}', labels['email.footer.text']);
        emailHtml = emailHtml.replace('{email.name}', name);
        emailHtml = emailHtml.replace('{email.recipient}', recipientName);
        return emailHtml;
    } catch (error) {
        const errorMessage = labels['message.read.email.template.error'];
        throw new CustomError(errorMessage);
    }
};

// Send the emails
export const sendEmails = async (pairs, labels) => {
    try {
        const fileBuffer = await loadFile('../email/templates/extraction/email.html'); // Load the email template
        const template = fileBuffer.toString('utf-8'); // Convert byte array to string

        // Create the transporter
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 25,
            secure: false, // true for 465, false for other ports
            tls: { rejectUnauthorized: false }
        });

        // Create the emails
        const messages = []; // Array to store the messages
        for (const item of pairs) { // Iterate over the pairs
            const emailHtml = replacePlaceholders(template, item.name, item.recipient, labels); // Replace the placeholders
            const mailOptions = {
                from: 'secret-santa@bruma.cloud',
                to: item.email,
                subject: labels['email.subject'],
                html: emailHtml
            };

            try {
                const info = await transporter.sendMail(mailOptions); // Send the email
                messages.push({
                    code: 'SUCCESS',
                    message: labels['message.email.success'].replace('{0}', item.email)
                });
            } catch (emailError) {
                messages.push({
                    code: 'ERROR',
                    message: labels['message.email.error'].replace('{0}', item.email)
                });
            }
        }

        return messages; // Return the messages
    } catch (error) {
        const errorMessage = error.isCustom ? error.message : labels['message.send.email.error'];
        throw new CustomError(errorMessage);
    }
};
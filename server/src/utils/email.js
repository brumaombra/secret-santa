import nodemailer from 'nodemailer';

// Send the emails
export const sendEmails = pairs => {
    const messagges = pairs.map(pair => ({
        code: '00',
        message: `Email send to ${pair.email} successfully!`
    }));

    // Create the transporter
    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 25,
        secure: false, // true for 465, false for other ports
        tls: { rejectUnauthorized: false }
    });

    // Create the mail options
    const mailOptions = {
        from: 'secret-santa@bruma.cloud',
        to: 'maurobra97@gmail.com',
        subject: 'Secret Santa!',
        html: '<b>Email content</b>'
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error); // Error
        console.log('Message sent: %s', info.messageId); // Success
    });

    // return messagges;
};
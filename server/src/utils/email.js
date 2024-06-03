// Send the emails
export const sendEmails = pairs => {
    const messagges = pairs.map(pair => ({
        code: '00',
        message: `Email send to ${pair.email} successfully!`
    }));
    return messagges;
};
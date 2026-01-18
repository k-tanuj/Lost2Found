const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Example: Gmail or SendGrid
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text, html) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        // Silent skip - prevents errors/clutter if email isn't configured yet
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"Lost2Found" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log("📧 Email sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Email failed:", error.message);
    }
};

module.exports = { sendEmail };

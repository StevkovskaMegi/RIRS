// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER, // Load email user from the environment
        pass: process.env.EMAIL_PASS  // Load email password from the environment
    }
});

// Funkcija za pošiljanje obvestila o statusu
async function sendNotification(user, status) {
    const message = {
        from: 'megi.stevkovska@student.um.si',  // Vaš e-poštni naslov
        to: user.email,                // E-poštni naslov uporabnika
        subject: 'Expense Request Status Update',
        text: `Hello ${user.name},\n\nYour expense request has been ${status}.\n\nBest regards,\nYour Company`
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Email sent: ' + info.response);
    } catch (err) {
        console.error('Error sending email: ', err);
    }
}

module.exports = sendNotification;  // Izvozimo funkcijo sendNotification

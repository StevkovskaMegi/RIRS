// emailService.js
const nodemailer = require('nodemailer');

// Konfiguracija za Gmail SMTP strežnik
const transporter = nodemailer.createTransport({
    service: 'outlook',  // Lahko uporabite tudi druge storitve, kot so Outlook, SendGrid itd.
    auth: {
        user: 'megi.stevkovska@student.um.si',  // Vaš e-poštni naslov
        pass: '@MS23052001m@'    // Vaše Gmail geslo ali aplikacijsko geslo (za večjo varnost)
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

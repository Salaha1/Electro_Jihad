const nodemailer = require('nodemailer');

// Setup the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salah.atallah04@gmail.com', // your email address
    pass: 'kutz okyu kgif hdfw', // your Gmail password or app-specific password
  },
});

// Function to send an email
async function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: 'salah.atallah04@gmail.com', // your email address
    to: to, // recipient email address
    subject: subject,
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log('Error sending email:', error);
  }
}

// Function to send a verification email
async function sendVerificationEmail(userEmail, token) {
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
  const subject = 'Email Verification';
  const text = `Please click the following link to verify your email address: ${verificationUrl}`;
  const html = `<p>Please click the following link to verify your email address:</p><a href="${verificationUrl}">${verificationUrl}</a>`;

  // Send the email
  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendEmail, sendVerificationEmail };
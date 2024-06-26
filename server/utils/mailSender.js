const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "775149001@smtp-brevo.com",
        pass: "Hrf85YPBzGFZtCq2",
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: "karandeep.singh@chicmic.co.in",
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;

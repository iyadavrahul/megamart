//const nodemailer = require("nodemailer");

const sendMail = async (to, subject, body, attachments) => {
  const transporter = nodemailer.createTransport({
    host:process.env.mailserverhost,
    port: 587,
    secure: false,
    // console: true,
    // ignoreTLS: false,
   // requireTLS: true,
    auth: {
      user:process.env.mailserverid,
      pass: process.env.mailserverpassword,
    },
    tls: {
      rejectUnauthorized: false // This line trusts the self-signed certificate
  }
  });
 
  var mailOptions = {
    from: { name: "MegaMart", address: process.env.mailserverid},
    to: to,
    subject: subject,
    text: body,
    html: body,
  };
  if (attachments) mailOptions.attachments = attachments;

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Exception", error);
      // return res.status(500).json({
      //   code: "SERVER_ERROR",
      //   description: "something went wrong, Please try again",
      //   error: error,
      // });
    } else {
      console.info("Email sent: " + info.response);
      // return res.status(200).json({
      //   message: "Notification sent by mail successfully",
      //   data: info.response,
      // });
    }
  });
};

module.exports = sendMail;

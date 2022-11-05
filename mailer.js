const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'lsofa1204@gmail.com', // (замените звездочики на название вашего почтового ящика gmail) 
            pass: 'ibersxludoougndq' // (замените звездочики на название вашего почтового ящика) 
        }
    },
    {
        from: 'Рассылка <lsofa1204@gmail.com>' // (замените звездочики на название вашего почтового ящика gmail) 
    }
)

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) return console.log(err)
        console.log('Email sent: ', info)
    })
}

module.exports = mailer
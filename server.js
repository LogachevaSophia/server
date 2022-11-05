const nodemailer = require('nodemailer');
const cors = require('cors');

const mailer = require('./mailer')
var bodyParser = require('body-parser')

const express = require('express')
const app = express()
const port = 3002

function send_mail(email_to){
    const message = {
        to: email_to,
        subject: "We are testing",
        body: "это статья",
    }


    mailer(message) ;
}

app.use(
  cors({
    origin: 'http://127.0.0.1:3002',
    credentials: true,
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.use(express.json())
app.use(require("body-parser").json());

app.post('/mail', (req, res) => {
  console.log(req);
  send_mail(req.query.email);
  res.send(req.query.email);

})
app.get('/', (req, res) => {

res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


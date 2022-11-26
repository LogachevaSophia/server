const nodemailer = require('nodemailer');
const cors = require('cors');

const request = require("request");
const mailer = require('./mailer')
var bodyParser = require('body-parser')
const httpBuildQuery = require("http-build-query");


const mysql = require('mysql')
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "auth"
});

const express = require('express')
const app = express()
const port = 3002
const bitrix24Url = "https://property.bitrix24.ru/rest/1/e08ml252uxlxhrws/";

function send_mail(email_to) {
  const message = {
    to: email_to,
    subject: "Статья",
    html: "<li>Simple Estate</li>\
       <blockquote>\
        <p><b> Минимум для старта:</b>100.00 Р</p>\
        <p><b>Историческая доходность:</b> 10-14%</p>\
        <p><b>Частота выплат:</b> раз в квартал</p>\
        <p><b>Ликвидность: </b>выставляют на вторичный рынок и предлагают тем, кто уже инвестировал</p>\
        <p><b>Комиссия:</b></p>\
        <blockquote>\
          <div>\
            <li>Они берут единовременную комиссию 2% при покупке объекта и при его продаже.</li>\
            <li>Ежегодная комиссия за управление объектом составляет 1% от рыночной стоимости. Она взимается каждый месяц из арендных платежей и, если вдруг денег с аренды не хватит на комиссию, она перенесется на следующий месяц.</li>\
            <li>Ну и, если вы будете покупать через вторичный рынок или у другого инвестора, то с вас возьмут еще 2% от стоимости акций. </li>\
          </div>\
        </blockquote>\
        <p><b>Плюсы: </b></p>\
        <blockquote>\
          <div>\
            <li>Во-первых, они включены в реестр инвестиционных платформ ЦБ, что дает маломальские гарантие.</li>\
            <li>Во-вторых, у них действует система 1 АО=1 объект. Это значит, что в самом фонде не будет неиспользованных денег, который ждут своего часа - все уже работает. А также вы можете выбрать самые привлекательные объекты и инвестировать только в них.</li>\
          </div>\
        </blockquote>\
        <p><b>Минусы: </b></p>\
        <blockquote>\
          <div>\
            <li>Вы даете деньги на самому Simple Estate, а АО, которое они создают отдельно под каждый объект, и уже с этим АО вы подписываете договор инвестирования. Простым языком - вас можно легко кинуть. Не утверждаю, что именно это и планируют создатели, скорее всего они выбрали самую простую схему работы, но вам об этом знать надо.</li>\
          </div>\
        </blockquote>\
        </blockquote>",
  }


  mailer(message);
}

function createLead(template) {
  return new Promise((resolve, reject) => {
    request({
      url: `${bitrix24Url}/crm.lead.add?${httpBuildQuery(template)}`,
      json: true
    }, (error, response, body) => {
      if (error) reject(error);
      console.log('Лид создается');
    });
  })
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.use(express.json())
app.use(require("body-parser").json());

app.post('/mail', (req, res) => {
  console.log(req);
  send_mail(req.body.email);
  res.send("Hello");

})

app.post('/lead', (req, res) => {

  email = req.body.email;
  phone = req.body.phone;
  console.log(email);
  console.log(phone);
  const leadTemp = {
    "fields": {
      "TITLE": "Отправляем статью",
      "STATUS_ID": "NEW",
      "OPENED": "Y",
      "CONTACT_ID": 14681,
      "CURRENCY_ID": "RUB",
      "OPPORTUNITY": 0,
      "COMMENTS": "Тест для лида",
      "UTM_CAMPAIGN": email,
      "EMAIL": { email },
      "PHONE": { phone }
    }
  }
  createLead(leadTemp);
  res.send("Hello");

})

app.get('/', (req, res) => {

  res.send('Hello World!')
})

app.post('/signin', (req, res) => {


  /*con.query("SELECT MAX(buy_id) FROM buy", function (err, result, fields) {
    if (err) {
      console.log("I have problem with base");
    } 
  });*/
  console.log(req);
  con.query("select * from users where email="+ String(req.email), function (err, result, fields) {
    if (err) {
      console.log("I have problem with insert find application");
    }
  });

  res.send({
    token: 'test123'
  });
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


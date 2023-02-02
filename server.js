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
const bitrix24Url = "";

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
/*con.query("select * from users where email='test@mail.com'" , function (err, result, fields) {
  if (err) {
    console.log("I have problem with insert find application");
  }
  console.log(result[0]);
});*/





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

app.post('/signup', (req, res) => {
  try {
    con.query("SELECT MAX(user_id) FROM users", function (err, result, fields) {
      if (err) { }
      else {
        const str = "insert into users values(" + String(result[0]['MAX(user_id)'] + 1) + ",'" + String(req.body.email + "','" + String(req.body.name) + "','" + String(req.body.password) + "')");
        con.query(str, function (err, result, fields) {
          if (err) { }
          else {
            res.send({
              can: "1"
            });
          }
        });
      }
    });


  }
  catch {
    res.send({
      can: "-1"
    });
  }
})

app.post('/signin', (req, res) => {
  const str = "select * from users where email='" + String(req.body.email) + "'";
  con.query(str, function (err, result, fields) {
    if (err) {
    }
    else {
      //если совпадают пароли, то отправляем токен, в противном случае отпраляем -1
      try {
        if (req.body.password == result[0].user_password) {
          console.log("Пароли совпадают");
          res.send({
            token: result[0].user_id
          });
        }
        else {
          res.send({
            token: "-1"
          });
        }
      }
      catch {
        res.send({
          token: "-1"
        });
      }
    }


  });




})


function set_arr(params){
  setTimeout(function() {
    arr = params;
}, 2000);

}


app.post('/get_block', (req, res) => {
  let arr = []
  console.log("get block");
  console.log(req);

  /*const get_all = "select * from buy where user_id="+ String(req.body.user_id);*/
  /*get block
  blocks  video_id
  1         1
  1         2*/
  con.query("select max(block_id) from blocks", function (err, result, fields) {
    if (err) { }
    else {
      /*получаю все купленные блоки*/
      console.log(req);
      console.log("215 ",req.query['user_id']);
      const query = "select blocks from buy where user_id="+String(req.body['user_id'])+" and video=0";
      console.log(query);
      con.query(query, function(err, result,field){
        if (err){
          console.log("ошибка 1");
        }
        else{
          console.log("219 ",result);
          let arr_block = [];
          for (let i=0;i<result.length;i++){
            arr_block.push(result[i]['blocks']);
          }
          console.log("228",arr_block);
          /*arr_block=[1,2,5]
          идем по всем блокам, если он в списке то получаем его видео, если нет, то ищуме среи купленных, если и там нет, то загружаем превью*/
          con.query("select max(block_id) from blocks", function(err, result_new, field){
            if (err){console.log("ошибка 2");}
            else{
              console.log("230",result_new);
              for (let i=1;i<result_new[0]['max(block_id)']+1;i++){
                if (arr_block.indexOf(i)!= -1){
                  //блок есть в списке купленных
                  console.log("234, блок есть в списке купленных");
                  const get_block = "select vid.link, vid.video_description from buy b, blocks bl, video vid where b.blocks=bl.block_id and vid.video_id= bl.video_id and user_id="+String(req.body['user_id'])+" and video=0 and b.blocks="+String(i);
                  con.query(get_block, function (err, result_new_new, fields) {
                    if (err) {
                      console.log("ошибка 3");
                    }
                    else {                 
                      arr.push(result_new_new);
                      console.log("242, ",arr);
                    }
                    console.log("241 ",arr);
                    if (i==result_new[0]['max(block_id)']){
                      console.log("248, Это была последняя итерация");
                      res.send(arr);
                    }
                  })

                }
                else{
                  /*берем все купленные видео в этом блоке*/
                  const get_video = "select v.link, v.video_description from buy b, video v, blocks bl where b.user_id="+String(req.body['user_id'])+" and b.blocks=0 and b.video=v.video_id and b.video= bl.video_id and block_id="+String(i);
                  con.query(get_video, function(err, result_new_new, fields){
                    if (err){}
                    else{
                      arr.push(result_new_new);
                      console.log("261, ", arr);
                      console.log("267, ", i);
                      console.log("268", result[0]['max(block_id)']);
                      if (i==result_new[0]['max(block_id)']){
                        console.log("263, Это была последняя итерация");
                        console.log("264, ", arr);
                        res.send(arr);
                      }
                    }
                  });

                }
              }
            }
          });
        }
      });
      const max = result[0]['max(block_id)'];
      /*for (let i =1;i<max;i++){
        
        con.query(get_block, function (err, result_new, fields) {
          if (err) {
          }
          else {
            console.log("result_new = ", result_new);
            arr.push(result_new)
            console.log("arr1 = ", arr);
            if (arr.length == max-1){
              res.send(arr);
            }
          }
          console.log("arr2 = ", arr);
        })
      }*/

    }
    
  }
  );
  arr = [];


})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


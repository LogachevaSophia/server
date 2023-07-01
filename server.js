const nodemailer = require('nodemailer');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const request = require("request");
const mailer = require('./mailer')
var bodyParser = require('body-parser')
const httpBuildQuery = require("http-build-query");


const mysql = require('mysql')
const con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "auth"
});

const conBot = mysql.createPool({
  host: "127.0.0.1",
  user: "sophia",
  password: "12145142",
  database: "bot"
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
        <p><b>Минусы: </b></p>\
        <blockquote>\
          <div>\
            <li>Вы даете деньги на самому Simple Estate, а АО, которое они создают отдельно под каждый объект, и уже с этим АО вы подписываете договор инвестирования. Простым языком - вас можно легко кинуть. Не утверждаю, что именно это и планируют создатели, скорее всего они выбрали самую простую схему работы, но вам об этом знать надо.</li>\
          </div>\
        </blockquote>\
      </blockquote>\
      <li>Рентавед</li>\
      <blockquote>\
        <p><b>Минусы: </b></p>\
        <blockquote>\
          <div>\
            <li>никакой реальной информации, цифр, хотя бы расчетов, вы в интернете о них не найдете. Создатель всей этой истории, выкупает очень дешево помещения, ремонтирует и перепродает их вам в кооператив. А кооператив очень интересная сущность, в которой много ньюансов. Имея выкупленный и отремонтированный  объект, они не распродают по частям, зарабатывая еще больше, а продают его инвесторам, чтобы они заработали 50%. Зачем? Они говорят, что их главная задача - быстро заработать деньги, вытащить их и пойти покупать такие объекты дальше.</li>\
          </div>\
        </blockquote>\
      </blockquote>\
      <li>Активо</li>\
      <blockquote>\
        <p><b>Минусы: </b></p>\
        <blockquote>\
          <div>\
            <li>Комиссии не самые понятны и на деле трудно сказать сколько будут забирать УК</li>\
            <li>Есть фонды где только один крупный арендатор, например, Пятерочка. Но, если она съедет, то трудно представить, кто сможет арендовать там, где не выжила такая крупная сеть.</li>\
          </div>\
        </blockquote>\
      </blockquote>\
      <li>ПНК</li>\
      <blockquote>\
        <p><b>Минусы: </b></p>\
        <blockquote>\
          <div>\
            <li>Они сами строят склады, а существует есть риск того, что сметы могут завышаться.</li>\
            <li>Склад сдается одному якорному арендатору, а значит появляется риск снижения арендных ставок, ведь  если он съедет никто не знает сколько будет пустовать склад.</li>\
            <li>При покупке через 'А класс капитал' перед вашей доходностью встает еще одна УК, хоть комиссия у нее и небольшая.</li>\
          </div>\
        </blockquote>\
      </blockquote>\
      <li>Альфа Капитал</li>\
      <blockquote>\
        <p><b>Минусы: </b></p>\
        <blockquote>\
          <div>\
            <li>С учетом того, что рентный доход не будет приносить больше 11-14 процентов, минимальная комиссия в 2,3% - это много.</li>\
            <li>Альфа-Капитал находится в одном в одном консорциуме с X5 Retail Group, из-за чего существует возможность недобросовестного управления. </li>\
            <li>Если с локации съедет Пятерочка, то вряд ли кто-то сможет выжить в этом месте.</li>\
            </div>\
        </blockquote>\
      </blockquote>\
      <li>Парус</li>\
      <blockquote>\
        <p><b>Минусы: </b></p>\
        <blockquote>\
          <div>\
            <li>Склады построены на кредитный деньги, так что при неблагоприятном исходе возможны потери всего имущества компании.</li>\
            <li>При этом никакой повышенной доходности за этот риск нету, доходность ПНК со схожей концепцией выше на 3-4%. </li>\
            <li>Список инвестиционных инструментов, в которые УК может вкладывать средства фонда максимально широкий - от акций, до векселей кредитных.</li>\
            <li>Доступно только для квалифицированных инвесторов.</li>\
            </div>\
        </blockquote>\
      </blockquote>\
        ",
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



app.use(fileUpload({
  createParentPath: true
}));


const robokassa = require('node-robokassa');
const robokassaHelper = new robokassa.RobokassaHelper({
  merchantLogin: 'Rentmarket',
  hashingAlgorithm: 'sha256',
  password1: 'A07MnGoIjP4BcyK9sa8c', /*тест */
  password2: 'a2Cu9YwN6rhm25IIKCBo',
  // password1: 'uH2mrEx63gg4dGoRoiK1', /*Не тест*/
  // password2: 'KwP7uOehgY61bPXwk04j',
  testMode: true,
  resultUrlRequestMethod: 'GET'
});


app.use(express.json())
app.use(require("body-parser").json());

app.post('/mail', (req, res) => {
  console.log(req);
  send_mail(req.body.email);
  res.send("Hello");

})




function createUrl(invId, productId, amount = 100) {
  // const amount=100;


  const options = {
    invId: invId,
    outSumCurrence: 'RUB',
    isTest: true,
    userData: {
      productId: productId,
    }
  }

  const paymentUrl = robokassaHelper.generatePaymentUrl(amount, 'Оплата информации', options);
  return paymentUrl;

}

function createUrkkFotVideoService(invId, videoservice, amount = 100) {
  const options = {
    invId: invId,
    outSumCurrence: 'RUB',
    isTest: true,
    userData: {
      videoservice: videoservice,
    }
  }

  const paymentUrl = robokassaHelper.generatePaymentUrl(amount, 'Оплата информации', options);
  return paymentUrl;
}


// app.get('/getpaymenturl', (req, res) => {

//   /*Все видео, которые я купила в данном блоке*/


//   con.query(`select video_id,video_link, video_description
//   from buys, videos
//   where block=1 and user_id=1
//   and buys.block = videos.block_id`, function (err, result, fields){
//     if (err){res.send([]);}
//     else{
//       let img = result;
//       let img_new = [];
//       for (let i = 0; i < result.length; i++) {
//         let dop = img[i];
//         dop.buy_link = createUrl(1011,dop.id);
//         //img.push({ id: i, link: "https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg", description: 'adhvkn', buyLink: createUrl(1011, i) })

//       }
//       console.log(img);
//       res.send({img:img});
//     }
//   });

app.get('/getnobuy', (req, res) => {
  const user_id = req.query.user_id
  const id = req.query.id
  con.query(`with tab1 as (
    select video_id,video_link, img_id, video_description, block_id
    from buys, videos
    where block=${id} and user_id=${user_id} and paid=1
    and buys.block = videos.block_id
    union all (
  select video_id, video_link, img_id, video_description, block_id
  from buys, videos
  where user_id=${user_id} and paid=1 and video=video_id and block_id=${id})),
     tab2 as (
     /*все видео в этом блоке*/
     select *
     from videos
     where block_id = ${id}),
     tab3 as (
     select * from tab2
     where (video_id, video_link, img_id, video_description, block_id) not in (select * from tab1))
     select tab3.img_id as id,img_link as img
     from tab3, img
     where tab3.img_id=img.img_id     `, function (err, result, fields) {
    if (err) {
      res.send([]);
    }
    else {
      let img = result;
      for (let i = 0; i < result.length; i++) {
        let dop = img[i];
        dop.buy_link = createUrl(1011, dop.id);
        //img.push({ id: i, link: "https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg", description: 'adhvkn', buyLink: createUrl(1011, i) })

      }
      res.send(img);
    }

  });



})




// const img = {img:[
//   {
//     id: 1,
//     link: "https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg",
//     description: "descaejrbgfvabf a;ekrjgnkaenr a;jekrg  aek;rjbgk.ajeg",
//   },
//   {
//     id: 2,
//     link: "https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg",
//     description: "descaejrbgfvabf a;ekrjgnkaenr a;jekrg  aek;rjbgk.ajeg",
//   },
//   {
//     id: 3,
//     link: "https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg",
//     description: "descaedfdb ebrbgfvabf a;ekrjgnkaenr a;jekrg  aek;rjbgk.ajeg",
//   },

// ]};

// })

app.get('/getHistory', (req, res) => {
  const user_id = req.query.user_id;
  con.query(`select buy_id,video_link
  from buys, videos
  where user_id=${user_id} and block=0 and paid=1
  and video=video_id
  union all(
  
  select buy_id,concat('http://localhost:3000/block/',block) as link
  from buys
  where user_id=${user_id} and video=0 and paid=1)`, function (err, result, fields) {
    if (err) {
      res.send([]);
    }
    else {

      res.send(result);
    }
  })
})
app.get('/getImages', (req, res) => {
  con.query(`select * from img where img_id!=0`, function (err, results, fileds) {
    if (err) {
      console.log(err);

    }
    else {
      res.send({data: results});
    }
  })
})
app.get('/getBlocks', (req, res) => {
  con.query(`select * from blocks where block_id!=0`, function (err, results, fileds) {
    if (err) {
      console.log(err);

    }
    else {
      res.send({data: results});
    }
  })
})
app.get('/AddNewBlock', (req, res) => {
  console.log(req.query.img_id);
  const {img_id, description} = req.query;
  console.log(img_id);
  con.query(`select max(block_id) as block_id from blocks`, function (err, results, fileds) {
    if (err) {
      console.log(err);

    }
    else {
      
      con.query(`insert into blocks values (${results[0]['block_id']+1},${img_id}, '${description}')`, function (err1, results1, fileds1) {
        if (err1){
          console.log(err1);
        }
        else{
          res.send({});
        }
      });
      
    }
  })
})

app.get('/AddNewVideo', (req, res) => {
  console.log(req.query.img_id);
  const {img_id, video_link,video_description, block_id} = req.query;
  console.log(img_id);
  con.query(`select max(video_id) as video_id from video`, function (err, results, fileds) {
    if (err) {
      console.log(err);

    }
    else {
      
      con.query(`insert into video values (${results[0]['video_id']+1},'${video_link}',${img_id}, '${video_description}', ${block_id})`, function (err1, results1, fileds1) {
        if (err1){
          console.log(err1);
        }
        else{
          res.send({});
        }
      });
      
    }
  })
})
app.get('/AddNewImg', (req, res) => {
  const {img_link} = req.query;
  con.query(`select max(img_id) as img_id from img`, function (err, results, fileds) {
    if (err) {
      console.log(err);

    }
    else {
      console.log(`insert into img values (${results[0]['img_id']+1},'${img_link}')`);
      con.query(`insert into img values (${results[0]['img_id']+1},'${img_link}')`, function (err1, results1, fileds1) {
        if (err1){
          console.log(err1);
        }
        else{
          res.send({});
        }
      });
      
    }
  })
})





app.get('/getPaymentBlock', (req, res) => {


  const user = req.query.user_id;
  const idBlock = req.query.id;

  con.query(`select MAX(buy_id) as id from buys`, function (err, results, fileds) {
    if (err) { console.log('error'); }
    else {

      const id = results[0].id;


      con.query(`insert into buys values(${id + 1}, ${user}, 0,${idBlock},0)`, function (err, result, fileds) {
        if (err) {
          console.log('error');
        }
        else {

          const url = createUrl(id + 1, idBlock);

          res.send({ link: url });

        }
      })

      /**/
    }
  })





})


app.get('/getVideosInBlock', (req, res) => {

  con.query(`select video_id,video_link as src, video_description
  from buys, videos
  where block=${req.query.id} and user_id=${req.query.user_id} and paid=1
  and buys.block = videos.block_id
  union all (
select video_id, video_link as src, video_description
from buys, videos
where user_id=${req.query.user_id} and paid=1 and video=video_id and block_id=${req.query.id})`, function (err, result, fields) {
    if (err) { res.send([]); }
    else {
      let img = result;
      let img_new = [];
      for (let i = 0; i < result.length; i++) {
        let dop = img[i];
        dop.buy_link = createUrl(1011, dop.id);
        //img.push({ id: i, link: "https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg", description: 'adhvkn', buyLink: createUrl(1011, i) })

      }

      res.send({ videos: img });
    }
  });


  // const videos = [{ id: 1, src: 'https://www.youtube.com/embed/tQVqagCOxLA', description: 'Описание' },
  // { id: 2, src: 'https://www.youtube.com/embed/tQVqagCOxLA', description: 'Описание' }];

  // res.send({ videos: videos });
})
app.get('/getPaymentUrlForVideo', (req, res) => {
  const user_id = req.query.user_id;
  const video_id = req.query.video_id;
  con.query(`select MAX(buy_id) as id from buys`, function (err, results, fileds) {
    if (err) { console.log('error'); }
    else {

      const id = results[0].id;
      console.log(`id=${id}`);

      console.log(`insert into buys values(${id + 1}, ${user_id}, ${video_id},0,0)`);
      con.query(`insert into buys values(${id + 1}, ${user_id}, ${video_id},0,0)`, function (err, result, fileds) {
        if (err) {
          console.log(err);

        }
        else {
          const options = {

            invId: id+1,
            isTest: true,
            outSumCurrence: 'RUB',
            userData: {
              video_service: 1,
            }
          }
          const price = 100;

          // const url = createUrl(id + 1001, video_id);
          const url = createUrkkFotVideoService(id+1, 1, price)
          console.log(`url=${url}`);

          res.send({ link: url });

        }
      })

    }
  })
});

app.get('/success', (req, res) => {
  const invId = req.query.InvId;
  console.log(req);
  const productId = req.query.Shp_productId;
  if (invId > 1000) {
    /*купили видеo */
    con.query(`update buys 
    set paid = 1 
    where buy_id=${invId - 1000} and video=${productId}`, function (err, results, fileds) {
      if (err) {
        console.log('error');
      }
    })

  }
  else {
    con.query(`update buys 
    set paid=1
    where buy_id=${invId} and block=${productId}`, function (err, results, fileds) {
      if (err) {
        console.log('error');
      }
    })

  }
})

app.get('/getAllBlocks', (req, res) => {

  con.query(`select blocks.block_id as id, blocks.block_description as description, img.img_link as link
  from blocks, img
  where blocks.img_id=img.img_id;`, function (err, result, fields) {
    if (err) {
      res.send([]);
    }
    else {

      res.send(result);
    }


  })
  // const videos = [
  //   {
  //     id: 1,
  //     link:  'https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg',
  //     description: "Как правильно вкладываться",
  //   },
  //   {
  //     id: 2,
  //     link:  'https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg',
  //     description: "Куда лучше вкладываться",
  //   },
  //   {
  //     id: 3,
  //     link:  'https://ucarecdn.com/83e1d423-ddf3-433c-9c71-3a1e6f255984/noroot.jpg',
  //     description: "Зачем вкладываться",
  //   },
  // ]


})


app.get('/getuser', (req, res) => {
  const log = req.query.log;
  const pas = req.query.pas;

  console.log(log);

  con.query(`select * from users where email='${log}' and pass='${pas}'`, function (err, result, fields) {
    if (err) {
      console.log('errorr');
    }
    else {
      if ((result === undefined) || (result.length == 0)) {
        console.log('err');
        res.send({ id: null, name: '', role: '' });
      }
      else {
        console.log(result);
        res.send({ id: result[0].user_id, name: result[0].user_name, role: result[0].user_role });

      }
    }
  });
});

//выуже купили
app.get('/test', (req, res) => {
  const { user } = req.query;
  con.query(`select a.block_id as id, blocks.block_description as description, img.img_link as link from (
    select case when block=0 then block_id else block end block_id from buys
    left join video on buys.video=video.video_id
    where buys.User_id=${user} and buys.confirm=1) a
    left join blocks on a.block_id=blocks.block_id
    left join img on blocks.img_id = img.img_id`, function (err, result, fields) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }

  })
});

app.get('/getNoBuyBlocks', (req, res) => {
  const { user_id } = req.query;
  con.query(`select a.block_id as id, blocks.block_description as description, img.img_link as link from (select block_id from blocks where (block_id) not in ( SELECT id FROM allbuysforallusers where user_id=${user_id}) and block_id!=0) a left join blocks on blocks.block_id=a.block_id left join img on img.img_id=blocks.img_id`, function (err, result, fields) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})

//вы приобрели на странице блока
app.get('/buy', (req, res) => {
  const { user, block } = req.query;
  con.query(`select distinct video_id as id, video_link as src from (
    select * from buys where user_id=${user} and block=${block} and confirm=1
  ) a
  left join video on video.block_id=a.block
  union all(
  select a.video as id, video.video_link as src from (
  select * from buys where user_id=${user} and block=0 and confirm=1) a
  left join video on video.video_id=a.video
  where video.block_id=${block})
  `, function (err, result, fields) {
    if (err) {

    }
    else {
      res.send(result);
    }

  })
})
//еще в этом блоке на странице блока
// app.get('/nobuyinblock', (req, res) => {
//   const { user, block } = req.query;
//   con.query(`select a.id, img.img_id as src from(
//     select a.id from(
//     select  video.video_id as id from blocks
//     left join video on video.block_id=blocks.block_id
//     where blocks.block_id = ${block}) a
//     where a.id not in (

//     select a.id from (
//     select distinct video_id as id, video_link as src from (
//       select * from buys where user_id=${user} and block=${block}
//     ) a
//     left join video on video.block_id=a.block
//     union all(
//     select a.video as id, video.video_link as src from (
//     select * from buys where user_id=${user} and block=0) a
//     left join video on video.video_id=a.video
//     where video.block_id=${block})) a)) a 
//     left join video on video.video_id=a.id
//     left join img on video.img_id=img.img_id)
//   `, function (err, result, fields) {
//     if (err) {

//     }
//     else {
//       res.send(result);
//     }

//   })
// })

app.get('/nobuyinblock', (req, res) => {
  const { user, block } = req.query;
  con.query(`select block, src, description, id, img.img_link from (SELECT block, src as src, description as description, video_id as id  from (select * from (SELECT blocks.block_id as block, video.video_link as SRC, video.video_description as DESCRIPTION,
     video.video_id FROM blocks left join video on video.block_id=blocks.block_id WHERE video.video_link IS NOT NULL) A 
     where (BLOCK, SRC, DESCRIPTION, VIDEO_ID) NOt IN (SELECT BLOCK, SRC, DESCRIPTION, VIDEO_ID FROM getbuysforuser where user_id=${user}))
   A where A.block=${block}) B left join video on video.video_id=B.id left join img on img.img_id=video.img_id`, function (err, result, fields) {
    if (err) {
      console.log('err');
    }
    else {
      res.send(result)
    }

  })
}
)
//вся таблица для редактирваония
app.get('/getallforchange', (req, res) => {

  const { user, block } = req.query;
  conBot.query(`select * from data where company not like '%Купить все%' and company not like'%Купить всю%'
  `, function (err, result, fields) {
    if (err) {

    }
    else {
      res.send(result);
    }

  })
})

app.get('/getitem', (req, res) => {

  const { id } = req.query;
  conBot.query(`select * from data where id=${id}
  `, function (err, result, fields) {
    if (err) {

    }
    else {
      res.send(result);
    }

  })
})
app.get('/changeitem', (req, res) => {

  const { id, company, employee, category, sphere, squareFrom, squareTo, comment, minHeight, minElectricity, purchasing, line, entry, trafic, development, subArenda, firstFloor, secondFloor, cokol, underground } = req.query;
  console.log(id);
  console.log(sphere);


  conBot.query(`update data set company='${company}', employee='${employee}', category='${category}', sphere='${sphere}', squareFrom=${squareFrom}, squareTo=${squareTo},
  comment='${comment}',minHeight=${minHeight},minElectricity=${minElectricity}, purchasing='${purchasing}',line='${line}',entry='${entry}',traffic='${trafic}',development='${development}',
  subArenda='${subArenda}',firstFloor='${firstFloor}',secondFloor='${secondFloor}',cokol='${cokol}',underground='${underground}' where id=${id}
  `, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.send({ res: 'Ошибка в данных' });
    }
    else {
      console.log('ok');
      res.send({ res: 'В базу внесены изменения' });
    }

  })
})

app.get('/maxitem', (req, res) => {



  conBot.query(`select max(id) as id from data `, function (err, result, fields) {
    if (err) {

    }
    else {
      console.log(result);
      res.send(result[0]);
    }
  })
})
app.get('/additem', (req, res) => {

  const { id, company, employee, category, sphere, squareFrom, squareTo, comment, minHeight, minElectricity, purchasing, line, entry, trafic, development, subArenda, firstFloor, secondFloor, cokol, underground } = req.query;



  conBot.query(`insert into data values( '${company}', '${employee}','${category}', '${sphere}',${squareFrom}, ${squareTo},'${comment}', ${minHeight}, ${minElectricity},'${purchasing}', '${line}', '${entry}', '${trafic}','${development}', '${subArenda}', '${firstFloor}', '${secondFloor}', '${cokol}', '${underground}', ${id}) `, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.send({ res: 'Ошибка в данных' });
    }
    else {
      res.send({ res: 'В базу внесены изменения' });
      console.log('okey');
    }
  })
})

app.get('/deleteitem', (req, res) => {

  const { id } = req.query;
  console.log('hello');
  console.log(id);


  conBot.query(`delete from data where id=${id}`, function (err, result, fields) {
    if (err) {
      console.log(err);
    }
    else {

      console.log('okey delete');
    }
  })
})















app.get('/registerUser', (req, res) => {

  const email = req.query.email;
  const pas = req.query.pas;
  const name = req.query.name;
  con.query("SELECT MAX(user_id) FROM users", function (err, result, fields) {
    if (err) { }
    else {

      con.query(`insert into users values (${result[0]['MAX(user_id)'] + 1}, '${name}','${pas}','${email}','user');`, function (err, results, fileds) {
        if (err) { }
        else {
          res.send({ id: result[0]['MAX(user_id)']+1, name: name, role: 'user' })
        }
      })
    }
  })

})

app.post('/lead', (req, res) => {

  email = req.body.email;
  phone = req.body.phone;

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


})

app.get('/', (req, res) => {

  res.send('Hello World!')
})




function set_arr(params) {
  setTimeout(function () {
    arr = params;
  }, 2000);

}



app.post('/block_number', (req, res) => {

  str = "select link, video_description from (\
          select link, video_description \
          from video, blocks \
          where video.video_id = blocks.video_id and block_id = " + String(req.body['number']) + " ) b \
        where (link, b.video_description) not in ( \
          select link, video_description  \
          from (\
            select b.link, b.video_description \
            from (  \
              select a.video, blocks.block_id, v.link, v.video_description \
              from ( \
                select * \
                from buy \
                where blocks = 0 and user_id=" + String(req.body['user_id']) + " \
                ) a, blocks, video v\
                where a.video = blocks.video_id and  a.video=v.video_id and blocks.block_id =" + String(req.body['number']) + "\
            ) b\
          ) c \
        Union ( \
		      select h.link, h.video_description  \
          from (   \
			      select v.link, v.video_description \
            from (  \
				    select * \
              from buy \
              where video= 0 and user_id="+ String(req.body['user_id']) + ' \
            ) a, blocks, video v \
            where a.blocks = blocks.block_id and blocks.block_id='+ String(req.body['number']) + '  and blocks.video_id=v.video_id and v.video_description not in ("preview") \
		      ) h\
        ))';
  con.query(str, function (err, result, fields) {
    if (err) {
      console.log("Ошибка исправленного");
    }
    else {
      console.log("********************************");
      console.log(result);
      res.send(result)
    }
  });
})




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
      console.log("215 ", req.query['user_id']);
      const query = "select blocks from buy where user_id=" + String(req.body['user_id']) + " and video=0";
      console.log(query);
      con.query(query, function (err, result, field) {
        if (err) {
          console.log("ошибка 1");
        }
        else {
          console.log("219 ", result);
          let arr_block = [];
          for (let i = 0; i < result.length; i++) {
            arr_block.push(result[i]['blocks']);
          }
          console.log("228", arr_block);
          /*arr_block=[1,2,5]
          идем по всем блокам, если он в списке то получаем его видео, если нет, то ищуме среи купленных, если и там нет, то загружаем превью*/
          con.query("select max(block_id) from blocks", function (err, result_new, field) {
            if (err) { console.log("ошибка 2"); }
            else {
              console.log("230", result_new);
              for (let i = 1; i < result_new[0]['max(block_id)'] + 1; i++) {
                if (arr_block.indexOf(i) != -1) {
                  //блок есть в списке купленных
                  console.log("234, блок есть в списке купленных");
                  const get_block = "select vid.link, vid.video_description from buy b, blocks bl, video vid where b.blocks=bl.block_id and vid.video_id= bl.video_id and user_id=" + String(req.body['user_id']) + " and video=0 and b.blocks=" + String(i);
                  con.query(get_block, function (err, result_new_new, fields) {
                    if (err) {
                      console.log("ошибка 3");
                    }
                    else {
                      arr.push(result_new_new);
                      console.log("242, ", arr);
                    }
                    console.log("241 ", arr);
                    if (i == result_new[0]['max(block_id)']) {
                      console.log("248, Это была последняя итерация");
                      res.send(arr);
                    }
                  })

                }
                else {
                  /*берем все купленные видео в этом блоке*/
                  /* const get_video = "select v.link, v.video_description from buy b, video v, blocks bl where b.user_id=" + String(req.body['user_id']) + " and b.blocks=0 and b.video=v.video_id and b.video= bl.video_id and block_id=" + String(i);*/
                  const get_video = "select case \
                 when exists( \
                   select v.link \
                   from buy b, video v, blocks bl where b.user_id="+ String(req.body['user_id']) + " and b.blocks=0 and b.video=v.video_id \
                   and b.video= bl.video_id and block_id="+ String(i) + ") \
                  then (select v.link \
                    from buy b, video v, blocks bl where b.user_id="+ String(req.body['user_id']) + " and b.blocks=0 and b.video=v.video_id \
                    and b.video= bl.video_id and block_id="+ String(i) + ") \
                  else (select v.link from video v, preview pr where pr.id_video=v.video_id and pr.id_block="+ String(i) + ") \
                  end as link, \
                  case when exists (select v.video_description \
                    from buy b, video v, blocks bl where b.user_id="+ String(req.body['user_id']) + " \
                    and b.blocks=0 and b.video=v.video_id and b.video= bl.video_id and block_id="+ String(i) + ") \
                    then (select v.video_description \
                      from buy b, video v, blocks bl where b.user_id="+ String(req.body['user_id']) + " \
                      and b.blocks=0 and b.video=v.video_id and b.video= bl.video_id and block_id="+ String(i) + ") \
                      else (select v.video_description from video v, preview pr where pr.id_video=v.video_id and pr.id_block="+ String(i) + ") \
                      end as video_description \
                      from dual";

                  con.query(get_video, function (err, result_new_new, fields) {
                    if (err) {
                      console.log("ошибка большого запроса");
                    }
                    else {
                      try {
                        console.log(result_new_new);


                        arr.push(result_new_new);

                        console.log("261, ", arr);
                        console.log("267, ", i);

                        if (i == result_new[0]['max(block_id)']) {
                          console.log("263, Это была последняя итерация");
                          console.log("264, ", arr);
                          res.send(arr);
                        }
                      }
                      catch {
                        res.send([]);
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


app.get('/sphere', (req, res) => {
  const sphere = ['Автотовары',
    'Автосервис',
    'Торговля автомобилями',
    'Алкоголь',
    'Анализы',
    'Аптеки, оптики, ортопедия',
    'Банки, финансы',
    'Вендинг, автоматические ПВЗ',
    'Даркстор',
    'Детские товары',
    'Зоотовары',
    'Кафе, ресторан, общепит',
    'Клиентский офис',
    'Книги и канцтовары',
    'Коворкинг',
    'Косметика, парфюмерия',
    'Медицина',
    'Одежда, обувь, аксессуары',
    'Пекарни, кондитерские магазины',
    'Продукты',
    'Пункты выдачи заказов',
    'Салоны красоты, медицина красоты',
    'Сексшоп',
    'Спорт, здоровье',
    'Табак',
    'Техника, электроника',
    'Услуги, быт',
    'Хозтовары, ремонт, мебель',
    'Цветы, подарки',
    'Ювелирка'
  ];
  console.log('in sphere');
  var resul = []
  for (let i = 0; i < sphere.length; i++) {
    conBot.query(`select Company as title, SquareFrom as squarefrom, SquareTo as squareto from bot.Data where Upper(Category) like '%${sphere[i].toUpperCase()}%' order by id`, function (err, result, fields) {
      if (err) {
        console.log(err)
      }
      else {
        resul.push({ id: i, title: sphere[i], data: result });
        if (i + 1 == sphere.length) {
          res.send({ data: resul });
        }
      }
    });


  };

})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


const express = require('express')
const app = express();
const conn = require("./db/conn")
const appointmentService = require('./services/appointmentService')



app.use(express.static(__dirname + '/public'))

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.set('view engine', 'ejs')


app.get('/',(req,res)=>{
    res.render('index')
})


app.get('/cadastro', (req, res) => {
    res.render("create")
})

app.post('/create', async (req, res) => {
   const status = await appointmentService.create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time,
        )

        if(status){
            res.redirect('/cadastro')
        }else{
            res.send('Ocorreu uma falha!')
        }
})

app.get ('/getCalendar',async (req,res) =>{

    const appointment = await appointmentService.GetAll(false);
    res.json(appointment);

})


 app.get('/event/:id',async (req,res)=>{
     const appointment = await appointmentService.GetById(req.params.id)
     console.log(appointment)
    res.render("event", {appo: appointment});
 })

 app.post("/finish",async(req,res)=>{
    const id = req.body.id;
    const result = await appointmentService.Finish(id);

    res.redirect('/');
 });

 app.get('/list',async(req,res)=>{
     
     const appos = await appointmentService.GetAll(true);
     res.render('list',{appos})
 })

 app.get("/searchresult",async(req,res)=>{
     console.log(req.query.search);
     const appos= await appointmentService.search(req.query.search)
     res.render("list",{appos})
 })

const  pollTime = 1000 * 60 * 5;
 setInterval(async()=>{
  await appointmentService.SendNotification();
 },pollTime)


app.listen(3000)
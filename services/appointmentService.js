const appointment = require("../models/Appointment")
const mongoose = require('mongoose')
const Appo = mongoose.model('Appointment', appointment)
const AppointmentFactory = require('../factories/AppointmentFactory')
const mailer = require('nodemailer');

class appointmentService {
    async create(name, email, description, cpf, date, time) {
        const newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false,
        })
        try {
            await newAppo.save();
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }

    }
    async GetAll(showFinished) {
        if (showFinished) {
            return await Appo.find();
        } else {
            const appos = await Appo.find({ 'finished': false });
            const appointments = [];

            appos.forEach(appointment => {
                if (appointment.date != undefined) {
                    appointments.push(AppointmentFactory.Build(appointment))
                }

            });
            return appointments;
        }

    }
    async GetById(id) {
        try {
            const event = await Appo.findOne({ _id: id })
            return event
        } catch (err) {
            console.log(err)

        }


    }
    async Finish(id) {
        try {
            await Appo.findByIdAndUpdate(id, { finished: true });
            return true
        } catch (err) {
            console.log(err);
            return false
        }

    }
    async search(query) {
        try {
            const appos = await Appo.find().or([{ email: query }, { cpf: query }])
            return appos;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    async SendNotification() {
        const appos = await this.GetAll(false);

        const transporter = mailer.createTransport({
            host:"smtp.mailtrap.io",
            port:25,
            auth:{
             user:"8f0ee5bd28b7f2",
             pass:"5deddb0cca78da"
            }
        });

      appos.forEach(async app => {

            const date = app.start.getTime();
            const hour = 1000 * 60 * 60;
            const gap = date-Date.now(); 

            if(gap <= hour){
               if(!app.notified){
                 await Appo.findByIdAndUpdate(app.id,{notified: true})
                   
                    transporter.sendMail({
                        from:"<testeagenda@guia.com.br>",
                        to: app.email,
                        subject: "Sua consulta vai acontecer em breve",
                        text:"sua consulta vai acontecer em 1 hora!"
                    }).then(() => {

                    }).catch(err => {

                    })
                   
               }

              
                
            }
        })
    }

}



module.exports = new appointmentService();
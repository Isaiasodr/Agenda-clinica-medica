class AppointmentFactory{

    Build(simpleappointment){
       
        const day = simpleappointment.date.getDate()+1;
        const month = simpleappointment.date.getMonth();
        const year = simpleappointment.date.getFullYear();
        const hour = Number.parseInt(simpleappointment.time.split(":")[0]);
        const minutes =Number.parseInt(simpleappointment.time.split(":")[1]);

        const startDate = new Date(year, month,day,hour,minutes,0,0);
      /*   startDate.setHours(startDate.getHours()-3) */

        const appo = {
            id: simpleappointment._id,
            title: simpleappointment.name + "-" + simpleappointment.description,
            start: startDate,
            end: startDate,
            notified: simpleappointment.notified,
            email:simpleappointment.email
        }
        return appo;
    }
}
module.exports = new AppointmentFactory();
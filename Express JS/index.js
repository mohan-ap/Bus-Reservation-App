const express = require('express')
const bodyParse = require('body-parser')
const app = express();
const adminRoute = require('./routes/admin');
const userRoute = require('./routes/user');
const cros = require('cors');
const paymentRoute = require('./routes/payment');
const cron = require('node-cron');
const { Bus, Seats } = require('./model/bus-model');
const moment = require('moment')

app.use(bodyParse.json())
app.use(bodyParse.urlencoded({ extended: true }))
app.use(cros());
app.use(adminRoute);
app.use(userRoute);
// app.use(paymentRoute);

cron.schedule('* * * * *', async () => {
  const currentDate = moment();
  const query = { boardingTime: { $lt: currentDate } };
  const buses = await Bus.find(query);
  console.log(buses);
  const deleteResult = await Bus.deleteMany(query);
  console.log(`Deleted ${deleteResult.deletedCount} buses`);

  for (const doc of buses) {
    const id = doc._id;
    console.log(id);
    const deleteSeats = await Seats.deleteMany({ bus: id });
    console.log(`Deleted ${deleteSeats.deletedCount} seats`);
  }
});
app.listen(8080, () => {
  console.log("Listening to port", 8080);
});

module.exports = app;

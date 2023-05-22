const express = require('express');
const router = express.Router();
const { Bus, Seats, Ticket } = require('../model/bus-model')
const url = require('../config/db.config')
const cron = require('node-cron');


const mongodb = require('mongodb');
const { send } = require('process');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const client = new MongoClient(url, { useUnifiedTopology: true, useUnifiedTopology: true });

const db = client.db('bus-reservation')



router.post('/add-bus', async (req, res) => {
  const seats = req.body.numberOfSeats;
  const boardingTime = new Date(req.body.boardingTime);
  const droppingTime = new Date(req.body.droppingTime);

  const istBoardingTime = boardingTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDroppingTime = droppingTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const durationInMilliseconds = droppingTime - boardingTime;
  const durationHours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));

  console.log('Duration:', durationHours, 'hours');

  const bus = new Bus({
    busName: req.body.busName,
    source: req.body.source,
    destination: req.body.destination,
    boardingTime: istBoardingTime,
    droppingTime: istDroppingTime,
    duration: durationHours,
    numberOfSeats: req.body.numberOfSeats,
    price: req.body.price
  });


  try {
    const savedBus = await bus.save();
    const busId = savedBus._id;
    const busName = savedBus.busName;
    const busSeats = [];
    for (let i = 1; i <= seats; i++) {
      busSeats.push({
        bus: busId,
        busName: busName,
        seatNumber: i,
        status: true,
        price: req.body.price,
        selected: false
      });
    }
    const savedSeats = await Seats.insertMany(busSeats);
    if (savedSeats)
      res.status(200).send({ message: "Bus Created Sucessfully", Addedbus: savedBus });

  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while creating bus');
  }
});

router.get('/buses', async (req, res) => {
  try {
    const buses = await Bus.find();
    if (buses.length === 0) {
      return res.send({ message: "No Buses Available" });
    } else {
      res.status(200).json(buses);
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Please check your input" });
  }
})

router.delete('/delete-bus/:id', async (req, res) => {

  const busId = req.params.id;

  try {
    const deleteBus = await Bus.findByIdAndDelete({ _id: busId })
    if (!deleteBus) {
      return res.send({ message: `${busId} was not present !!!` });
    }
    const deleteSeats = await Seats.deleteMany({ bus: busId });

    if (deleteSeats) {
      res.send({ message: "Bus Delete Sucessfully !!!" });
    }
  } catch (error) {
    res.status(401).send({ message: "Give Valid Data or Check inputs" });
  }
})

router.put('/update-status', async (req, res) => {
  const seatId = req.body.id;
  const status = req.body.status;
  console.log(seatId)
  console.log(status)
  try {
    const upadatedSeat = await Seats.findByIdAndUpdate(seatId, { status: status }, { new: true });
    if (!upadatedSeat) {
      return res.status(401).send({ message: "Not updated please check your inputs" })
    }
    if (status === true) {
      const update1 = { $inc: { numberOfSeats: +1 } };
      const updateSeats = await Bus.updateOne(update1);

    } else {
      const update1 = { $inc: { numberOfSeats: -1 } };
      const updateSeats = await Bus.updateOne(update1);

    }

    res.status(200).send({ message: "Status Updated Successfully !!!" })
  } catch (error) {
    res.status(500).send({ message: "Internal server error !!!" })
  }
})

router.get('/get-users', async (req, res) => {
  try {
    const usersData = await Ticket.find();
    if (usersData.length === 0) {
      res.status.send({ message: " No users was found" });
    }
    res.status(200).send(usersData)
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }

});

router.put('/update-bus/:id', async (req, res) => {
  const id = req.params.id;
  const seats = req.body.numberOfSeats;
  const boardingTime = new Date(req.body.boardingTime);
  const droppingTime = new Date(req.body.droppingTime);

  const istBoardingTime = boardingTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDroppingTime = droppingTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const durationInMilliseconds = droppingTime - boardingTime;
  const durationHours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));

  console.log('Duration:', durationHours, 'hours');

  const updatedBus = {
    busName: req.body.busName,
    source: req.body.source,
    destination: req.body.destination,
    boardingTime: istBoardingTime,
    droppingTime: istDroppingTime,
    duration: durationHours,
    numberOfSeats: req.body.numberOfSeats,
    price: req.body.price
  };

  try {
    const updatedBusResult = await Bus.findByIdAndUpdate(id, updatedBus);

    if (!updatedBusResult) {
      return res.status(404).send({ message: 'Bus not found' });
    }

    const busSeats = [];
    for (let i = 1; i <= seats; i++) {
      busSeats.push({
        bus: id,
        busName: updatedBusResult.busName,
        seatNumber: i,
        status: true,
        price: req.body.price,
        selected: false
      });
    }

    const updatedSeatsResult = await Seats.deleteMany({ bus: id });
    const savedSeats = await Seats.insertMany(busSeats);

    if (!updatedSeatsResult || !savedSeats) {
      return res.status(500).send({ message: 'Error occurred while updating bus seats' });
    }

    res.status(200).send({ message: 'Bus and seats updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'An error occurred while updating the bus' });
  }
});

module.exports = router;
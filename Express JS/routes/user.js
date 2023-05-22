const express = require('express');
const { Bus, Seats, Ticket } = require('../model/bus-model')
const url = require('../config/db.config')
const userRoute = express.Router()
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library')
const moment = require('moment');
const nodemailer = require('nodemailer');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const client = new MongoClient(url, { useUnifiedTopology: true, useUnifiedTopology: true });

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user: 'ramseetha4249@gmail.com',
      pass: 'tsdlqsikzvyyyhyt'
    }
  }
)

const db = client.db('bus-reservation');
const CLIENT_ID = "98854755672-933u8m4m64imi9tvctsks6uv9ovn1l4j.apps.googleusercontent.com";
const userClient = new OAuth2Client(CLIENT_ID);

userRoute.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}))

userRoute.post('/user/sigin', async (req, res) => {
  console.log("SIgin1");
  const token = req.body.tokenId;
  console.log(token);

  try {
    const ticket = await userClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    })
    console.log(ticket);

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const userEmail = payload['email'];
    const userName = payload['name'];

    req.session.userId = userId;
    req.session.userEmail = userEmail;
    req.session.userName = userName;

    res.status(200).json({ message: "Sigin Successfull" })

  } catch (error) {
    console.error(error);
    res.status(404).json({ message: `UnAuthourized user ${error} !!` })
  }
})

userRoute.get('/search-avail-buses', async (req, res) => {
  const { source, destination, boardingTime, sortBy, page = 1, limit = 3 } = req.query;
  const start = new Date(boardingTime);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const duration = end - start;
  const durationHours = Math.floor(duration / (1000 * 60 * 60));
  console.log(durationHours);

  const skip = (page - 1) * limit;

  try {

    let searchedBuses;

    switch (sortBy) {
      case 'boarding':
        searchedBuses = await Bus.find({
          source,
          destination,
          boardingTime: { $gte: start, $lt: end },
        }).sort({ boardingTime: 1 });
        break;

      case 'duration':
        searchedBuses = await Bus.find({
          source,
          destination,
          boardingTime: { $gte: start, $lt: end },
        }).sort({ duration: 1 });
        break;

      case 'price':
        searchedBuses = await Bus.find({
          source,
          destination,
          boardingTime: { $gte: start, $lt: end },
        }).sort({ price: 1 });
        break;

      case 'numberOfSeats':
        searchedBuses = await Bus.find({
          source,
          destination,
          boardingTime: { $gte: start, $lt: end },
        }).sort({ numberOfSeats: -1 });
        break;

      case 'droppingTime':
        searchedBuses = await Bus.find({
          source,
          destination,
          boardingTime: { $gte: start, $lt: end },
        }).sort({ droppingTime: 1 });
        break;

      default:
        searchedBuses = await Bus.find({
          source,
          destination,
          boardingTime: { $gte: start, $lt: end },
        });
    }

    const total = searchedBuses.length;
    searchedBuses = searchedBuses.slice(skip, skip + limit);

    if (searchedBuses.length === 0) {
      return res.json({ message: 'No buses found for the given route.' });
    }

    res.json({
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      buses: searchedBuses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while searching for buses.' });
  }
});

userRoute.get('/get-data', async (req, res) => {

  if (!req.session.userId) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  const data = {
    userId: req.session.userId,
    userEmail: req.session.email,
    userName: req.session.userName,
    message: "Your Data was protected "
  }
  res.status(200).json(data);
})

userRoute.get('/get-seats/:id', async (req, res) => {

  const busId = req.params.id;
  try {
    const seats = await Seats.find({ bus: busId })
    if (!seats) {
      res.status(404).send({ message: "Seats Not Found" })
    }

    res.send(seats)
  } catch (error) {
    res.status(500).send({ message: "Something went wrong please check inputs" })
  }
});
userRoute.post('/book', async (req, res) => {
  const tickets = req.body.tickets;
  const userName = req.session.userName;
  // const userEmail = req.session.email;

  try {
    const bookedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const reserve = new Ticket({
          busName: ticket.busName,
          userName: userName,
          userEmail: ticket.userEmail,
          journeyDate: ticket.journeyDate,
          passangerName: ticket.name,
          source: ticket.source,
          destination: ticket.destination,
          mobileNumber: ticket.mobileNumber,
          age: ticket.age,
          status: ticket.status,
          seatNumber: ticket.seatNumber,
          fare: ticket.price,
          busId: ticket.busId,
          seatId: ticket.seatId
        });
        return reserve.save();
      })
    );

    const updatedSeats = await Promise.all(
      bookedTickets.map(async (ticket) => {
        const updated = await Seats.findByIdAndUpdate(ticket.seatId, { status: false }, { new: true });
        return updated;
      })
    );

    if (updatedSeats) {
      const updatedSeatsAvail = await Bus.findByIdAndUpdate(bookedTickets[0].busId, { $inc: { numberOfSeats: -bookedTickets.length } }, { new: true });

      const totalFare = bookedTickets.reduce((acc, ticket) => acc + ticket.fare, 0);

      const seatRows = bookedTickets.map((ticket) => {
        return `<tr>
                    <td>${ticket.passangerName}</td>
                    <td> sn : ${ticket.seatNumber}</td>
                    <td>${ticket.fare}</td>
                  </tr>`;
      }).join('');

      const composedMail = {
        from: 'ramseetha4249@gmail.com',
        to: bookedTickets[0].userEmail,
        subject: 'Ticket Booking',
        html: `

    <h2>Ticket Confirmation - Bus Reservation</h2>
    <p>Dear ${bookedTickets[0].passangerName},</p>
    <p>Your bus ticket has been successfully booked. Please find the ticket details below:</p>
    <table>
      <tr>
        <th>Travels Name</th>
        <td>${bookedTickets[0].busName}</td>
      </tr>
      <tr>
        <th>Journey Date</th>
        <td>${bookedTickets[0].journeyDate}</td>
      </tr>
      <tr>
        <th>Passenger Name</th>
        <th>Seat number<th/>
        <th>Fare<th/>
        <td> ${seatRows}</td>
      </tr>
      <tr>
        <th>Mobile Number</th>
        <td>${bookedTickets[0].mobileNumber}</td>
      </tr>
      <tr>
        <th>Total Fare</th>
        <td>Rs : ${totalFare}</td>
      </tr>
    </table>
    <p>Please keep this email as your ticket and present it during boarding. We wish you a pleasant journey.</p>
    <p>Thank you for choosing our bus reservation service.</p>
    <p>Best regards,</p>
    <p>Bus Reservation Team</p>
  `
      };

      transporter.sendMail(composedMail, (error, info) => {
        if (error) {
          console.error(error);
          res.send('Error sending email');
        } else {
          console.log('Email sent: ' + info.response);

          res.status(200).send({
            message: "Tickets booked successfully!",
            tickets: bookedTickets,
            totalFare: totalFare
          });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

userRoute.get('/user-history/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const data = await Ticket.find({ userEmail: userEmail });
    if (data.length === 0) {
      res.send({ message: "No History" });
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    res.send({ message: "Error: No users found!" });
  }
});


userRoute.get('/api/logout', (req, res) => {
  delete req.session.userId;
  delete req.session.userName;
  delete req.session.userEmail;

  res.status(200).json({ message: 'Logout successful' });
});

module.exports = userRoute;
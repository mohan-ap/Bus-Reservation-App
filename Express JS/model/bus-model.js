const mongoose = require('mongoose');
const url = require('../config/db.config');
const { Timestamp } = require('mongodb');
mongoose.connect(url, { useNewUrlParser: true });

const schema = new mongoose.Schema(
  {
    busName: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    numberOfSeats: { type: Number, required: true },
    boardingTime: { type: Date ,required: true },
    droppingTime:{type:Date,required:true},
    duration:{type:Number,required:true},
    status: { type: Boolean },
    price: { type: Number, required: true }
  },
  { versionKey: false }
);

const Bus = mongoose.model('Bus', schema);

const busSeatsSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  busName:{type:mongoose.Schema.Types.String, ref : 'Bus'},
  seatNumber: Number,
  status: Boolean,
  price: Number,
  selected:Boolean,
});

const Seats = mongoose.model('bus-seats', busSeatsSchema);

const booking = new mongoose.Schema({
  busName: String,
  userName:String,
  userEmail:String,
  passangerName: String,
  mobileNumber:Number,
  age: Number,
  status: Boolean,
  journeyDate:Date,
  source:String,
  destination:String,
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'bus-seats' },
  seatNumber: Number,
  fare: Number,
})

const Ticket = mongoose.model('booked', booking)

module.exports = { Bus, Seats, Ticket };
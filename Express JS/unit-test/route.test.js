const request = require('supertest');
const app = require('../index');
const { Bus, Seats, Ticket } = require('../model/bus-model');
const { describe, it } = require('node:test');

describe("DELETE /delete-bus/:id", () => {

  test("should return error message if bus not found", async () => {
    const response = await request(app).delete("/delete-bus/invalidId");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Give Valid Data or Check inputs");
  });
});


describe('POST /add-bus', () => {
  it('should return 200 status and success message', async () => {
    const mockBus = {
      busName: 'Test Bus',
      source: 'Test Source',
      destination: 'Test Destination',
      boardingTime: new Date(),
      droppingTime: new Date(),
      duration: 10,
      numberOfSeats: 10,
      price: 100
    };
    const response = await request(app)
      .post('/add-bus')
      .send(mockBus);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Bus Created Sucessfully');
    expect(response.body.Addedbus).toHaveProperty('_id');
    expect(response.body.Addedbus.busName).toBe(mockBus.busName);
    expect(response.body.Addedbus.source).toBe(mockBus.source);
    expect(response.body.Addedbus.destination).toBe(mockBus.destination);
    expect(new Date(response.body.Addedbus.boardingTime)).toBe(mockBus.boardingTime);
    expect(new Date(response.body.Addedbus.droppingTime).toISOString()).toBe(mockBus.droppingTime);
    expect(response.body.Addedbus.duration).toBe(mockBus.duration);
    expect(response.body.Addedbus.numberOfSeats).toBe(mockBus.numberOfSeats);
    expect(response.body.Addedbus.price).toBe(mockBus.price);
  });
});


describe('PUT /update-status/:id', () => {
  it('should update seat status and increment the numberOfSeats in Bus', async () => {
    const seat = {
      bus: '614c3d3cf3c5c9156b98c6ba',
      busName: 'Bus 1',
      seatNumber: 1,
      status: true,
      price: 100,
      selected: false
    }
    const savedSeat = await Seats.create(seat);

    const res = await request(app)
      .put(`/update-status/${savedSeat._id}`)
      .send({ status: false })
      .expect(200);

    expect(res.body.message).toEqual('Status Updated Successfully !!!');

    const updatedSeat = await Seats.findById(savedSeat._id);
    expect(updatedSeat.status).toEqual(false);

  });

  it('should return 401 if seat not found', async () => {
    const res = await request(app)
      .put('/update-status/614c3d3cf3c5c9156b98c6ba')
      .send({ status: false })
      .expect(401);

    expect(res.body.message).toEqual('Not updated please check your inputs');
  });

  it('should return 500 if server error occurs', async () => {
    jest.spyOn(Seats, 'findByIdAndUpdate').mockRejectedValue(new Error());

    const res = await request(app)
      .put('/update-status/614c3d3cf3c5c9156b98c6ba')
      .send({ status: false })
      .expect(500);

    expect(res.body.message).toEqual('Internal server error !!!');
  });
});

describe('GET /get-users', () => {
  it('should return all users data', async () => {
    const testData = [{ name: 'John', email: 'john@example.com', phone: '1234567890' },
    { name: 'Jane', email: 'jane@example.com', phone: '0987654321' }];

    jest.spyOn(Ticket, 'find').mockResolvedValue(testData);

    const res = await request(app)
      .get('/get-users')
      .expect(200);

    expect(res.body).toEqual(testData);
  });

  it('should return 500 if server error occurs', async () => {
    jest.spyOn(Ticket, 'find').mockRejectedValue(new Error());

    const res = await request(app)
      .get('/get-users')
      .expect(500);

    expect(res.body.message).toEqual('something went wrong');
  });
});

describe('/buses', () => {

  it(`should return all the buses`, async () => {
    const bus = [{

      busName: "Then-molzhi travels",
      source: "Chennai",
      destination: "Salem",
      numberOfSeats: 5,
      boardingTime: "2023-05-10",
      droppingTime: "2023-05-11",
      price: 699
    },
    {
      busName: "Ak travels",
      source: "Chennai",
      destination: "Salem",
      numberOfSeats: 12,
      boardingTime: "2023-05-10",
      droppingTime: "2023-05-11",
      price: 699
    }];

    jest.spyOn(Bus, 'find').mockResolvedValue(bus);
    const res = await request(app)

      .get('/buses')
      .expect(200);

    expect(res.body).toEqual(bus);
  });
});

describe('GET /get-seats/:id', () => {
  it('should return seats for a valid bus ID', async () => {
    const seat = {
      bus: '614c3d3cf3c5c9156b98c6ba',
      busName: 'Bus 1',
      seatNumber: 1,
      status: true,
      price: 100,
      selected: false
    };
    const savedSeat = await Seats.create(seat);

    const res = await request(app)
      .get(`/get-seats/${savedSeat.bus}`);
    expect(res.status).toBe(200);
  });

  it('should return a 404 status for an invalid bus ID', async () => {
    const res = await request(app).get('/get-seats/invalid-id');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Something went wrong please check inputs' });
  });

});

describe('POST /book', () => {

  it('should return 500 internal server error for invalid request', async () => {
    const response = await request(app)
      .post('/book')
      .send({})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal server error');
  });
});

describe('GET /user-history', () => {
  it('should return user history for a valid email', async () => {
    const userEmail = 'example@example.com';
    const mockData = [
      {
        busName: 'Bus A',
        journeyDate: '2023-05-15',
        passengerName: 'John Doe',
        mobileNumber: '1234567890',
        age: 30,
        status: 'booked',
        seatNumber: 'A1',
        fare: 100,
        busId: '60a819abf1b62b10d0a356b1',
        seatId: '60a819abf1b62b10d0a356b2',
        userEmail: userEmail,
      },

    ];

    Ticket.find = jest.fn().mockResolvedValue(mockData);

    const response = await request(app).get(`/user-history?userEmail=${userEmail}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('should return a "No users found" message for an error', async () => {
    const userEmail = 'example@example.com';

    Ticket.find = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app).get(`/user-history?userEmail=${userEmail}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'No users found !!' });
  });
});


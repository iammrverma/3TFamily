require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Member = require("./models/member");

// Connect to MongoDB
const main = async (url) => await mongoose.connect(url);

main(process.env.DB_URL)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

// Function to create fake employees
const createFakeEmployees = async () => {
  const members = [];

  for (let i = 0; i < 15; i++) {
    const employee = new Member({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number("+1-###-###-####"),
      position: faker.person.jobTitle(),
      department: faker.commerce.department(),
      joinDate: faker.date.past(5),
      address: {
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
        location: faker.location.street(),
      },
      salary: faker.number.int({ min: 30000, max: 100000 }),
    });

    members.push(employee);
  }

  await Member.deleteMany({});
  await Member.insertMany(members);
  console.log("15 fake employees have been added to the database");
};

// Run the function and close the connection
createFakeEmployees()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });

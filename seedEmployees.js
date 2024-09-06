require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Member = require("./models/member"); // Adjust the path as needed
const passportLocalMongoose = require("passport-local-mongoose");

// Connect to MongoDB
const main = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to database");
    await createFakeEmployees(5); // Ensure employees are created after connection
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Function to create fake employees
const createFakeEmployees = async (num) => {
  for (let i = 0; i < num; i++) {
    const email = faker.internet.email();
    const password = "helloworld";

    const member = new Member({
      name: faker.person.fullName(),
      email: email,
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

    try {
      await Member.register(member, password); // Register the member with the generated password
      console.log(`Member ${email} registered successfully`);
    } catch (err) {
      console.error("Error registering member:", err);
    }
  }
};

// Run the main function with the database URL
main(process.env.DB_URL);

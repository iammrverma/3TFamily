require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Member = require("./models/member");

// Connect to MongoDB
const main = async (url, num) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to database");
    await createFakeEmployees(num); // Ensure employees are created after connection
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Function to create fake employees
const createFakeEmployees = async (num) => {
  await Member.deleteMany({});
  for (let i = 0; i < num; i++) {
    const email = faker.internet.email();
    const password = "helloworld";
    const image = `https://picsum.photos/200?random=${i}`;
    const member = new Member({
      name: faker.person.fullName(),
      email: email,
      phone: faker.phone.number("9#########"), // Adjust format as needed
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
      image: image,
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
main(process.env.DB_URL, 10); // Example number of fake members to create

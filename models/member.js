const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "Mr India" },
    position: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: Date, required: true },
    editAccess: { type: Boolean, default: false },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      match: /^[789]\d{9}$/,
    },
    address: {
      country: String,
      state: String,
      city: String,
      location: String,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    role: {
      type: String,
      enum: ["HR", "Manager", "Member"],
      default: "Member",
    },
  },
  { timestamps: true }
);

memberSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;

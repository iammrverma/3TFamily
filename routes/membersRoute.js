const express = require("express");

const Member = require("../models/member"); // Model
const { authorizeRole } = require("../middleware");

const router = express.Router();

// Get all members
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  try {
    const totalMembers = await Member.countDocuments();
    const members = await Member.find({}).skip(skip).limit(limit);
    res.status(200).json({
      totalMembers,
      members,
      currentPage: page,
      totalPages: Math.ceil(totalMembers / limit),
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new member
router.post("/", authorizeRole(["HR"]), async (req, res) => {
  console.log(req.body);
  try {
    const member = new Member(req.body);
    console.log(member);
    await Member.save();
    res.status(201).send(member);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a specific member by ID
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).send("Not found");
    }
    res.send(member);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an member
router.patch("/:id", authorizeRole(["HR", "Member"]), async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body.member,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!member) {
      return res.status(404).send("Not found");
    }
    res.send(member);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an member
router.delete("/:id", authorizeRole(["HR"]), async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).send("Not found");
    }
    res.status(200).send("Member Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

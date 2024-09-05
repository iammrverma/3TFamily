const express = require("express");

const Member = require("../models/member"); // Model

const router = express.Router();

// Get all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find({});
    res.send(members);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new member
router.post("/", async (req, res) => {
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
router.patch("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).send("Not found");
    }
    res.send(member);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

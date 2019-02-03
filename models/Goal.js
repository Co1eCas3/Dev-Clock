const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
  doCreation: Date,
  doCompletion: Date,
  completed: Boolean,
  goal: String
});

module.exports = Goal = mongoose.model("Goal", GoalSchema, "goals");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  start: Date,
  end: Date,
  goals: [
    {
      type: Schema.Types.ObjectId,
      ref: "goals"
    }
  ]
});

module.exports = Session = mongoose.model("Session", SessionSchema);

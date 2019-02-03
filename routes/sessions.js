const express = require("express"),
  router = express.Router();

const Goal = require("../models/Goal");

router.get("/sessions/incomplete_goals", (req, res) => {
  Goal.find({ completed: false })
    .then(incompleteGoals => {
      res.json(incompleteGoals);
    })
    .catch(err => res.json(err));
});

module.exports = router;

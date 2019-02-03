const express = require("express"),
  router = express.Router();

const Session = require("../models/Session"),
  Goal = require("../models/Goal");

// sample request:
// start: some date and time
// end: some date and time
// goals: '[{
// (opt) doCreation: *include if previously created, else defaults to Date.now*
//   completed:
// }]'

// let updatedGoals = [];
// let queuedGoal = null;
// let qLen = null;
// let updateError;

// // @arg   array of 'goal' objects
// function updateGoals(prevGoals) {
//   if (!qLen) qLen = prevGoals.length;

//   const finished = qLen === updatedGoals.length;

//   if (updateError) {
//     console.log(updateError);
//     return;
//   } else if (prevGoals.length && !queuedGoal) {
//     updateGoal();
//     updateGoals(prevGoals);
//   } else if (prevGoals.length || !finished) {
//     updateGoals(prevGoals);
//   } else {
//     const _updatedGoals = [...updatedGoals];
//     updateGoals = [];
//     qLen = null;

//     return _updatedGoals;
//   }

//   function updateGoal() {
//     queuedGoal = prevGoals.shift();
//     Goal.findByIdAndUpdate(
//       queuedGoal.goalId,
//       { completed: true },
//       { new: true }
//     )
//       .then(res => {
//         queuedGoal = null;
//         updatedGoals.push(res.json());
//       })
//       .catch(err => {
//         queuedGoal = null;
//         updateError = err;
//       });
//   }
// }

// if qLen = undefined:
//  set queue length
// if remaining goals to queue:
//
//  if queuedGoal = null
//    queue goal
//    update goal
//      push result to updatedGoals arr
//      queuedGoal = null
//      rerun updateGoals
//  else
//    rerun updateGoal
//
// else
//  if updatedGoals.length === qLen
//    move on
//    qLen = null
//  else
//    rerun updateGoals

function updateGoals(prevGoals) {
  if (!prevGoals.length) {
    return new Promise((res, rej) => res([]));
  }

  const allUpdatedGoals = prevGoals.map(goal => {
    return Goal.findByIdAndUpdate(
      goal.goalId,
      {
        completed: true,
        doCompletion: goal.doCompletion
      },
      { new: true }
    );
  });
  return Promise.all(allUpdatedGoals).catch(err =>
    console.log("Update error: ", err)
  );
}

function insertGoals(newGoals) {
  if (!newGoals.length) {
    return new Promise((res, rej) => res({}));
  }

  return Goal.collection
    .insertMany(newGoals)
    .catch(err => console.log("Insert error: ", err));
}

router.post("/log_session", (req, res) => {
  let sessionGoals = JSON.parse(req.body.goals),
    prevGoals_complete = [],
    prevGoals_incomplete = [],
    newGoals = [],
    updatedGoals = [],
    insertedGoals = [];

  sessionGoals.forEach(goal => {
    if (goal.completed !== undefined) {
      goal.completed =
        goal.completed === "true" || !(goal.completed === "false");
    }

    if (goal.goalId) {
      if (goal.completed) {
        prevGoals_complete.push(goal);
      } else {
        prevGoals_incomplete.push(goal.goalId);
      }
    } else {
      newGoals.push(goal);
    }
  });

  updateGoals(prevGoals_complete)
    .then(results => {
      if (results.length) {
        updatedGoals = results.map(goal => goal._id);
      }
      return insertGoals(newGoals);
    })
    .then(results => {
      if (Object.keys(results).length) {
        insertedGoals = results.ops.map(goal => goal._id);
      }

      const allGoalIds = insertedGoals
        .concat(updatedGoals)
        .concat(prevGoals_incomplete);

      const newSession = {
        start: req.body.start,
        end: req.body.end,
        goals: allGoalIds
      };

      new Session(newSession)
        .save()
        .then(sessionRes => {
          res.json(sessionRes);
        })
        .catch(err => res.json(err));
    });
});

module.exports = router;

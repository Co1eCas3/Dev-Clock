const modal = doc.getElementById("modal");
const backdrop = doc.getElementById("backdrop");

window.onload = () => {
  getIncompleteGoals()
    .then(goalsResults => {
      let prevGoalsTemp = "",
        prevGoalCount = 0;
      goalsResults.forEach(goal => {
        prevGoalCount++;
        let newPrevGoalTemp = templates.prevGoal;
        newPrevGoalTemp = newPrevGoalTemp.replace(
          "replace-data-goalid",
          goal._id
        );
        newPrevGoalTemp = newPrevGoalTemp.replace(
          "replace-goal-text",
          goal.goal
        );
        newPrevGoalTemp = newPrevGoalTemp.replace(
          /replace-goal-count/g,
          prevGoalCount
        );
        prevGoalsTemp += newPrevGoalTemp;
      });

      let newModalOnloadInfo = templates.modal.onload;
      newModalOnloadInfo = newModalOnloadInfo.replace(
        "replace-modal-info",
        prevGoalsTemp
      );
      modal.innerHTML = newModalOnloadInfo;
      preSession();
    })
    .catch(err => console.log(err));
};

async function getIncompleteGoals() {
  const response = await fetch(
    "http://localhost:5000/api/sessions/incomplete_goals"
  );
  const incompleteGoals = await response.json();
  return incompleteGoals;
}

function preSession() {
  const continueBtn = doc.getElementById("continue");
  const goalChecks = doc.querySelectorAll("#modal-info input");

  continueBtn.addEventListener("click", continueToSession);

  function continueToSession(e) {
    e.preventDefault();
    let modalInfoCopy;
    if (goalChecks[0]) {
      goalChecks.forEach(check => {
        if (!check.checked) {
          let goalCont = check.parentElement;
          goalCont.parentNode.removeChild(goalCont);
        } else {
          goalCount++;
          check.id = check.id.replace("prev-", "");
          check.id = check.id.replace(/d/, goalCount);
          let labelAttr = check.nextElementSibling.getAttribute("for");
          labelAttr = labelAttr.replace("prev-", "");
          labelAttr = labelAttr.replace(/d/, goalCount);
          check.nextElementSibling.setAttribute("for", labelAttr);
        }
      });
      modalInfoCopy = doc.getElementById("modal-info").innerHTML;
      goalsSection.innerHTML = modalInfoCopy;
    }
    backdrop.style.display = "none";
  }
}

function postSession(sessionData) {
  let newSessionEndModal = templates.modal.sessionEnd,
    newSessionGoalsList = "";

  sessionData.goals.forEach((goal, i) => {
    let newCompletedGoal;
    if (goal.completed) {
      newCompletedGoal = templates.modal.sessionEndGoalCompleted;
    } else {
      newCompletedGoal = templates.modal.sessionEndGoal;
    }
    newCompletedGoal = newCompletedGoal.replace("replace-goal-text", goal.goal);
    newSessionGoalsList += newCompletedGoal;
  });

  newSessionEndModal = newSessionEndModal.replace(
    "replace-start",
    sessionData.start
  );
  newSessionEndModal = newSessionEndModal.replace(
    "replace-end",
    sessionData.end
  );
  newSessionEndModal = newSessionEndModal.replace(
    "replace-session-end-goals",
    newSessionGoalsList
  );

  modal.innerHTML = newSessionEndModal;
  backdrop.removeAttribute("style");

  const submitBtn = doc.getElementById("submit");
  const submitBtnHandler = e =>
    submitToDB(e, sessionData)
      .then(res => {
        modal.innerHTML = templates.modal.submissionSuccess;
      })
      .catch(err => {
        modal.innerHTML = templates.modal.submissionFailure;
        console.log(err);
      });
  submitBtn.addEventListener("click", submitBtnHandler);
}

async function submitToDB(e, sessionData) {
  e.preventDefault();

  sessionData.goals = JSON.stringify(
    sessionData.goals.map(goalToConvert => {
      let goalToBeSubbed = {};
      if (goalToConvert.goalId !== undefined) {
        goalToBeSubbed.goalId = goalToConvert.goalId;
        if (goalToConvert.completed) {
          goalToBeSubbed.completed = goalToConvert.completed;
          goalToBeSubbed.doCompletion = goalToConvert.doCompletion;
        }
      } else {
        return goalToConvert;
      }
      return goalToBeSubbed;
    })
  );

  const response = await fetch("http://localhost:5000/api/log_session", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(sessionData)
  });

  const resData = await response;
  return resData;
}

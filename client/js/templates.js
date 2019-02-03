const templates = {};

templates.loader = `<div id="loader"></div>`;

templates.goal = `<div class="goal flex-row">
    <input type="checkbox" id="goal-replace-goal-count" />
    <label for="goal-replace-goal-count">replace-input-val</label>
  </div>`;

templates.prevGoal = `<div class="goal flex-row">
    <input type="checkbox" id="prev-goal-replace-goal-count" data-goalid="replace-data-goalid" />
    <label for="prev-goal-replace-goal-count">replace-goal-text</label>
  </div>`;

templates.modal = {};

templates.modal.onload = `<h2>You have these goals still to complete:</h2>
  <div id="modal-info">replace-modal-info</div>
  <button id="continue">Continue</button>`;

templates.modal.sessionEnd = `<h2>Session Info:</h2>
<div id="modal-info">
  <div class="field flex-row">
    <strong>Start:</strong>
    <p>replace-start</p>
  </div>
  <div class="field flex-row">
    <strong>End:</strong>
    <p>replace-end</p>
  </div>
  <div class="field flex-row">
    <strong>Goals:</strong>
    <ul>
      replace-session-end-goals
    </ul>
  </div>
</div>
<button id="submit">Submit to DB</button>`;

templates.modal.sessionEndGoal = `<li>replace-goal-text</li>`;

templates.modal.sessionEndGoalCompleted = `<li class="checked">replace-goal-text</li>`;

templates.modal.submissionSuccess = `<h2 style="margin:0 auto;">Success!!</h2>`;

templates.modal.submissionFailure = `<h2 style="margin:0 auto;">Something went wrong...</h2>`;

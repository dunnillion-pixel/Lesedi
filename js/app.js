let tasks = Storage.load();
let suggestions = Storage.loadSuggestions();

let currentFilter = "all";

const taskContainer =
  document.getElementById("taskContainer");

const aiOutput =
  document.getElementById("aiOutput");

const suggestionContainer =
  document.getElementById("suggestionContainer");

/* ---------------- INIT ---------------- */

init();

function init() {
  render();
  renderSuggestions();
}

/* ---------------- EVENTS ---------------- */

document
  .getElementById("addTaskButton")
  .addEventListener("click", addTask);

document
  .getElementById("aiButton")
  .addEventListener("click", runAI);

document
  .getElementById("loadSuggestionsButton")
  .addEventListener("click", loadDemoSuggestions);

document
  .getElementById("analyzeTranscriptButton")
  .addEventListener("click", analyzeTranscript);

document
  .querySelectorAll("[data-filter]")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      render();
    });
  });

/* ---------------- TASKS ---------------- */

function addTask() {

  const text =
    document.getElementById("taskInput").value.trim();

  if (!text) return;

  const priority =
    Number(document.getElementById("priorityInput").value);

  const dueValue =
    document.getElementById("dueInput").value;

  const task =
    TaskService.create(
      text,
      priority,
      dueValue ? new Date(dueValue).getTime() : null
    );

  tasks.push(task);
  Storage.save(tasks);

  document.getElementById("taskInput").value = "";
  document.getElementById("dueInput").value = "";

  render();
}

/* ---------------- TASK ACTIONS ---------------- */

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;
  Storage.save(tasks);
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  Storage.save(tasks);
  render();
}

/* ---------------- AI ---------------- */

function runAI() {

  const active = tasks.filter(t => !t.done);

  if (active.length === 0) {
    aiOutput.innerText = "No tasks 🎉";
    return;
  }

  const best =
    [...active].sort(
      (a, b) =>
        StatusService.score(b) -
        StatusService.score(a)
    )[0];

  aiOutput.innerText =
    `Recommended: ${best.text}`;
}

/* ---------------- TRANSCRIPT → SUGGESTIONS ---------------- */

function analyzeTranscript() {

  const text =
    document.getElementById("transcriptInput").value;

  const newSuggestions =
    AIEngine.analyzeTranscript(text);

  if (newSuggestions.length === 0) {
    alert("No actionable items found.");
    return;
  }

  suggestions = [
    ...suggestions,
    ...newSuggestions
  ];

  Storage.saveSuggestions(suggestions);

  renderSuggestions();

  document.getElementById("transcriptInput").value = "";
}

/* ---------------- FILTER ---------------- */

function getFilteredTasks() {

  if (currentFilter === "active")
    return tasks.filter(t => !t.done);

  if (currentFilter === "done")
    return tasks.filter(t => t.done);

  return tasks;
}

/* ---------------- SUGGESTIONS ---------------- */

function loadDemoSuggestions() {

  suggestions =
    SuggestionService.loadDemoSuggestions();

  Storage.saveSuggestions(suggestions);

  renderSuggestions();
}

function acceptSuggestion(id) {

  const suggestion =
    suggestions.find(s => s.id === id);

  if (!suggestion) return;

  const task =
    TaskService.create(
      suggestion.text,
      2,
      null
    );

  tasks.push(task);

  suggestions =
    suggestions.filter(s => s.id !== id);

  Storage.save(tasks);
  Storage.saveSuggestions(suggestions);

  render();
  renderSuggestions();
}

function rejectSuggestion(id) {

  suggestions =
    suggestions.filter(s => s.id !== id);

  Storage.saveSuggestions(suggestions);

  renderSuggestions();
}

/* ---------------- RENDER ---------------- */

function render() {

  const list = getFilteredTasks();

  if (list.length === 0) {
    taskContainer.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  taskContainer.innerHTML =
    "<ul>" +
    list.map(task => {

      const dueText =
        task.dueAt
          ? new Date(task.dueAt).toLocaleString()
          : "No due date";

      return `
        <li class="${task.done ? "done" : ""}">
          <div>
            <span class="status">
              ${StatusService.getStatus(task)}
            </span>

            <span class="main-text">
              ${task.text}
            </span>

            <br>

            <small>
              Priority ${task.priority} • ${dueText}
            </small>
          </div>

          <div>
            <button onclick="toggleTask('${task.id}')">
              ${task.done ? "Undo" : "Done"}
            </button>

            <button onclick="deleteTask('${task.id}')">
              Delete
            </button>
          </div>

        </li>
      `;
    }).join("") +
    "</ul>";
}

/* ---------------- RENDER SUGGESTIONS ---------------- */

function renderSuggestions() {

  if (!suggestions || suggestions.length === 0) {
    suggestionContainer.innerHTML =
      "No suggestions available.";
    return;
  }

  suggestionContainer.innerHTML =
    suggestions.map(s => `
      <div class="panel">

        <strong>${s.text}</strong>

        <br>

        Confidence: ${Math.round(s.confidence * 100)}%

        <br>

        Source: ${s.sourceType}

        <br><br>

        <button onclick="acceptSuggestion('${s.id}')">
          Accept
        </button>

        <button onclick="rejectSuggestion('${s.id}')">
          Reject
        </button>

      </div>
    `).join("");
}

/* ---------------- GLOBAL ---------------- */

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.acceptSuggestion = acceptSuggestion;
window.rejectSuggestion = rejectSuggestion;

/* ---------------- START ---------------- */

init();
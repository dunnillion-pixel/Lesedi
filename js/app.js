let tasks = Storage.loadTasks();
let suggestions = Storage.loadSuggestions();
let sources = Storage.loadSources();
let activities = Storage.loadActivities();

let currentFilter = "all";

const taskContainer =
  document.getElementById("taskContainer");

const suggestionContainer =
  document.getElementById("suggestionContainer");

const sourceContainer =
  document.getElementById("sourceContainer");

const activityContainer =
  document.getElementById("activityContainer");

init();

function init() {

  renderTasks();
  renderSuggestions();
  renderSources();
  renderActivities();

}

/* ---------------- TASKS ---------------- */

function addTask() {

  const text =
    document.getElementById("taskInput").value.trim();

  if (!text) return;

  const task = TaskService.create(text, 2, null);

  tasks.push(task);

  Storage.saveTasks(tasks);

  ActivityService.record(
    "TASK_CREATED",
    null,
    task.id,
    "Task created: " + text
  );

  renderTasks();

}

function toggleTask(id) {

  const task =
    tasks.find(t => t.id === id);

  if (!task) return;

  task.done = !task.done;

  Storage.saveTasks(tasks);

  ActivityService.record(
    task.done ? "TASK_COMPLETED" : "TASK_REOPENED",
    task.sourceId,
    task.id,
    "Task toggled: " + task.text
  );

  renderTasks();

}

/* ---------------- SUGGESTIONS ---------------- */

function acceptSuggestion(id) {

  const s =
    suggestions.find(x => x.id === id);

  if (!s) return;

  const task =
    TaskService.create(
      s.text,
      2,
      null
    );

  tasks.push(task);

  suggestions =
    suggestions.filter(x => x.id !== id);

  Storage.saveTasks(tasks);
  Storage.saveSuggestions(suggestions);

  ActivityService.record(
    "SUGGESTION_ACCEPTED",
    s.sourceId,
    task.id,
    "Accepted suggestion: " + s.text
  );

  renderTasks();
  renderSuggestions();

}

function rejectSuggestion(id) {

  const s =
    suggestions.find(x => x.id === id);

  suggestions =
    suggestions.filter(x => x.id !== id);

  Storage.saveSuggestions(suggestions);

  ActivityService.record(
    "SUGGESTION_REJECTED",
    s?.sourceId,
    id,
    "Rejected suggestion"
  );

  renderSuggestions();

}

/* ---------------- MEETINGS ---------------- */

async function analyzeTeamsTranscript() {

  const text =
    document.getElementById("transcriptInput").value;

  if (!text.trim()) return;

  const source =
    SourceService.createTeamsSimulated(
      "Teams Meeting - " +
      new Date().toLocaleString(),
      text
    );

  sources.push(source);

  Storage.saveSources(sources);

  const newSuggestions =
    await AIEngine.analyzeTranscript(
      text,
      source
    );

  suggestions = [
    ...suggestions,
    ...newSuggestions
  ];

  Storage.saveSuggestions(suggestions);

  ActivityService.record(
    "MEETING_PROCESSED",
    source.id,
    source.id,
    "Processed meeting"
  );

  renderSources();
  renderSuggestions();
}

/* ---------------- RENDER ---------------- */

function renderTasks() {

  taskContainer.innerHTML =
    tasks.length
      ? tasks.map(t => `
        <div>
          ${t.text}
        </div>
      `).join("")
      : "<p>No tasks</p>";

}

function renderSuggestions() {

  suggestionContainer.innerHTML =
    suggestions.length
      ? suggestions.map(s => `
        <div class="panel">
          <strong>${s.text}</strong>
          <br>
          ${Math.round(s.confidence * 100)}%
        </div>
      `).join("")
      : "No suggestions";

}

function renderSources() {

  sourceContainer.innerHTML =
    sources.length
      ? sources.map(s => `
        <div class="panel">
          <strong>${s.title}</strong>
          <br>
          ${s.type}
        </div>
      `).join("")
      : "No meetings";

}

function renderActivities() {

  activityContainer.innerHTML =
    activities.length
      ? activities
          .slice()
          .reverse()
          .map(a => `
            <div class="panel">
              ${a.type}
              <br>
              ${a.description}
            </div>
          `).join("")
      : "No activity";

}

/* ---------------- INIT ---------------- */

init();
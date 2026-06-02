let tasks = Storage.load();
let suggestions =
  Storage.loadSuggestions();

let sources =
  Storage.loadSources();

let currentFilter = "all";

const taskContainer =
  document.getElementById(
    "taskContainer"
  );

const aiOutput =
  document.getElementById(
    "aiOutput"
  );

const suggestionContainer =
  document.getElementById(
    "suggestionContainer"
  );

const sourceContainer =
  document.getElementById(
    "sourceContainer"
  );

init();

function init() {

  render();
  renderSuggestions();
  renderSources();

}

document
  .getElementById("addTaskButton")
  .addEventListener(
    "click",
    addTask
  );

document
  .getElementById("aiButton")
  .addEventListener(
    "click",
    runAI
  );

document
  .getElementById(
    "loadSuggestionsButton"
  )
  .addEventListener(
    "click",
    loadDemoSuggestions
  );

document
  .getElementById(
    "analyzeTranscriptButton"
  )
  .addEventListener(
    "click",
    analyzeTeamsTranscript
  );

document
  .querySelectorAll(
    "[data-filter]"
  )
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        currentFilter =
          btn.dataset.filter;

        render();

      }
    );

  });

function addTask() {

  const text =
    document
      .getElementById(
        "taskInput"
      )
      .value
      .trim();

  if (!text) return;

  const priority =
    Number(
      document
        .getElementById(
          "priorityInput"
        )
        .value
    );

  const dueValue =
    document
      .getElementById(
        "dueInput"
      )
      .value;

  const task =
    TaskService.create(
      text,
      priority,
      dueValue
        ? new Date(
            dueValue
          ).getTime()
        : null
    );

  tasks.push(task);

  Storage.save(tasks);

  document
    .getElementById(
      "taskInput"
    )
    .value = "";

  document
    .getElementById(
      "dueInput"
    )
    .value = "";

  render();

}

function runAI() {

  const active =
    tasks.filter(
      t => !t.done
    );

  if (
    active.length === 0
  ) {

    aiOutput.innerText =
      "No tasks 🎉";

    return;

  }

  const best =
    [...active]
      .sort(
        (a, b) =>
          StatusService.score(b) -
          StatusService.score(a)
      )[0];

  aiOutput.innerText =
    `Recommended: ${best.text}`;

}

async function analyzeTeamsTranscript() {

  const text =
    document
      .getElementById(
        "transcriptInput"
      )
      .value;

  if (!text.trim()) return;

  const source =
    SourceService
      .createTeamsSimulated(
        "Teams Meeting - " +
        new Date()
          .toLocaleString(),
        text
      );

  sources.push(source);

  Storage.saveSources(
    sources
  );

  const newSuggestions =
    await AIEngine
      .analyzeTranscript(
        text,
        source
      );

  suggestions = [
    ...suggestions,
    ...newSuggestions
  ];

  Storage.saveSuggestions(
    suggestions
  );

  document
    .getElementById(
      "transcriptInput"
    )
    .value = "";

  renderSuggestions();
  renderSources();

}

function loadDemoSuggestions() {

  suggestions =
    SuggestionService
      .loadDemoSuggestions();

  Storage.saveSuggestions(
    suggestions
  );

  renderSuggestions();

}

function acceptSuggestion(id) {

  const suggestion =
    suggestions.find(
      s => s.id === id
    );

  if (!suggestion) return;

  const task =
    TaskService.create(
      suggestion.text,
      2,
      null
    );

  task.sourceType =
    suggestion.sourceType;

  tasks.push(task);

  suggestions =
    suggestions.filter(
      s => s.id !== id
    );

  Storage.save(tasks);

  Storage.saveSuggestions(
    suggestions
  );

  render();
  renderSuggestions();

}

function rejectSuggestion(id) {

  suggestions =
    suggestions.filter(
      s => s.id !== id
    );

  Storage.saveSuggestions(
    suggestions
  );

  renderSuggestions();

}

function toggleTask(id) {

  const task =
    tasks.find(
      t => t.id === id
    );

  if (!task) return;

  task.done =
    !task.done;

  Storage.save(tasks);

  render();

}

function deleteTask(id) {

  tasks =
    tasks.filter(
      t => t.id !== id
    );

  Storage.save(tasks);

  render();

}

function getFilteredTasks() {

  if (
    currentFilter ===
    "active"
  ) {
    return tasks.filter(
      t => !t.done
    );
  }

  if (
    currentFilter ===
    "done"
  ) {
    return tasks.filter(
      t => t.done
    );
  }

  return tasks;

}

function render() {

  const list =
    getFilteredTasks();

  if (
    list.length === 0
  ) {

    taskContainer.innerHTML =
      "<p>No tasks found.</p>";

    return;

  }

  taskContainer.innerHTML =
    "<ul>" +
    list.map(task => `
      <li>
        ${StatusService.getStatus(task)}
        ${task.text}
        <br>
        <small>
          Source:
          ${task.sourceType || "manual"}
        </small>
        <br>
        <button onclick="toggleTask('${task.id}')">
          ${task.done ? "Undo" : "Done"}
        </button>
        <button onclick="deleteTask('${task.id}')">
          Delete
        </button>
      </li>
    `).join("") +
    "</ul>";

}

function renderSuggestions() {

  if (
    suggestions.length === 0
  ) {

    suggestionContainer.innerHTML =
      "No suggestions available.";

    return;

  }

  suggestionContainer.innerHTML =
    suggestions.map(s => `
      <div class="panel">

        <strong>
          ${s.text}
        </strong>

        <br>

        Confidence:
        ${Math.round(
          s.confidence * 100
        )}%

        <br>

        Source:
        ${s.sourceType}

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

function renderSources() {

  if (
    sources.length === 0
  ) {

    sourceContainer.innerHTML =
      "No meetings processed.";

    return;

  }

  sourceContainer.innerHTML =
    sources
      .slice()
      .reverse()
      .map(source => `
        <div class="panel">

          <strong>
            ${source.title}
          </strong>

          <br>

          Type:
          ${source.type}

          <br>

          Created:
          ${new Date(
            source.createdAt
          ).toLocaleString()}

        </div>
      `)
      .join("");

}

window.toggleTask =
  toggleTask;

window.deleteTask =
  deleteTask;

window.acceptSuggestion =
  acceptSuggestion;

window.rejectSuggestion =
  rejectSuggestion;
let tasks = Storage.load();
let currentFilter = "all";

const taskContainer = document.getElementById("taskContainer");
const aiOutput = document.getElementById("aiOutput");

/* ---------------- INIT EVENTS ---------------- */

document.getElementById("addTaskButton").addEventListener("click", addTask);
document.getElementById("aiButton").addEventListener("click", runAI);

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

/* ---------------- TASK OPS ---------------- */

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const priority = Number(document.getElementById("priorityInput").value);
  const dueValue = document.getElementById("dueInput").value;

  if (!text) return;

  const task = TaskService.create(
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

/* ---------------- FILTER ---------------- */

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter(t => !t.done);
  if (currentFilter === "done") return tasks.filter(t => t.done);
  return tasks;
}

/* ---------------- AI ---------------- */

function runAI() {
  const active = tasks.filter(t => !t.done);

  if (active.length === 0) {
    aiOutput.innerText = "No tasks 🎉";
    return;
  }

  const best = [...active].sort(
    (a, b) => StatusService.score(b) - StatusService.score(a)
  )[0];

  aiOutput.innerText = `Recommended: ${best.text}`;
}

/* ---------------- RENDER ---------------- */

function render() {
  const list = getFilteredTasks();

  if (list.length === 0) {
    taskContainer.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  taskContainer.innerHTML = "<ul>" + list.map(task => {

    const dueText = task.dueAt
      ? new Date(task.dueAt).toLocaleString()
      : "No due date";

    return `
      <li class="${task.done ? "done" : ""}">
        <div>
          <span class="status">${StatusService.getStatus(task)}</span>
          <span class="main-text">${task.text}</span>
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
  }).join("") + "</ul>";
}

/* ---------------- GLOBAL EXPORTS (FIX) ---------------- */

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.runAI = runAI;

/* ---------------- START ---------------- */

render();
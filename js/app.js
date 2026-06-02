let tasks = Storage.load();

let currentFilter = "all";

const taskContainer =
  document.getElementById(
    "taskContainer"
  );

document
  .getElementById(
    "addTaskButton"
  )
  .addEventListener(
    "click",
    addTask
  );

document
  .getElementById(
    "aiButton"
  )
  .addEventListener(
    "click",
    runAI
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

  render();
}

function toggleTask(id) {

  const task =
    tasks.find(
      t => t.id === id
    );

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

function runAI() {

  const active =
    tasks.filter(
      t => !t.done
    );

  if (
    active.length === 0
  ) {

    document
      .getElementById(
        "aiOutput"
      )
      .innerText =
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

  document
    .getElementById(
      "aiOutput"
    )
    .innerText =
    `Recommended: ${best.text}`;
}

function render() {

  let filtered =
    tasks;

  if (
    currentFilter ===
    "active"
  ) {
    filtered =
      tasks.filter(
        t => !t.done
      );
  }

  if (
    currentFilter ===
    "done"
  ) {
    filtered =
      tasks.filter(
        t => t.done
      );
  }

  if (
    filtered.length === 0
  ) {

    taskContainer.innerHTML =
      "<p>No tasks found.</p>";

    return;
  }

  taskContainer.innerHTML =
    "<ul>" +
    filtered
      .map(task => {

        const dueText =
          task.dueAt
            ? new Date(
                task.dueAt
              ).toLocaleString()
            : "No due date";

        return `
          <li>
            <div>
              ${StatusService.getStatus(task)}
              ${task.text}
              <br>
              <small>
                Priority ${task.priority}
                •
                ${dueText}
              </small>
            </div>

            <div>
              <button
                onclick="toggleTask('${task.id}')">
                ${
                  task.done
                    ? "Undo"
                    : "Done"
                }
              </button>

              <button
                onclick="deleteTask('${task.id}')">
                Delete
              </button>
            </div>
          </li>
        `;

      })
      .join("") +
    "</ul>";
}

render();
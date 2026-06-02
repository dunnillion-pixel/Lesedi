const Storage = {

  save(tasks) {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  },

  load() {
    return JSON.parse(
      localStorage.getItem("tasks")
    ) || [];
  }

};
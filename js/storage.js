const Storage = {

  saveTasks(tasks) {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  },

  loadTasks() {
    return JSON.parse(
      localStorage.getItem("tasks")
    ) || [];
  },

  saveSuggestions(suggestions) {
    localStorage.setItem(
      "suggestions",
      JSON.stringify(suggestions)
    );
  },

  loadSuggestions() {
    return JSON.parse(
      localStorage.getItem("suggestions")
    ) || [];
  },

  saveSources(sources) {
    localStorage.setItem(
      "sources",
      JSON.stringify(sources)
    );
  },

  loadSources() {
    return JSON.parse(
      localStorage.getItem("sources")
    ) || [];
  },

  saveActivities(activities) {
    localStorage.setItem(
      "activities",
      JSON.stringify(activities)
    );
  },

  loadActivities() {
    return JSON.parse(
      localStorage.getItem("activities")
    ) || [];
  }

};
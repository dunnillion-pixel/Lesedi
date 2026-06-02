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
  }

};
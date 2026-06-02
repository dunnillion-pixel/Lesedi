const SuggestionService = {

  create(text, confidence, sourceType) {
    return {
      id: crypto.randomUUID(),
      text,
      confidence,
      sourceType,
      accepted: false,
      createdAt: Date.now()
    };
  },

  loadDemoSuggestions() {

    return [

      this.create(
        "Prepare executive summary",
        0.92,
        "teams"
      ),

      this.create(
        "Review vendor proposal",
        0.88,
        "teams"
      ),

      this.create(
        "Send budget forecast",
        0.81,
        "teams"
      )

    ];

  }

};
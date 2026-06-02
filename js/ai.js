const AIEngine = {

  analyzeTranscript(text) {

    if (!text || !text.trim()) return [];

    const lines = text
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    const suggestions = [];

    const patterns = [
      /i will (.+)/i,
      /i'll (.+)/i,
      /we need to (.+)/i,
      /must (.+)/i,
      /action:? (.+)/i,
      /todo:? (.+)/i,
      /please (.+)/i
    ];

    for (const line of lines) {

      for (const pattern of patterns) {

        const match = line.match(pattern);

        if (match && match[1]) {

          suggestions.push(
            SuggestionService.create(
              this.clean(match[1]),
              0.75,
              "manual-transcript"
            )
          );

        }

      }

    }

    return suggestions;
  },

  clean(text) {
    return text
      .replace(/^[^a-zA-Z]+/, "")
      .trim();
  }

};
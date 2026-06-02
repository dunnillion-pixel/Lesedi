const AIEngine = {

  async analyzeTranscript(text, source) {

    if (!text || !text.trim()) return [];

    const prompt = this.buildPrompt(text, source);

    const raw = await this.callLLM(prompt);

    return this.parseResponse(raw, source);

  },

  buildPrompt(text, source) {

    return `
You extract tasks from meetings.

Return JSON only:
[
  { "text": "...", "confidence": 0.0 }
]

Meeting: ${source.title}
Type: ${source.type}

Transcript:
"""
${text}
"""
    `.trim();

  },

  async callLLM(prompt) {

    console.log("LLM PROMPT:", prompt);

    return new Promise(resolve => {

      setTimeout(() => {

        resolve(JSON.stringify([

          {
            text: "Prepare executive summary",
            confidence: 0.93
          },
          {
            text: "Review vendor proposal",
            confidence: 0.88
          },
          {
            text: "Send budget forecast",
            confidence: 0.84
          }

        ]));

      }, 600);

    });

  },

  parseResponse(raw, source) {

    try {

      const parsed = JSON.parse(raw);

      return parsed.map(item =>
        SuggestionService.create(
          item.text,
          item.confidence,
          source.id
        )
      );

    } catch (e) {

      console.error(e);

      return [];

    }

  }

};
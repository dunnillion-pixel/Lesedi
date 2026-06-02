const AIEngine = {

  async analyzeTranscript(text, sourceMeta = null) {

    if (!text || !text.trim()) return [];

    const prompt = this.buildPrompt(text, sourceMeta);

    const raw = await this.callLLM(prompt);

    return this.parseResponse(raw, sourceMeta);

  },

  buildPrompt(text, sourceMeta) {

    const context = sourceMeta
      ? `Meeting: ${sourceMeta.title}\nType: ${sourceMeta.type}\n`
      : "";

    return `
You are a meeting intelligence system.

Extract actionable tasks from the transcript.

Rules:
- Only extract real actions
- Ignore conversation filler
- Convert vague statements into clear tasks
- Assign confidence (0 to 1)
- Output STRICT JSON only

${context}

Format:
[
  {
    "text": "action",
    "confidence": 0.0
  }
]

Transcript:
"""
${text}
"""
    `.trim();

  },

  async callLLM(prompt) {

    // MOCK LLM (still safe for MVP-B2)
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
            confidence: 0.89
          },
          {
            text: "Send budget forecast",
            confidence: 0.84
          }

        ]));

      }, 700);

    });

  },

  parseResponse(raw, sourceMeta) {

    try {

      const parsed = JSON.parse(raw);

      return parsed.map(item =>
        SuggestionService.create(
          item.text,
          item.confidence,
          sourceMeta ? sourceMeta.type : "unknown"
        )
      );

    } catch (e) {

      console.error("LLM parse error:", e);

      return [];

    }

  }

};
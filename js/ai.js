const AIEngine = {

  async analyzeTranscript(text) {

    if (!text || !text.trim()) return [];

    const prompt = this.buildPrompt(text);

    const raw = await this.callLLM(prompt);

    return this.parseResponse(raw);

  },

  buildPrompt(text) {

    return `
You are a task extraction system.

Convert the transcript into actionable tasks.

Rules:
- Extract only clear actions
- Each action must be short and imperative
- Ignore chit-chat
- Assign confidence between 0 and 1
- Output STRICT JSON only

Format:
[
  {
    "text": "action here",
    "confidence": 0.0-1.0
  }
]

Transcript:
"""
${text}
"""
    `.trim();

  },

  async callLLM(prompt) {

    // 🔴 MOCK LLM (safe fallback for now)
    // This simulates what OpenAI/Azure will return later

    console.log("LLM PROMPT:", prompt);

    return new Promise(resolve => {

      setTimeout(() => {

        resolve(JSON.stringify([

          {
            text: "Prepare executive summary",
            confidence: 0.92
          },
          {
            text: "Review vendor proposal",
            confidence: 0.88
          },
          {
            text: "Send budget forecast",
            confidence: 0.81
          }

        ]));

      }, 600);

    });

  },

  parseResponse(raw) {

    try {

      const parsed = JSON.parse(raw);

      return parsed.map(item =>
        SuggestionService.create(
          item.text,
          item.confidence,
          "llm-transcript"
        )
      );

    } catch (e) {

      console.error("LLM parse error:", e);

      return [];

    }

  }

};
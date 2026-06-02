const SourceService = {

  create(type, title, rawText) {

    return {
      id: crypto.randomUUID(),
      type,
      title,
      rawText,
      createdAt: Date.now()
    };

  },

  createTeamsSimulated(
    title,
    transcript
  ) {

    return this.create(
      "teams-simulated",
      title,
      transcript
    );

  }

};
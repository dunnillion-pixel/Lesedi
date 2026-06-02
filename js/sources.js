const SourceService = {

  list: Storage.loadSources(),

  create(type, title, rawText) {

    const source = {
      id: crypto.randomUUID(),
      type,
      title,
      rawText,
      createdAt: Date.now()
    };

    this.list.push(source);

    Storage.saveSources(this.list);

    ActivityService.record(
      "SOURCE_CREATED",
      source.id,
      source.id,
      "Meeting created: " + title
    );

    return source;
  },

  createTeamsSimulated(title, transcript) {

    return this.create(
      "teams-simulated",
      title,
      transcript
    );

  }

};
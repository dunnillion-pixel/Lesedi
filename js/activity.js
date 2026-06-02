const ActivityService = {

  list: Storage.loadActivities(),

  record(type, sourceId, entityId, description) {

    const activity = {
      id: crypto.randomUUID(),
      type,
      sourceId: sourceId || null,
      entityId: entityId || null,
      description,
      createdAt: Date.now()
    };

    this.list.push(activity);

    Storage.saveActivities(this.list);

    return activity;
  },

  getAll() {
    return this.list.sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

};
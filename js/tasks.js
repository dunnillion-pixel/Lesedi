const TaskService = {

  create(text, priority, dueAt) {

    return {
      id: crypto.randomUUID(),
      text,
      priority,
      dueAt,
      createdAt: Date.now(),
      done: false
    };

  }

};
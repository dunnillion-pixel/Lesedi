const StatusService = {

  getStatus(task) {

    if (task.done) {
      return "🟢";
    }

    const now = Date.now();

    if (
      task.dueAt &&
      now > task.dueAt
    ) {
      return "🔴";
    }

    const ageHours =
      (now - task.createdAt) /
      (1000 * 60 * 60);

    if (ageHours > 24) {
      return "🔴";
    }

    return "🟠";
  },

  score(task) {

    let score =
      task.priority * 10;

    const now = Date.now();

    const ageHours =
      (now - task.createdAt) /
      (1000 * 60 * 60);

    if (ageHours > 72) {
      score += 20;
    }
    else if (ageHours > 24) {
      score += 10;
    }

    if (task.dueAt) {

      const diff =
        task.dueAt - now;

      if (diff < 0) {
        score += 30;
      }
      else if (
        diff < 86400000
      ) {
        score += 20;
      }
      else if (
        diff < 259200000
      ) {
        score += 10;
      }

    }

    return score;
  }

};
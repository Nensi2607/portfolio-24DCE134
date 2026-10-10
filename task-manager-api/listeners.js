
const taskEvents = require("./events");

taskEvents.on("task-created", async (task) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
      `[Notification] Task "${task.title}" created at ${new Date().toISOString()}, assigned user: ${task.assignedUser || "Unassigned"}`
    );

    console.log(
      `[Notification Completed] ${new Date().toISOString()}`
    );
  } catch (error) {
    taskEvents.emit("error", error);
  }
});

taskEvents.on("task-deleted", (task) => {
  console.log(
    `[Task Deleted] Task "${task.title}" deleted at ${new Date().toISOString()}`
  );
});

taskEvents.on("error", (error) => {
  console.error("[Event Error]", error.message);
});

module.exports = taskEvents;

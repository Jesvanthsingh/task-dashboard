const tasks = [];
const modal = document.querySelector("#modal");
const form = document.querySelector("#form");

document.querySelector("#date").textContent =
  new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

document.querySelector("#open").onclick = () => modal.showModal();
document.querySelector("#cancel").onclick = () => modal.close();

form.onsubmit = event => {
  event.preventDefault();

  tasks.push({
    title: form.title.value,
    due: form.due.value,
    priority: form.priority.value,
    done: false
  });

  form.reset();
  modal.close();
  render();
};

function render() {
  const search = document.querySelector("#search").value.toLowerCase();
  const filter = document.querySelector("#filter").value;

  const visibleTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search) &&
    (filter === "all" || (filter === "done") === task.done)
  );

  const list = document.querySelector("#list");

  list.innerHTML = visibleTasks.map(task => {
    const index = tasks.indexOf(task);

    return `
      <div class="task ${task.done ? "done" : ""}">
        <input type="checkbox" ${task.done ? "checked" : ""}
          onchange="toggleTask(${index}, this.checked)">
        <div class="task-info">
          <div class="task-title"></div>
          <div class="task-meta">Due ${task.due}</div>
        </div>
        <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
    `;
  }).join("") || '<div class="empty">No tasks yet. Create your first task.</div>';

  document.querySelectorAll(".task-title").forEach((element, index) => {
    element.textContent = visibleTasks[index].title;
  });

  document.querySelector("#total").textContent = tasks.length;
  document.querySelector("#completed").textContent =
    tasks.filter(task => task.done).length;
  document.querySelector("#progressCount").textContent =
    tasks.filter(task => !task.done).length;
  document.querySelector("#overdue").textContent =
    tasks.filter(task =>
      !task.done && task.due < new Date().toISOString().slice(0, 10)
    ).length;
}

function toggleTask(index, isDone) {
  tasks[index].done = isDone;
  render();
}

document.querySelector("#search").oninput = render;
document.querySelector("#filter").onchange = render;

render();
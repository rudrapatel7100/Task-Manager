const form = document.querySelector("form");
const input = document.querySelector("input");
const taskList = document.querySelector("#task-list");
const filterBtns = document.querySelector(".filters");
const searchInput = document.querySelector("#search-input");

let tasks = [];
let currentFilter = "all"; // Default filter is "all"
let searchTasks = "";

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  if (searchTasks !== "") {
    filteredTasks = filteredTasks.filter((task) =>
      task.text.toLowerCase().includes(searchTasks.toLowerCase()),
    );
  }

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No tasks yet";
    taskList.appendChild(emptyMsg);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    li.appendChild(checkbox);

    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;
    li.appendChild(taskSpan);

    if (task.completed) {
      li.classList.add("completed");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const taskText = input.value.trim();

  if (taskText === "") {
    return;
  }

  tasks.push({ text: taskText, completed: false });
  saveTasks();
  renderTasks();

  input.value = "";
});

taskList.addEventListener("click", (evt) => {
  console.log(evt.target);

  if (evt.target.tagName === "BUTTON") {
    const index = Number(evt.target.parentElement.dataset.index);
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  if (evt.target.tagName === "INPUT") {
    const index = Number(evt.target.parentElement.dataset.index);
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }
});

filterBtns.addEventListener("click", (evt) => {
  if (evt.target.tagName === "BUTTON") {
    currentFilter = evt.target.dataset.filter;
    renderTasks();
  }
});

searchInput.addEventListener("input", (evt) => {
  searchTasks = evt.target.value;
  renderTasks();
});

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }

  renderTasks();
}

loadTasks();

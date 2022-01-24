const { ipcRenderer } = require("electron");

const taskForm = document.querySelector("#taskForm");
const taskName = document.querySelector("#taskName");
const taskDescription = document.querySelector("#taskDescription");
const taskList = document.querySelector("#taskList");

let tasks = [];
let updateStatus = false;
let updateTaskId = "";

function deleteTask(_id) {
  const result = confirm("Are your sure you want to delete it?");
  if (result) ipcRenderer.send("deleteTask", _id);
  else return;
}

function editTask(_id) {
  updateStatus = true;
  updateTaskId = _id;
  const taskFound = tasks.find((task) => task._id === _id);
  taskName.value = taskFound.name;
  taskDescription.value = taskFound.description;
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.map((task) => {
    taskList.innerHTML += `
    <li>
      <div class="task__content">${task.name}</div>
      <button class="button " onClick="deleteTask('${task._id}')"><img src="https://img.icons8.com/external-wanicon-lineal-color-wanicon/27/000000/external-delete-user-interface-wanicon-lineal-color-wanicon.png"/></button>
      <button class="button " onClick="editTask('${task._id}')"><img src="https://img.icons8.com/office/27/000000/edit.png"/></button>
      </li>

        `;
  });
}
{/* <button class="btn btn-primary" onClick="editTask('${task._id}')">Edit</button> */}
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = {
    name: taskName.value,
   
  };

  if (!updateStatus) ipcRenderer.send("newTask", task);
  else ipcRenderer.send("updateTask", { ...task, updateTaskId });

  taskForm.reset();
  taskName.focus();
});

ipcRenderer.on("newTaskCreated", (e, args) => {
  const newTask = JSON.parse(args);
  tasks.push(newTask);
  alert("Task Created Successfully");
  renderTasks(tasks);
});

ipcRenderer.send("getTasks");

ipcRenderer.on("tasks", (e, args) => {
  const tasksReceived = JSON.parse(args);
  tasks = tasksReceived;
  renderTasks(tasks);
});

ipcRenderer.on("taskDeleted", (e, args) => {
  const taskDeleted = JSON.parse(args);
  tasks = tasks.filter((task) => {
    return task._id !== taskDeleted._id;
  });
  renderTasks(tasks);
});

ipcRenderer.on("taskUpdated", (e, args) => {
  const updatedTask = JSON.parse(args);
  tasks = tasks.map((task) => {
    if (task._id === updatedTask._id) {
      task.name = updatedTask.name;
      task.description = updatedTask.description;
    }
    return task;
  });
  updateStatus = false;
  renderTasks(tasks);
});

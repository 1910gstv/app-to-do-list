const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;
//getting local storage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      //se o status do todo for completo, set o valor de isCompleted como checked
      let isCompleted = todo.status == "completo" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += ` <li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}"  ${isCompleted}>
                        <p class="${isCompleted}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                        <ul class="task-menu">
                            <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen"></i>Editar</li>
                            <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i>Excluir</li>
                        </ul>
                    </div>
                </li>`;
      }
    });
  }
  //se estiver vazio, insere este valor na taskbox do span
  taskBox.innerHTML = li || `<span> Você não tem nenhuma tarefa aqui</span>`;
}

showTodo("all");

function showMenu(selectedTask) {
  //getting task menu div
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    //removendo a classe show do menu de tarefas ao clicar no documetno
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

function deleteTask(deleteId) {
  //removendo a tarefa selecionada do array/todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

clearAll.addEventListener("click", () => {
  //removendo todas as tarefas do array/todos
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});

function updateStatus(selectedTask) {
  //selecionar o paragrafo que contem o nome da tarefa
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    //atualizando o status de uma tarefa selecionada para completo
    todos[selectedTask.id].status = "completo";
  } else {
    taskName.classList.remove("checked");
    //atualizando o status de uma tarefa selecionada para pendente
    todos[selectedTask.id].status = "pendente";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) {
      // se isEditedTask não for verdadeira
      if (!todos) {
        //se todos não existir, passar um array vazio para todo
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pendente" };
      todos.push(taskInfo); //adicionando novas tarefas para todos
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});

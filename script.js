const UNCOMPLETED_LIST_TODO_ID = "todos";
const COMPLETED_LIST_TODO_ID = "completed-todos";

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addTodo();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil di simpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromTodos();
});

function addTodo() {
    const uncompletedTODOList = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);

    const titleTodo = document.getElementById("title").value;
    const authorTodo = document.getElementById("author").value;
    const yearTodo = document.getElementById("year").value;
    const isCompleted = document.getElementById("inputBookIsCompleted").checked;
    const todo = makeTodo(titleTodo, authorTodo, yearTodo, isCompleted);
    const todosObject = composeTodoObject(titleTodo, authorTodo, yearTodo, isCompleted);

    todo[TODO_ITEMID] = todosObject.id;
    todos.push(todosObject);

    if (isCompleted) {
        listCompleted.append(todo);
    } else {
        uncompletedTODOList.append(todo);
    }
    updateDataToStorage();
}

function makeTodo(title, author, year, isCompleted) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textAuthor = document.createElement("h3");
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.innerText = year;
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if (isCompleted) {
        container.append(
            createTrashButton(),
            createUndoButton(),
        );
    } else {
        container.append(
            createCheckButton(),
            createTrashButton()
        );
    }
    return container;
}

function undoTaskFromCompleted(taskElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
    const taskTitle = taskElement.querySelector(".inner > h2").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h3").innerText;
    const taskYear = taskElement.querySelector(".inner > p").innerText;

    const newTodo = makeTodo(taskTitle, taskAuthor, taskYear, false);
    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = false;
    newTodo[TODO_ITEMID] = todo.id;
    listUncompleted.append(newTodo);
    taskElement.remove();
    updateDataToStorage();
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);
    const taskTitle = taskElement.querySelector(".inner > h2").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h3").innerText;
    const taskYear = taskElement.querySelector(".inner > p").innerText;

    const newTodo = makeTodo(taskTitle, taskAuthor, taskYear, true);
    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = true;
    newTodo[TODO_ITEMID] = todo.id;
    listCompleted.append(newTodo);
    taskElement.remove();
    updateDataToStorage();
}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function removeTaskFromCompleted(taskElement) {
    const todoPosition = findTodoIndex(taskElement[TODO_ITEMID]);
    todos.splice(todoPosition, 1);
    taskElement.remove();
    updateDataToStorage();
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        addTaskToCompleted(event.target.parentElement);
    });
}

function refreshDataFromTodos() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);


    for (todo of todos) {
        const newTodo = makeTodo(todo.title, todo.author, todo.year, todo.isCompleted);
        newTodo[TODO_ITEMID] = todo.id;


        if (todo.isCompleted) {
            listCompleted.append(newTodo);
        } else {
            listUncompleted.append(newTodo);
        }
    }
}
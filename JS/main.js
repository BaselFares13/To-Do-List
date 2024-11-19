let taskInput = document.querySelector(".task-input");
let addButton = document.querySelector(".add-button");
let taskContent = document.querySelector(".tasks-content");
let taskCount = document.querySelector(".task-count span");
let completedTasks = document.querySelector(".completed-tasks span");
let warningAlert = document.querySelector(".alertContainer");
let removeAllBtn = document.querySelector(".remove-all");
let completeAllBtn = document.querySelector(".complete-all");

warningAlert.onclick = function (e) {
    if (e.target !== warningAlert.children[0] && e.target !== warningAlert.children[0].children[0]) this.style.display = "none";
}

warningAlert.children[0].children[1].onclick = function () {
    this.parentNode.parentNode.style.display = "none";
}

if (localStorage.getItem("tasksArr")) {

    if (document.body.contains(document.querySelector(".no-tasks-massage")) && getTasksArr().length != 0) {
        document.querySelector(".no-tasks-massage").remove();
    }

    getTasksArr().forEach((task) => {
        createTaskSpanAndAddToWebsite(task.taskText, task.finished, task.id);
    }); 

    completeAllBtn.textContent = JSON.parse(localStorage.getItem("AllCompleted")) ? "Uncomplete All" : "Complete All";

    updateTaskStats();

} else {
    localStorage.setItem("tasksArr", JSON.stringify([]));
    localStorage.setItem("AllCompleted", false);
}

window.onload = function () {
    taskInput.focus();
}

taskInput.addEventListener("keydown", function (e) {
    if (e.key === 'Enter') {
        
        if (taskInput.value.trim().length > 0) {
            addButton.click();
        } else {
            showNullStringAlert();
        }
    }
});

addButton.onclick = function () {
    let taskInputValue = taskInput.value.trim();
    
    if (taskInputValue === "") {
        showNullStringAlert();
    } else {

        if (isAlreayExist(taskInputValue)) {
            showTheSameTaskExistsAlert();
        } else {

            if (document.body.contains(document.querySelector(".no-tasks-massage"))) {
                document.querySelector(".no-tasks-massage").remove();
            }

            let task = createTaskObjectAndAddToLocalStorage(taskInputValue);

            createTaskSpanAndAddToWebsite(taskInputValue, false, task.id);

            localStorage.setItem("AllCompleted", false);

            taskInput.value = "";

            updateTaskStats();
        }
    }
}

function showNullStringAlert() {
    warningAlert.style.display = "block";
    warningAlert.children[0].children[0].textContent = "You Did Not Insert A Task";
}

function showTheSameTaskExistsAlert() {
    warningAlert.style.display = "block";
    warningAlert.children[0].children[0].textContent = "There Is Already A Same Task Exists";
}

document.addEventListener("click", function (e) {
    if (e.target.className === "delete") {
        setTasksArr(removeTaskFromTasksArrById(getTasksArr(), +e.target.parentNode.getAttribute("data-id")));

        e.target.parentNode.remove();
        if (taskContent.childElementCount == 0) {
            showNoTasksMassage();
        }

        let allRemoved = getTasksArr().length == 0;
        if (allRemoved) {
            completeAllBtn.textContent = "Complete All";
            localStorage.setItem("AllCompleted", false);
        }


        updateTaskStats();
    }

    if (e.target.classList.contains("task-box")) {
        e.target.classList.toggle("finished");

        setTasksArr(updateFinishedProparityFromLocalStorage(getTasksArr(), e.target.classList.contains("finished"), +e.target.getAttribute("data-id")));

        let allCompleted = getTasksArr().every(task => task.finished === true);
        completeAllBtn.textContent = allCompleted ? "Uncomplete All" : "Complete All";
        if (allCompleted) localStorage.setItem("AllCompleted", true);
        else localStorage.setItem("AllCompleted", false);

        updateTaskStats();
    }
});

function showNoTasksMassage() {
    let noTask = document.createElement("span");
    noTask.classList.add("no-tasks-massage");
    noTask.textContent = "There Are No Tasks To Show";
    taskContent.appendChild(noTask);
}

function updateTaskStats() {
    taskCount.innerHTML = document.querySelectorAll(".tasks-content .task-box").length;
    completedTasks.innerHTML = document.querySelectorAll(".tasks-content .finished").length;
}

function createTaskObjectAndAddToLocalStorage(_taskText) {
    let _id = Date.now();

    let task = {
        taskText: _taskText,
        finished: false,
        id: _id,
    }

    let tasksArr = getTasksArr();
    tasksArr.push(task);

    setTasksArr(tasksArr);

    return task;
}

function createTaskSpanAndAddToWebsite(taskText, finished, id) {

    let taskBox = document.createElement("span");
    taskBox.innerHTML = `
            <p>${taskText}</p>
            <span class="delete">Delete</span>
        `;
    taskBox.className = "task-box";

    if (finished) {
        taskBox.classList.add("finished");
    } 

    taskBox.setAttribute("data-id", id);
    
    taskContent.appendChild(taskBox);
}

function getTasksArr() {
    return JSON.parse(localStorage.getItem("tasksArr"));
}

function setTasksArr(tasksArr) {
    window.localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
}

function removeTaskFromTasksArrById(tasksArr, id) {
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].id === id) {
            tasksArr.splice(i, 1);
            break;
        };
    }

    return tasksArr;
}

function updateFinishedProparityFromLocalStorage(tasksArr,value, id) {
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].id === id) {
            tasksArr[i].finished = value;
            break;
        };
    }

    return tasksArr;
}

function isAlreayExist(taskTextValue) {
    
    for (let i = 0; i < getTasksArr().length; i++) {
        if (getTasksArr()[i].taskText === taskTextValue) return true;
    };

    return false;
}

function finishedAll() {
    Array.from(taskContent.children).forEach((task) => {
        if (!task.classList.contains("finished")) {
            task.classList.add("finished");
            setTasksArr(updateFinishedProparityFromLocalStorage(getTasksArr(), true, +task.getAttribute("data-id")));
        };
    });
}

function unfinishedAll() {
    Array.from(taskContent.children).forEach((task) => {
        if (task.classList.contains("finished")) {
            task.classList.remove("finished");
            setTasksArr(updateFinishedProparityFromLocalStorage(getTasksArr(), false, +task.getAttribute("data-id")));
        };
    });
}

removeAllBtn.onclick = function () {
    Array.from(taskContent.children).forEach((task) => {
        setTasksArr(removeTaskFromTasksArrById(getTasksArr(), +task.getAttribute("data-id")));
        task.remove();
    })
    updateTaskStats();
    showNoTasksMassage();
}

function showThereAreNoTasksToComplete() {
    warningAlert.style.display = "block";
    warningAlert.children[0].children[0].textContent = "There Are No Tasks To Complete";
}


completeAllBtn.onclick = function () {
    if (getTasksArr().length > 0) {
        if (this.textContent === "Complete All") {
            finishedAll();
            this.textContent = "Uncomplete All";
            localStorage.setItem("AllCompleted", true);
        } else {
            unfinishedAll();
            this.textContent = "Complete All";
            localStorage.setItem("AllCompleted", false);
        }

        updateTaskStats();
    } else {
        showThereAreNoTasksToComplete();
    }
}

const addNewSubtaskButton = document.querySelector("#addNewSubtaskButton");
const saveInLocalStorageButton = document.querySelector("#saveInLocalStorageButton");
const newTaskButton = document.querySelector("#newTaskButton");


addNewSubtaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    addSubTask("", 0);
})

newTaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearForm();
})

const init = () => {
    let taskIds = localStorage.getItem('taskIds');
    if (taskIds == null) {
        localStorage.setItem('taskIds', JSON.stringify([]))
    }
}
init();

const getNewId = () => {
    let taskIds = JSON.parse(localStorage.getItem('taskIds'));
    if (taskIds.length == 0)
    {
        return 1;
    }
    const lastId = Math.max(...taskIds);
    return lastId + 1;
}

const drawTaskList = () => {
    const resultContainer = document.querySelector("#tasklist");
    resultContainer.innerHTML = "";
    let taskIds = JSON.parse(localStorage.getItem('taskIds'));
    taskIds.forEach(taskId => {
        drawTaskListNode(taskId);
    });
}

const drawTaskListNode = (taskId) => {
    const template = document.querySelector("#tasklist-task-template > div");
    const clone = template.cloneNode(true);

    const task = JSON.parse(localStorage.getItem(`task-${taskId}`));

    clone.querySelector(".tasklist-task-name").textContent = task.name;

    let subTaskContainer = clone.querySelector(".tasklist-task-subtask-container");
    const subTasktemplate = document.querySelector("#tasklist-subtask-template > div");
    task.subTasks.forEach(subTask => {
        const subTaskclone = subTasktemplate.cloneNode(true);

        subTaskclone.querySelector(".tasklist-task-subtask-name").textContent = subTask.name;
        subTaskclone.querySelector(".tasklist-task-subtask-hours").textContent = subTask.hours;

        subTaskContainer.appendChild(subTaskclone);
    });

    clone.querySelector(".tasklist-task-load").addEventListener("click", e => {
        loadTask(taskId);
    })

    const resultContainer = document.querySelector("#tasklist");

    resultContainer.appendChild(clone);
}
drawTaskList();

const clearForm = () => {
    const taskId = document.querySelector("#taskId");
    taskId.value = getNewId();

    const taskName = document.querySelector("#taskNameInput");
    taskName.value = "";

    const subTasks = document.querySelector("#resultContainer");
    subTasks.innerHTML = ''
}

clearForm();

const saveTask = () => {
    const taskId = document.querySelector("#taskId").value;

    const taskName = document.querySelector("#taskNameInput").value;

    const subTaskNodes = document.querySelector("#resultContainer").childNodes;
    const subTask = [];
    subTaskNodes.forEach(e => {
        const name = e.querySelector(".form__subtask-input").value;
        const hours = e.querySelector(".form__subtask-input_time").value;
        subTask.push({
            name: name,
            hours: hours
        });
    });

    const taskIds = JSON.parse(localStorage.getItem('taskIds'));
    if (!taskIds.includes(taskId)) {
        localStorage.setItem('taskIds', JSON.stringify([...taskIds, taskId]));     
    }

    localStorage.setItem(`task-${taskId}`, JSON.stringify({
        name: taskName,
        subTasks: subTask
    }));

    drawTaskList();
}

const loadTask = (taskId) => {
    clearForm();
    const taskJson = localStorage.getItem(`task-${taskId}`);

    const task = JSON.parse(taskJson);

    document.querySelector("#taskNameInput").value = task.name;
    document.querySelector("#taskId").value = taskId;

    task.subTasks.forEach(subtask => {
        addSubTask(subtask.name, subtask.hours);
    });
}

saveInLocalStorageButton.addEventListener("click", e => {
    e.preventDefault();
    saveTask();
})

const addSubTask = (text, hours) => {
    const template = document.querySelector("#subTaskTemplate > div");
    const clone = template.cloneNode(true);

    clone.querySelector(".form__subtask-delete-button").addEventListener("click", e => {
        e.currentTarget.parentNode.remove();
    })

    clone.querySelector(".form__subtask-input").value = text;
    clone.querySelector(".form__subtask-input_time").value = hours;

    const resultContainer = document.querySelector("#resultContainer");

    resultContainer.appendChild(clone);
}
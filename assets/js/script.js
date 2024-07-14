// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

let tasks = [];


$('#openModalButton').click(function() {
    $('#formModal').modal('show');
});

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const newId = nextId;
    nextId++;
    localStorage.setItem("nextId", nextId);
    return newId;
}

// Todo: create a function to create a task card
function createTaskCard({
    taskId, taskName, taskDesc, taskDue, taskStatus
}) {

const taskCard = $('<div></div>').addClass('task-card').attr('id', `task${taskId}`);

const taskNameEl = $('<h3></h3>').text(taskName);
const taskDescEl = $('<p></p>').text(taskDesc);
const taskDueEl = $('<p></p>').text(`${dayjs(taskDue).format('MM/DD/YYYY')}`);
const taskStatusEl = $('<p></p>').text(taskStatus);

const deleteBtn = $('<button></button>').addClass('btn-class').text('Delete');

deleteBtn.on('click', handleDeleteTask);
    
taskCard.append(taskNameEl, taskDescEl, taskDueEl, taskStatusEl, deleteBtn);

$('task-list').append(taskCard);

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    const taskListContainer = $('#task-list');
    taskListContainer.empty();

    for(i = 0; i < taskList.length; i++) {
        const taskCard = createTaskCard(taskList[i]);
        $('#todo-cards').append(taskCard);
        $(`#task${taskList[i].taskId}`).draggable();

    };
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    
    const taskName = $('#task-name').val();
    const taskDesc = $('#task-desc').val();
    const taskDue = $('#task-due').val();
    const taskStatus = $('#task-status').val();

    const addedTask = {
        taskId: generateTaskId(),
        taskName: taskName,
        taskDue: taskDue,
        taskDesc: taskDesc,
        taskStatus: taskStatus,
    };

    taskList.push(addedTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

    const taskId = $(event.target).closest('.task-card').attr('id');

    const updatedTaskList = tasks.filter(function (task) {
        return task.taskId !== taskId;
    });

    tasks = updatedTaskList;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    $(event.target).closest('.task-card').addClass('hidden');

};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const dropTaskId = ui.draggable.draggable.attr('id');
    const newSwimLane = event.target.id;

    const task = tasks.find(function (task) {
        return task.id === dropTaskId;
    });

    task.status = newSwimLane;

    ui.draggable.appendTo(`#${newStatusLane}`);

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    $('#add-btn').on('click', handleAddTask);

    $('.swim-lanes').droppable({
        drop: function(event, ui) {
            handleDrop(event, ui);
        }
    });

    $('#task-due').datepicker();

renderTaskList();
});

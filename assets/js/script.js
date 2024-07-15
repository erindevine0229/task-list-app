// Retrieve tasks and nextId from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let newId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Todo: create a function to generate a unique task id
function generateTaskId() {
    const newId = nextId;
    nextId++;
    // Set the nextId to local storage
    localStorage.setItem("nextId", nextId);
    return newId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    const taskId = task.taskId;
    const taskName = task.taskName;
    const taskDesc = task.taskDesc;
    const taskDue = task.taskDue;
    const taskStatus = task.taskStatus;

// Create a new div to hold the task card info
const taskCard = $('<div></div>').addClass('task-card').attr('id', `task${taskId}`);

// Creates elements for all the card info
const taskNameEl = $('<h3></h3>').text(taskName);
const taskDescEl = $('<p></p>').text(taskDesc);
const taskDueEl = $('<p></p>').text(`${dayjs(taskDue).format('MM/DD/YYYY')}`);
const taskStatusEl = $('<p></p>').text(taskStatus);

// Add a delete button to be used in the handleDeleteTask function.
const deleteBtn = $('<button></button>').addClass('btn-class').text('Delete');
deleteBtn.on('click', handleDeleteTask);
  
// Add the user inputs and task info elements to the card itself
taskCard.append(taskNameEl, taskDescEl, taskDueEl, taskStatusEl, deleteBtn);

// Check if the status is overdue, due today or due later based on assessTaskStaus function and set corresponding colors
if (taskStatus === 'Overdue') {
    taskCard.css('background-color', 'red');
} else if (taskStatus === 'Due Today') {
    taskCard.css('background-color', 'yellow');
} else {
    taskCard.css('background-color', 'white');
}

// Return the new taskCard to be used in following functions
return taskCard;


};


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // Start with fresh before rendering updated list to avoid repeats
    $('#task-list').empty();

// Loop through the tasks array and call createTaskCard for each
    for(let i = 0; i < tasks.length; i++) {
        const taskCard = createTaskCard(tasks[i]);
        console.log('Task card created:', taskCard);
        // Append the tasks to the paeg container from HTML
        $('#task-list').append(taskCard); 
        // make task cards all draggable elements via jquery
        $(`#task${tasks[i].taskId}`).draggable();
    };

};

// Todo: create a function to handle adding a new task
function handleAddTask () {
    // Triggers form submission
$('#task-form').submit(function (event){
    event.preventDefault();
    // retrieves info from user input from form sectons to be used in subsequent functions
    const taskName = $('#task-name').val();
    const taskDesc = $('#task-desc').val();
    const taskDue = $('#task-due').val();
    const taskStatus = assessTaskStatus(taskDue);

    // Create new task object
    const addedTask = {
        taskId: generateTaskId(),
        taskName: taskName,
        taskDue: taskDue,
        taskDesc: taskDesc,
        taskStatus: taskStatus,
    };

    // Update tasks array with new task object
    console.log(addedTask);
    tasks.push(addedTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Call render function to update the page display
    renderTaskList();

    // Made modal go away after submission
    $('#modal-form').css('display', 'none');
});

};


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

    // Gets the info of task ID from the selected (closest) task card 
    const taskId = $(event.target).closest('.task-card').attr('id').replace('task', '');

    // Filter through tasks array to match select ID to the one we want to delete
    const updatedTaskList = tasks.filter(function (task) {
        return task.taskId !== parseInt(taskId);
    });
    // Update task array to reflect no longer contains deleted task
    tasks = updatedTaskList;

    // Re-set updated array of tasks to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Take deleted task card and make it invisible
    $(event.target).closest('.task-card').addClass('hidden');

};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Make the taskCard elements draggable to be able to move from one swim lane to another
    const dropTaskId = ui.draggable.draggable.attr('id');
    // Establish a new swim lane as a taget
    const newStatusLane = event.target.id;

    // Find the task within the array and updates status to that of the new lane
    const task = tasks.find(function (task) {
        return task.taskId === parseInt(dropTaskId.replace('task', ''));
    });

    task.taskStatus = newStatusLane;

    // Append the new card to the swim lane for persistence
    ui.draggable.appendTo(`#${newStatusLane}`);

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Call to display the tasks on the page
renderTaskList();
// Add event listener to the add button to allow for calling of the handleAddTask function and trigger the modal when add button clicked
$('#add-btn').on('click', handleAddTask);

// Open modal to allow for user input
$('#open-modal-button').click(function() {
    $('#modal-form').css('display', 'block');
}); 

    // Make the swim lanes in the HTML available for the draggable cards to be dropped into (JQuery)
    $('.swim-lanes').droppable({
        drop: function(event, ui) {
            handleDrop(event, ui);
        }
    });

    // Incorporate datepicker from jquery ui
    $('#task-due').datepicker();

});


// How to assess task-status
function assessTaskStatus (taskDue) {


    // Establish value for today's date
    const today = dayjs();
    // Reference the input for task due date from user
    const dueDate = dayjs(taskDue, 'MM/DD/YYYY');

    // Compare today's date with due date and assign status to task card
    if (dueDate.isBefore(today, 'day')) {
        return 'Overdue'
    } else if (dueDate.isSame(today, 'day')) {
        return 'Due Today'
    } else {
        return 'Due Later'
    };

};

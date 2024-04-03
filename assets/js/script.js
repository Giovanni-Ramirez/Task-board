// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const formSubmit = $('#formSubmit')
const taskFormEl = $('#modalForm');
const taskNameInput = $('#task-name');
const taskTextInput = $('#task-description');
const taskDueDateInput = $('#task-date'); // mm/dd/yyyy



// DONE adding the date picker from Jquery
$( function() {
    $( "#task-date" ).datepicker();
  } );
  
// DONE TODO: create a function to generate a unique task id
function generateTaskId() {

    function generateRadomNumber () {
        return Math.floor(Math.random()* 10);
    }
    
    const length = 20;
    let id = '';
    for (i = 0; i < length; i++) {
        const randomNumber = generateRadomNumber();
        id = id + randomNumber.toString();
    }
    return Number(id)
};

// STEP #2 Reads if we have a local storage to push the newTask into
function readTasksFromStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    if (!tasks) {
        tasks = [];
    }

    return tasks
};

// STEP #3
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


// STEP #1 TODO: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskId = generateTaskId();
    const taskName = taskNameInput.val().trim();
    const taskText = taskTextInput.val().trim();
    const taskDueDate = taskDueDateInput.val();
    
    const newTask = {
        id: taskId,
        name: taskName,
        text: taskText,
        dueDate: taskDueDate,
        status: 'todo-cards'
    };

    const tasks = readTasksFromStorage();
    tasks.push(newTask);

    saveTasksToStorage(tasks);

    renderTaskList();

    // Clear the input at the end of all our work
    taskNameInput.val('');
    taskTextInput.val('');
    taskDueDateInput.val('');
}

// STEP #4 TODO: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = readTasksFromStorage();

    const todoCards = $('#todo-cards');
    todoCards.empty();

    const inProgressCard = $('#in-progress-cards');
    inProgressCard.empty();

    const doneCards = $('#done-cards');
    doneCards.empty();

    for (let task of tasks) {
        if (task.status === 'todo-cards') {
            todoCards.append(createTaskCard(task));
        } else if (task.status === 'in-progress-cards') {
            inProgressCard.append(createTaskCard(task));
        } else if (task.status === 'done-cards') {
            doneCards.append(createTaskCard(task));
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
          // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
          const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
          // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
          return original.clone().css({
            width: original.outerWidth(),
          });
        },
      });
}



// STEP #5 TODO: create a function to create a task card NEEDS MORE FOR COLORING
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('card project-card draggable my-3').attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    // task type Will always be that first DIV box to-do
    const cardDescription =$('<p>').addClass('card-text').text(task.text);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);
    // This is a function that we have to make
    cardDeleteBtn.on('click', handleDeleteTask);

    // Appending every thing to the 
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}



// STEP #6 TODO: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });

    saveTasksToStorage(tasks);

    renderTaskList();
}


// TODO: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
}

// Adding a on submit take the date and turn it into an array with the paramiter of the creat a card function
formSubmit.on('click', handleAddTask)



// TODO: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const formSubmit = $('#formSubmit')
const taskFormEl = $('#modalForm');
const taskNameInput = $('#task-name');
const taskTextInput = $('#task-description');
const taskDueDateInput = $('#task-date'); // mm/dd/yyyy



// DONE adding the date picker from Jquery
// $( function() {
//     $( "#task-date" ).datepicker();
// } );
  
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
        if (task.status === 'to-do') {
            todoCards.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressCard.append(createTaskCard(task));
        } else if (task.status === 'done') {
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

// STEP #5 TODO: a function to create a task card  *** NEEDS MORE FOR COLORING ***
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

    // Coloring goes here
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    
        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
          taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
          taskCard.addClass('bg-danger text-white');
          cardDeleteBtn.addClass('border-light');
        }
      }


    // Appending every thing to the taskCard
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// STEP #1 When the button is first clicked
function handleAddTask(event){
    event.preventDefault();

    const taskId = generateTaskId();
    const taskName = taskNameInput.val().trim();
    const taskText = taskTextInput.val().trim();
    const taskDueDate = taskDueDateInput.val();
    
    // makes an object to of the input fields
    const newTask = {
        id: taskId,
        name: taskName,
        text: taskText,
        dueDate: taskDueDate,
        status: 'to-do'
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


// TODO: create a function to handle deleting a task 
function handleDeleteTask(){
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    // console.log(`This is the id we are looking for a match ${taskId}`)
    // console.log(tasks)

    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === Number(taskId)) {
            // console.log('hey we found a match!!!');
            tasks.splice(i, 1);
        }
    }

    // console.log(tasks);

    saveTasksToStorage(tasks);

    renderTaskList();
}


// TODO: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    console.log(tasks)
    console.log(taskId)
    console.log(newStatus)

    // for (let task of tasks) {
    //     if (task.id === taskId) {
    //         task.status = newStatus;
    //     }
    // }

    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === Number(taskId)) {
            // console.log('hey we found a match!!!');
            tasks[i].status = newStatus;
        }
    }

    saveTasksToStorage(tasks);

    renderTaskList();
}

// Adding a on submit take the date and turn it into an array with the paramiter of the creat a card function
formSubmit.on('click', handleAddTask)



// TODO: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    renderTaskList();

    $('#task-date').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd/mm/yy"
    });

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

});

let taskId = 0;
let tasks = [];

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') return;

    const task = {
        id: taskId++,
        text: taskText,
        status: 'todo',
        completed: false
    };

    tasks.push(task);
    input.value = '';
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            task.status = 'completed';
        } else {
            task.status = 'todo';
        }
        renderTasks();
    }
}

function moveTask(id, newStatus) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.status = newStatus;
        if (newStatus === 'completed') {
            task.completed = true;
        } else {
            task.completed = false;
        }
        renderTasks();
    }
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText && newText.trim() !== '') {
            task.text = newText.trim();
            renderTasks();
        }
    }
}

function createTaskElement(task) {
    return `
        <div class="task-item" draggable="true" ondragstart="drag(event)" data-task-id="${task.id}">
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" 
                 onclick="toggleTask(${task.id})"></div>
            <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
            <div class="task-options">
                <button class="task-btn edit-btn" onclick="editTask(${task.id})">✎</button>
                <button class="task-btn delete-btn" onclick="deleteTask(${task.id})">×</button>
            </div>
        </div>
    `;
}

function renderTasks() {
    const todoContainer = document.getElementById('todoTasks');
    const progressContainer = document.getElementById('progressTasks');
    const completedContainer = document.getElementById('completedTasks');

    const todoTasks = tasks.filter(task => task.status === 'todo');
    const progressTasks = tasks.filter(task => task.status === 'progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    todoContainer.innerHTML = todoTasks.length ? 
        todoTasks.map(createTaskElement).join('') : 
        '<div class="empty-state">No tasks yet</div>';

    progressContainer.innerHTML = progressTasks.length ? 
        progressTasks.map(createTaskElement).join('') : 
        '<div class="empty-state">No tasks yet</div>';

    completedContainer.innerHTML = completedTasks.length ? 
        completedTasks.map(createTaskElement).join('') : 
        '<div class="empty-state">No tasks yet</div>';
}

// Drag and drop functionality
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.dataset.taskId);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const taskId = parseInt(ev.dataTransfer.getData("text"));
    const column = ev.target.closest('.task-column');
    
    if (column) {
        let newStatus;
        if (column.id === 'column1') newStatus = 'todo';
        else if (column.id === 'column2') newStatus = 'progress';
        else if (column.id === 'column3') newStatus = 'completed';
        
        if (newStatus) {
            moveTask(taskId, newStatus);
        }
    }
}

// Initialize drag and drop event listeners
function initializeDragAndDrop() {
    document.querySelectorAll('.task-column').forEach(column => {
        column.addEventListener('dragover', allowDrop);
        column.addEventListener('drop', drop);
    });
}

// Handle Enter key in input
function initializeEventListeners() {
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

// Sample tasks to demonstrate the interface
function addSampleTasks() {
    tasks = [
        { id: taskId++, text: "Design user interface mockups", status: 'todo', completed: false },
        { id: taskId++, text: "Set up development environment", status: 'todo', completed: false },
        { id: taskId++, text: "Implement authentication system", status: 'progress', completed: false },
        { id: taskId++, text: "Create database schema", status: 'progress', completed: false },
        { id: taskId++, text: "Write project documentation", status: 'completed', completed: true },
        { id: taskId++, text: "Initial project setup", status: 'completed', completed: true }
    ];
    renderTasks();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeDragAndDrop();
    addSampleTasks();
});
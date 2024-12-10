const apiBase = "http://127.0.0.1:8000/api/tasks/";

const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const deleteAllButton = document.getElementById('deleteAll');
const errorMessage = document.getElementById('errorMessage');

const taskModal = document.getElementById('taskModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditButton = document.getElementById('saveEdit');
const closeModalButton = document.getElementById('closeModal');
let editingTaskId = null;

// Fetch and display tasks
const fetchTasks = async () => {
    try {
        const response = await fetch(apiBase);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const tasks = await response.json();
        taskList.innerHTML = tasks.map(task => `
            <li>
                <span>${task.title}</span>
                <div>
                    <button onclick="openEditModal(${task.id}, '${task.title}')">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </li>
        `).join('');
        errorMessage.textContent = '';
    } catch (error) {
        errorMessage.textContent = 'Failed to load tasks. Please try again.';
        console.error(error);
    }
};

// Add a new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!taskInput.value.trim()) return;
    try {
        await fetch(apiBase + 'create/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskInput.value.trim(), completed: false })
        });
        taskInput.value = '';
        fetchTasks();
    } catch (error) {
        errorMessage.textContent = 'Failed to add task. Please try again.';
        console.error(error);
    }
});

// Open modal to edit a task
const openEditModal = (id, currentTitle) => {
    editingTaskId = id;
    editTaskInput.value = currentTitle;
    taskModal.style.display = 'flex';
};

// Save the edited task
saveEditButton.addEventListener('click', async () => {
    const newTitle = editTaskInput.value.trim();
    if (newTitle) {
        try {
            await fetch(apiBase + `update/${editingTaskId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, completed: false })
            });
            taskModal.style.display = 'none';
            fetchTasks();
        } catch (error) {
            errorMessage.textContent = 'Failed to update task. Please try again.';
            console.error(error);
        }
    }
});

// Close the modal without saving
closeModalButton.addEventListener('click', () => {
    taskModal.style.display = 'none';
});

// Delete a specific task
const deleteTask = async (id) => {
    try {
        await fetch(apiBase + `delete/${id}/`, { method: 'DELETE' });
        fetchTasks();
    } catch (error) {
        errorMessage.textContent = 'Failed to delete task. Please try again.';
        console.error(error);
    }
};

// Delete all tasks
deleteAllButton.addEventListener('click', async () => {
    try {
        await fetch(apiBase + 'delete-all/', { method: 'DELETE' });
        fetchTasks();
    } catch (error) {
        errorMessage.textContent = 'Failed to delete all tasks. Please try again.';
        console.error(error);
    }
});

// Load tasks when the page loads
fetchTasks();

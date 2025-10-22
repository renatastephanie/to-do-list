// --- 1. ESTRUTURA INICIAL: Seleção de Elementos e Dados ---

// Seleciona os elementos do DOM pelos seus IDs
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filters-container button');

// Array que irá armazenar todas as tarefas
// Cada tarefa será um objeto: { id: Date.now(), text: 'Descrição', completed: false }
let tasks = [];

// Função para carregar as tarefas do LocalStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('todoTasks');
    if (storedTasks) {
        // Converte a string JSON de volta para um array de objetos
        tasks = JSON.parse(storedTasks);
    }
}

// Função para salvar as tarefas no LocalStorage
function saveTasks() {
    // Converte o array de objetos 'tasks' para uma string JSON
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// --- 2. FUNÇÕES CRUD (CREATE, READ, UPDATE, DELETE) ---
/*
    * Cria o elemento HTML (<li>) de uma tarefa.
    * @param {Object} task - O objeto da tarefa ({ id, text, completed }).
    * @returns {HTMLLIElement} O elemento <li> construído.
 */

function createTaskElement(task) {
    const listItem = document.createElement('li');
    // Adiciona a classe 'completed' se a tarefa estiver concluída
    if (task.completed) {
        listItem.classList.add('completed');
    }

    // Adiciona o atributo de dados para identificar a tarefa unicamente
    listItem.dataset.taskId = task.id;

    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = task.text;

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actions-container');

    // Botão de Concluir
    const completrBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerHTML = task.completed
        ? '<i class= "fas fa-undo-alt" title="Desfazer"></i>' // Ícone para desfazer
        : '<i class="fas fa-check" title="Concluir"></i>'; // Ícone para concluir
    completedBtn.addEventListener('click', () => toggleCompleteTask(task.id));

    // Botão de Editar
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerHTML = '<i class="fas fa-edit" title="Editar"></i>';
    editBtn.addEventListener('click', () => editTask(task.id, listItem, taskText, actionsContainer));

    // Botão de Excluir
}
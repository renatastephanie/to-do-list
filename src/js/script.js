// --- 1. ESTRUTURA INICIAL: Seleção de Elementos e Dados ---

// Seleciona os elementos do DOM pelos seus IDs
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filters-container button');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Array que irá armazenar todas as tarefas
// Cada tarefa será um objeto: { id: Date.now(), text: 'Descrição', completed: false }
let tasks = [];

// --- 1.1 LÓGICA DO TEMA ---

// Função para definir o tema
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Atualiza o ícone do botão
    if (theme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Função para alternar o tema
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Carrega o tema salvo ao iniciar
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

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
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerHTML = task.completed
        ? '<i class= "fas fa-undo-alt" title="Desfazer"></i>' // Ícone para desfazer
        : '<i class="fas fa-check" title="Concluir"></i>'; // Ícone para concluir
    completeBtn.addEventListener('click', () => toggleCompleteTask(task.id));

    // Botão de Editar
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerHTML = '<i class="fas fa-edit" title="Editar"></i>';
    editBtn.addEventListener('click', () => editTask(task.id, listItem, taskText, actionsContainer));

    // Botão de Excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt" title="Excluir"></i>';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    //Monta o listemItem
    actionsContainer.append(completeBtn, editBtn, deleteBtn);
    listItem.append(taskText, actionsContainer);
    return listItem;
}

// Função principal de renderização da lista (READ)
function renderTasks(filter = 'all') {
    taskList.innerHTML = ''; // Limpa a lista antes de renderizar
    
    let filteredTasks = tasks;

    // Lógica do filtro
    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const listItem = createTaskElement(task);
        taskList.appendChild(listItem);
    });

    // Salva as tarefas sempre que a lista for renderizada
    saveTasks();
}

// Adicionar Nova Tarefa (CREATE)
function addTask() {
    const taskText = taskInput.value.trim(); // Remove espaços em branco
    
    if (taskText === '') {
        alert('Por favor, digite uma tarefa válida.');
        return;
    }

    // Cria uma novo objeto de Tarefas
    const newTask = {
        id: Date.now(), // ID único baseado no tempo (bom para projetos simples)
        text: taskText,
        completed: false
    };

    // Adicona ao array e limpa o input
    tasks.unshift(newTask); // Adiciona no inicio do array
    taskInput.value = '';
    
    // Re-renderiza a lista
    const currentFilter = document.querySelector('.filters-container button.active').id.replace('filter-', '');
    renderTasks(currentFilter);
}

// Alternar status de concluída (UPDATE - Status)
function toggleCompleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;

        // Re-renderiza para aplicar a classe 'completed' e atualizar o ícone
        const currentFilter = document.querySelector('.filters-container button.active').id.replace('filter-', '');
        renderTasks(currentFilter);
    }
}

// Excluir Tarefa (DELETE)
function deleteTask(id) {
    // Filtra o array, mantendo apenas as tarefas que NÃO têm o ID fornecido
    tasks = tasks.filter(task => task.id !== id);
    const currentFilter = document.querySelector('.filters-container button.active').id.replace('filter-', '');
    renderTasks(currentFilter);
}

// Inicia a Edição (UPDATE - texto)
function editTask(id, listItem, taskTextElement, actionsContainer) {
    // 1. Ocultar botões de ação atuais
    actionsContainer.style.display = 'none';

    // 2. Criar campo de input para edição
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = task.text;
    editInput.classList.add('edit-input');

    // 3. Criar botão de salvar
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('save-edit-btn');
    saveBtn.innerHTML = '<i class="fas fa-save" title="Salvar"></i>';
    
    //// 4. Substituir o texto pelo input e adicionar o botão salvar
    listItem.replaceChild(editInput, taskTextElement);
    listItem.appendChild(saveBtn);

    editInput.focus(); // Coloca o cursor no input

    // Lógica para salvar a edição
    const saveHandLer = () => {
        const newText = editInput.value.trim();
        if (newText) {
            // Atualiza o Array
            task.text = newText;

            // // Re-renderiza para voltar ao estado normal
            const currentFilter = document.querySelector('.filters-container button.active').id.replace('filter-', '');
            renderTasks(currentFilter);
        } else {
            alert('A tarefa não pode ficar vazia.');
            editInput.focus();
        }
    };

    saveBtn.addEventListener('click', saveHandLer);
    // Permite salvar a edição pressionando Enter
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveHandLer();
        }
    });
}

// --- 3. LÓGICA DE FILTROS ---
filterBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove a classe 'active' de todos os botões
        filterBtns.forEach(btn => btn.classList.remove('active'));

        // Adiciona a classe 'active' ao botão clicado
        e.currentTarget.classList.add('active');

        // Determina o tipo de filtro (all, pending, completed)
        const filterType = e.currentTarget.id.replace('filter-', '');

        // Renderiza as tarefas com o novo filtro
        renderTasks(filterType);
    });
});

// // --- 4. LISTENERS DE EVENTOS ---
// Listener para o botão de tema
themeToggleBtn.addEventListener('click', toggleTheme);

// Adiciona tarefa ao clicar no botão
addTaskBtn.addEventListener('click', addTask);

// Adiciona tarefa ao pressionar Enter no input
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// --- 5. INICIALIZAÇÃO ---
// 1. Carrega o tema salvo
loadTheme();

// 2. Carrega as tarefas salvas no LocalStorage
loadTasks();

// 3. Renderiza a lista inicial
renderTasks();
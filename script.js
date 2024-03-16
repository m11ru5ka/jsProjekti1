// muuttujien määrittely: lomake, syöttökenttä ja lista
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// tapahtumakuuntelijan lisääminen lomakkeen lähetykseen
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const newTask = todoInput.value;

    if (newTask === '') {   // varmistaa, ettei kenttä ole tyhjä ja herjaa alertilla
        alert('Syötä tehtävä!');
        return;
    }
    todoInput.value = '';   //tyhjennetään syöttökenttä
    addTask(newTask);
});

// uuden tehtäväkohdan tekeminen ja lisääminen todo-listalle
function addTask(task) {
    const listItem = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.textContent = task;
    listItem.appendChild(taskText);

    const checkBox = document.createElement('input');  // rastiruutu tehtävän viereen
    checkBox.setAttribute('type', 'checkbox');
    listItem.appendChild(checkBox);

    const deleteButton = document.createElement('button');  // millä tehtävän saa poistettua listalta
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`; // ikoni buttoniin
    //deleteButton.textContent = 'Poista'; 
    listItem.appendChild(deleteButton);

    todoList.appendChild(listItem);

    const editButton = document.createElement('button'); // lisää editointi nappi tehtävään
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`; // ikoni buttoniin
    //editButton.textContent = 'Muokkaa';
    listItem.appendChild(editButton);

    checkBox.addEventListener('change', function () {    // checkboxin muutostoiminto, kun klikataan
        if (this.checked) {
            taskText.style.textDecoration = 'line-through';
        } else {
            taskText.style.textDecoration = 'none'
        }
    });

    deleteButton.addEventListener('click', function () { // deletenappiin toiminto klikatessa
        todoList.removeChild(listItem);
    });

    editButton.addEventListener('click', function () {  // MUokkaustoiminnon muodostus
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            taskText.textContent = this.previousSibling.value;
            listItem.classList.remove('editing');
            editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = taskText.textContent;
            input.style.fontFamily = `Papyrus`;
            listItem.insertBefore(input, taskText);
            listItem.removeChild(taskText);
            listItem.classList.add('editing');
            editButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
        }
    });

    saveTasksToLocalStorage();      //tallennus local storageen

}

function saveTasksToLocalStorage() {        //tallenuksen toiminnon funktio
    const tasks = [];
    document.querySelectorAll('#todo-list li').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const isCompleted = task.classList.contains('completed');
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.addEventListener('DOMContentLoaded', function () {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTask(task.text);
    });
});
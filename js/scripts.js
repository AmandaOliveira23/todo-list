//Selection of elements
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editInput = document.querySelector("#edit-input");
const editForm = document.querySelector("#edit-form");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const eraseBtn = document.querySelector("#erase-button");
const searchInput = document.querySelector("#search-input");
const FilterBtn = document.querySelector("#filter-select");

let oldInputValue;
//Function

//arrow function
const saveTodo = (text, done = 0, save = 1) =>{

    //create element div 
    const todo = document.createElement("div");
    //and class todo
    todo.classList.add("todo");

    // create element title
    const todoTitle = document.createElement("h3");

    // put the argument's value of saveTodo function 
    todoTitle.innerText = text;
    //insert it inside element parent todo
    todo.appendChild(todoTitle);

    //create element button
    const doneBtn = document.createElement("button");
    // add class
    doneBtn.classList.add("finish-todo");
    //add the icon inside button
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    //put the button within the parent todo
    todo.appendChild(doneBtn);

    // the same procedure to create another buttons 
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeBtn);

    //utilizando dados da localstorage

    if(done){
        todo.classList.add("done")
    };

    if(save){
        saveTodoLocalStorage({text, done})
    };
    
    //insert todo inside the parent todoList
    todoList.appendChild(todo);
    
    //to clean the input to another event
    todoInput.value = "";

    //put the input with focus
    todoInput.focus();


};

//arrow function created to hide some elements when the button edit to be clicked
const toggleForms = () =>{
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};


const updateTodo = (text) =>{

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{

        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText ===oldInputValue){
            todoTitle.innerText = text;

            updateTodoLocalStorage(oldInputValue,text);
        };

    });

};

const getSearchTodos = (search) =>{
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.includes(search)){
            todo.style.display = "none";
        };
    });


};

const filtersTodos = (filterValue) =>{
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all": 
            todos.forEach((todo) =>(todo.style.display = "flex"));
            break;

        case "done":
            todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") 
            : (todo.style.display = "none"));
            break;
 
        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") ? (todo.style.display = "flex") 
            : (todo.style.display = "none"));

        default:
            break;
    };
};

// --------Events------------

todoForm.addEventListener("submit", (e) => {
    //Is used to avoid unnecessary page refleshes 
    e.preventDefault();
    
    //assign value to input inside 
    const valueInput = todoInput.value;
    //validation of value
    if(valueInput){
        //value of argument passed by function saveTodo
        saveTodo(valueInput);
    }


});

//Add event of click in all the document
document.addEventListener("click", (e) =>{

    
    //catch a specific event
    const targetElement = e.target;
    //assign the value to element parent
    const parentElement = targetElement.closest("div");

    let todoTitle;

    if(parentElement && parentElement.querySelector("h3")){
        todoTitle = parentElement.querySelector("h3").innerText;
    };

    //validation of witch one we are taking 
    if(targetElement.classList.contains("finish-todo")){

        //Add inside div's class -> done
        //remember: we want that the button do and undo the action, so we change -> add to -> toggle 
        parentElement.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTitle);

        //show if it worked 
        //console.log("clicou no botao done");  
    };

    if(targetElement.classList.contains("remove-todo")){
        parentElement.remove();

        removeTodoLocalStorage(todoTitle);
    };

    if(targetElement.classList.contains("edit-todo")){

        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    };

});

//arrow function to add event click to button 
cancelEditBtn.addEventListener("click", (e) =>{
    //avoid it from submitting a form
    e.preventDefault();

    //function's called 
    toggleForms();
});


editForm.addEventListener("submit", (e) =>{
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue){
        updateTodo(editInputValue) 
    };

    toggleForms();
});


searchInput.addEventListener("keyup", (e) =>{
    const search = e.target.value;


    getSearchTodos(search);


});


eraseBtn.addEventListener("click", (e)=> {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event ("keyup"));

});

FilterBtn.addEventListener("change", (e) =>{
    const filterValue = e.target.value;

    filtersTodos(filterValue);
});


//Local storage

  // all to-dos of ls
getTodosLocalStorage = () =>{
    // add the new to-do in array
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () =>{
    const todos = getTodosLocalStorage();

    todos.forEach((todo) =>{
        saveTodo(todo.text, todo.done, 0);
    });
};

saveTodoLocalStorage = (todo) =>{
    const todos = getTodosLocalStorage();
    //salve all in ls
    todos.push(todo);
  
    localStorage.setItem("todos", JSON.stringify(todos));

    
};

const removeTodoLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text != todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));

};

const updateTodoStatusLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
};


const updateTodoLocalStorage = (todoOldText, todoNewText ) =>{
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();






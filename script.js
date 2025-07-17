
class Task {
    constructor(description) {
        this.description = description;
        this.sub_tasks = [];
        this.completed = false;
    }
}
class SubTask {
    constructor(description) {
        this.description = description;
        this.completed = false;
    }
}
class TaskManager {
    constructor() {
        this.tasks = [];
        this.load_From_localStorage();
        this.print_tasks();
    }
    // printing
    print_tasks() {
        const tasks_body = document.getElementById("tasks_body");
        tasks_body.innerHTML = "";
        this.tasks.forEach((task, id) => {
            this.print_new_task(task, id);
            //console.log(this.tasks.at(id).sub_tasks);
            this.tasks.at(id).sub_tasks.forEach((sub_task, sub_id) => {
                if (this.tasks.at(id).sub_tasks.length !== 0) {
                    //console.log("hallo");
                    this.print_new_sub_task(sub_task, sub_id, id);
                }

            })
        });
    }
    print_new_task(task, id) {
        const tasks_body = document.getElementById("tasks_body");
        const li = document.createElement("li");
        const ul = document.createElement("ul");
        const span = document.createElement('span');
        span.textContent = task.description;
        li.appendChild(span);
        li.classList.add('my_task');
        if (task.completed == true) {
            li.classList.add("completed_task");
        }
        li.dataset.index = id;
        li.appendChild(ul);



        tasks_body.appendChild(li);
    }
    print_new_sub_task(sub_task, sub_id, id) {
        const li = document.querySelector(`#tasks_body > li[data-index="${id}"]`);
        //console.log(li);
        const inner_ul = li.querySelector('ul');
        //console.log(inner_ul);
        const sub_li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = sub_task.description;
        sub_li.appendChild(span);

        //sub_li.innerHTML = `${sub_task.description}`;
        sub_li.classList.add('my_sub_task');
        if (sub_task.completed == true) {
            sub_li.classList.add("completed_task");
        }
        sub_li.dataset.index = sub_id;
        inner_ul.appendChild(sub_li);


    }
    // end printing

    //tasks comands
    localStorage_save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
    load_From_localStorage() {
        const tasksJ = localStorage.getItem("tasks");
        if (tasksJ) {
            const taskObjects = JSON.parse(tasksJ) || [];
            this.tasks = taskObjects.map(t => {
                const task = new Task(t.description);
                task.completed = t.completed;
                task.sub_tasks = t.sub_tasks;
                return task;
            });
        }

    }
    delete_task(id) {
        this.tasks.splice(id, 1);
        this.localStorage_save();
        this.print_tasks();

    }
    complete_task(id) {
        this.tasks.at(id).completed = true;
        this.localStorage_save();
        this.print_tasks();
    }
    edit_task(text, id) {
        this.tasks.at(id).description = text;
        this.localStorage_save();
        this.print_tasks();
    }
    //end tasks comands


    //sub tasks commands
    add_sub_task(text, id) {
        this.tasks.at(id).sub_tasks.push(new SubTask(text));
        this.localStorage_save();
        this.print_tasks();

    }
    delete_sub_task(id, sub_id) {
        this.tasks.at(id).sub_tasks.splice(sub_id, 1);
        this.localStorage_save();
        this.print_tasks();

    }
    complete_sub_task(id, sub_id) {
        this.tasks.at(id).sub_tasks.at(sub_id).completed = true;
        const if_all_complited = this.tasks.at(id).sub_tasks.every(sub => sub.completed == true);
        console.log(this.tasks.at(id), if_all_complited);
        if (if_all_complited) {
            console.log('workkks');
            this.complete_task(id);
        }
        else {
            this.localStorage_save();
            this.print_tasks();
        }

    }
    edit_sub_tasks(text, id, sub_id) {
        this.tasks.at(id).sub_tasks.at(sub_id).description = text;
        this.localStorage_save();
        this.print_tasks();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const task_manage = new TaskManager();
    const add_task_button = document.getElementById("add_task_btn");
    const task_input = document.getElementById("task_input");
    const tasks_body = document.getElementById("tasks_body");
    const settings_form = document.getElementById("setting_form");
    const sub_settings_form = document.getElementById("setting_sub_form");
    const edit_form = document.getElementById("edit_form");






    add_task_button.addEventListener("click", () => {
        new_task = new Task(task_input.value)
        task_manage.tasks.push(new_task);
        console.log(task_manage.tasks);
        task_manage.localStorage_save();
        task_manage.print_new_task(task_manage.tasks.at(-1), task_manage.tasks.length - 1);


        task_input.value = '';



    });

    tasks_body.addEventListener("click", (e) => {
        const hiden_id = document.getElementById("hiden_id");
        const hiden_sub_id = document.getElementById("hiden_sub_id");


        if (e.target.closest('.my_sub_task')) {
            const li_father = e.target.closest('.my_task');
            const li = e.target.closest('.my_sub_task');
            hiden_id.textContent = li_father.dataset.index;
            console.log("sub sub", li.dataset.index, hiden_id.textContent);
            hiden_sub_id.textContent = li.dataset.index;
            open_sub_settings_form();

            return;

        }
        if (e.target.closest('.my_task')) {
            const li_task = e.target.closest('.my_task');
            console.log("Task clicked:", li_task.dataset.index);
            hiden_id.textContent = li_task.dataset.index;
            open_settings_form();


        }


    });

    settings_form.addEventListener("click", (e) => {
        const hiden_id = parseInt(document.getElementById("hiden_id").textContent);
        if (e.target.id === "delete_task_btn") {
            console.log("delete ", hiden_id);
            task_manage.delete_task(hiden_id);
            close_settings_form();

        }
        if (e.target.id == "complete_task_btn") {
            console.log("complete ", hiden_id);
            task_manage.complete_task(hiden_id);
            close_settings_form();
        }
        if (e.target.id == "add_sub_task_btn") {
            const sub_task = document.getElementById("sub_task_input").value;
            console.log("add sub task", hiden_id);

            task_manage.add_sub_task(sub_task, hiden_id);
            console.log("sub: ", task_manage.tasks);
            close_settings_form();
        }
        if (e.target.id == "close_setting_btn") {
            close_settings_form();
        }
        if (e.target.id == "edit_task_btn") {
            const if_sub = document.getElementById('hiden_if_sub');
            if_sub.textContent = 'false';
            close_settings_form();
            open_edit();
        }

    });

    sub_settings_form.addEventListener('click', (e) => {
        const hiden_id = parseInt(document.getElementById("hiden_id").textContent);
        const hiden_sub_id = parseInt(document.getElementById("hiden_sub_id").textContent);
        if (e.target.id == "close_sub_setting_btn") {
            close_sub_settings_form();
        }
        if (e.target.id === "delete_sub_task_btn") {
            console.log("delete sub ", hiden_id, hiden_sub_id);
            task_manage.delete_sub_task(hiden_id, hiden_sub_id);
            close_sub_settings_form();

        }
        if (e.target.id == "complete_sub_task_btn") {
            task_manage.complete_sub_task(hiden_id, hiden_sub_id);
            close_sub_settings_form();
        }
        if (e.target.id == "edit_sub_task_btn") {
            const if_sub = document.getElementById('hiden_if_sub');
            if_sub.textContent = 'true';
            close_sub_settings_form();
            open_edit();
        }

    })


    edit_form.addEventListener('click', (e) => {
        const if_sub = document.getElementById('hiden_if_sub');
        const hiden_id = parseInt(document.getElementById("hiden_id").textContent);
        const hiden_sub_id = parseInt(document.getElementById("hiden_sub_id").textContent);
        const text = document.getElementById('edit_input');
        if (e.target.id == "confirm_edit_btn") {
            if (if_sub.textContent == 'false') {
                console.log(text.value)
                task_manage.edit_task(text.value, hiden_id);
                close_edit();
            }
            else if (if_sub.textContent == 'true') {
                task_manage.edit_sub_tasks(text.value, hiden_id, hiden_sub_id);
                close_edit();
            }
        }
        if (e.target.id == "close_edit_btn") {
            close_edit();
        }


    });


});

function open_settings_form() {
    const black_background = document.getElementById("black_background");
    const settings_form = document.getElementById("setting_form");
    settings_form.style.display = "block";
    black_background.style.display = "block";
}
function close_settings_form() {
    const black_background = document.getElementById("black_background");
    const settings_form = document.getElementById("setting_form");
    const sub_task_input = document.getElementById("sub_task_input");
    sub_task_input.value = "";
    settings_form.style.display = "none";
    black_background.style.display = "none";
}

function open_sub_settings_form() {
    const black_background = document.getElementById("black_background");
    const sub_settings_form = document.getElementById("setting_sub_form");
    sub_settings_form.style.display = "flex";
    black_background.style.display = "block";
}
function close_sub_settings_form() {
    const black_background = document.getElementById("black_background");
    const sub_settings_form = document.getElementById("setting_sub_form");
    sub_settings_form.style.display = "none";
    black_background.style.display = "none";
}

function open_edit() {
    const black_background = document.getElementById("black_background");
    const edit_form = document.getElementById("edit_form");
    edit_form.style.display = "flex";
    black_background.style.display = "block";
}
function close_edit() {
    const black_background = document.getElementById("black_background");
    const edit_form = document.getElementById("edit_form");
    edit_form.style.display = "none";
    black_background.style.display = "none";
}



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
    print_tasks() {
        const tasks_body = document.getElementById("tasks_body");
        tasks_body.innerHTML = "";
        this.tasks.forEach((task, id) => {
            this.print_new_task(task, id);
            this.tasks.at(id).sub_tasks.forEach((sub_task, sub_id) => {
                if (this.tasks.at(id).sub_tasks != null) {
                    this.print_new_sub_task(sub_task, sub_id, id);
                }

            })
        });
    }
    print_new_task(task, id) {
        const tasks_body = document.getElementById("tasks_body");
        const li = document.createElement("li");
        const ul = document.createElement("ul");
        li.innerHTML = `<span>${task.description}</span>`;
        li.classList.add('my_task');
        if (task.completed == true) {
            li.classList.add("completed_task");
        }
        li.dataset.index = id;
        li.appendChild(ul);



        tasks_body.appendChild(li);
    }
    print_new_sub_task(sub_task, sub_id, id) {
        const li = document.querySelector(`#tasks_body li[data-index="${id}"]`);
        const inner_ul = li.querySelector('ul');
        const sub_li = document.createElement('li');
        sub_li.innerHTML = `<div>${sub_task.description}</div>`;
        sub_li.classList.add('my_sub_task');
        if (sub_task.completed == true) {
            li.classList.add("completed_task");
        }
        sub_li.dataset.index = sub_id;
        inner_ul.appendChild(sub_li);


    }
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
    add_sub_task(text, id) {
        this.tasks.at(id).sub_tasks.push(new SubTask(text));
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


        if (e.target.classList.contains('my_task')) {
            console.log("Task clicked:", e.target.dataset.index);
            open_settings_form();
            hiden_id.textContent = e.target.dataset.index;
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
            console.log("add sub task");
            task_manage.add_sub_task(sub_task, hiden_id);
            console.log("sub: ", task_manage.tasks);
            close_settings_form();
        }
        if(e.target.id=="close_setting_btn"){
            close_settings_form();
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
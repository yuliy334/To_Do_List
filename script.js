
class Task {
    constructor(description) {
        this.description = description;
        this.sub_tasks = [];
        this.completed = false;
    }
}
class Task_manager {
    constructor() {
        this.tasks = [];
        this.load_From_localStorage();
        this.print_tasks();
    }
    print_tasks(){
        this.tasks.forEach(t => {
            this.print_new_task(t);
        });
    }
    print_new_task(task) {
        const tasks_body = document.getElementById("tasks_body");
        const li = document.createElement("li");
        li.innerHTML = `${task.description}`;

        tasks_body.appendChild(li);
    }
    localStorage_save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        this.print_new_task(this.tasks.at(-1));
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
}


document.addEventListener("DOMContentLoaded", () => {
    const task_manage = new Task_manager();
    const add_task_button = document.getElementById("add_task_btn");
    const task_input = document.getElementById("task_input");
    const tasks_body = document.getElementById("tasks_body");



    add_task_button.addEventListener("click", () => {
        new_task = new Task(task_input.value)
        task_manage.tasks.push(new_task);
        console.log(task_manage.tasks);
        task_manage.localStorage_save();
        //task_manage.print_new_task(new_task);


        task_input.value = '';



    });



});
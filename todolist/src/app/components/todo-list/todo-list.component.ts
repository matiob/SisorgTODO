import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/Task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit{
  toDoList: Task[] = [];
  arrowDirectionPriority: 'keyboard_arrow_down' | 'keyboard_arrow_up' = 'keyboard_arrow_down';
  arrowDirectionStatus: 'keyboard_arrow_down' | 'keyboard_arrow_up' = 'keyboard_arrow_down';
  arrowDirectionDate: 'keyboard_arrow_down' | 'keyboard_arrow_up' = 'keyboard_arrow_down';

  constructor(private taskService: TaskService,
    private router: Router){}

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks(): void {
    this.taskService.getAll().subscribe((tasks: Task[]) => this.toDoList = tasks);
  }

  editTask(taskId: number): void {
    this.router.navigate([`task/${taskId}`]);
  }
  viewTask(taskId: number): void {
    this.router.navigate([`view-task/${taskId}`]);
  }

  deleteTask(taskId: number): void {
    const isDelete = confirm('Are you sure you want to delete the task?');
    if (isDelete) {
      this.taskService.delete(taskId);
      this.getAllTasks();
    }
  }

  toggleArrowDirectionPriority(): void {
    this.arrowDirectionPriority = this.arrowDirectionPriority === 'keyboard_arrow_down' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  toggleArrowDirectionStatus(): void {
    this.arrowDirectionStatus = this.arrowDirectionStatus === 'keyboard_arrow_down' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  toggleArrowDirectionDate(): void {
    this.arrowDirectionDate = this.arrowDirectionDate === 'keyboard_arrow_down' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  orderStatus(): void {
    this.taskService.orderByStatus();
    this.toggleArrowDirectionStatus();
    this.getAllTasks();
  }

  orderPriority(): void {
    this.taskService.orderByPriority();
    this.toggleArrowDirectionPriority();
    this.getAllTasks();
  }

  orderDate(): void {
    this.taskService.orderByDate();
    this.toggleArrowDirectionDate();
    this.getAllTasks();
  }

  handleSearch(searchTerm: string): void {
    this.taskService.searchByStatusOrPriority(searchTerm).subscribe((tasks: Task[]) => {
      this.toDoList = tasks;
    })
  }

  deleteAllTasks(): void {
    const isDelete = confirm('Are you sure you want to delete the all tasks?');
    if (isDelete) {
      this.taskService.deleteAll();
      this.getAllTasks(); 
    }
  }

  completeAllTasks(): void {
    this.taskService.completeAll();
    this.getAllTasks();
  }

}

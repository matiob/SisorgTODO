import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/Task';
import { TaskService } from 'src/app/services/task.service';

/**
 * Component for displaying and managing the todo list.
 */
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  /** Array of tasks in the todo list. */
  toDoList: Task[] = [];

  /** Direction of the arrow for sorting tasks by priority. */
  arrowDirectionPriority: 'keyboard_arrow_down' | 'keyboard_arrow_up' =
    'keyboard_arrow_down';

  /** Direction of the arrow for sorting tasks by status. */
  arrowDirectionStatus: 'keyboard_arrow_down' | 'keyboard_arrow_up' =
    'keyboard_arrow_down';

  /** Direction of the arrow for sorting tasks by date. */
  arrowDirectionDate: 'keyboard_arrow_down' | 'keyboard_arrow_up' =
    'keyboard_arrow_down';

  constructor(private taskService: TaskService, private router: Router) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.getAllTasks();
  }

  /** Fetches all tasks from the task service. */
  getAllTasks(): void {
    this.taskService
      .getAll()
      .subscribe((tasks: Task[]) => (this.toDoList = tasks));
  }

  /**
   * Navigates to the task edit page.
   * @param taskId - The ID of the task to edit.
   */
  editTask(taskId: number): void {
    this.router.navigate([`task/${taskId}`]);
  }

  /**
   * Navigates to the task view page.
   * @param taskId - The ID of the task to view.
   */
  viewTask(taskId: number): void {
    this.router.navigate([`view-task/${taskId}`]);
  }

  /**
   * Deletes a task.
   * @param taskId - The ID of the task to delete.
   */
  deleteTask(taskId: number): void {
    const isDelete = confirm('Are you sure you want to delete the task?');
    if (isDelete) {
      this.taskService.delete(taskId);
      this.getAllTasks();
    }
  }

  /** Toggles the arrow direction for sorting tasks by priority. */
  toggleArrowDirectionPriority(): void {
    this.arrowDirectionPriority =
      this.arrowDirectionPriority === 'keyboard_arrow_down'
        ? 'keyboard_arrow_up'
        : 'keyboard_arrow_down';
  }

  /** Toggles the arrow direction for sorting tasks by status. */
  toggleArrowDirectionStatus(): void {
    this.arrowDirectionStatus =
      this.arrowDirectionStatus === 'keyboard_arrow_down'
        ? 'keyboard_arrow_up'
        : 'keyboard_arrow_down';
  }

  /** Toggles the arrow direction for sorting tasks by date. */
  toggleArrowDirectionDate(): void {
    this.arrowDirectionDate =
      this.arrowDirectionDate === 'keyboard_arrow_down'
        ? 'keyboard_arrow_up'
        : 'keyboard_arrow_down';
  }

  /** Orders tasks by status. */
  orderStatus(): void {
    this.taskService.orderByStatus();
    this.toggleArrowDirectionStatus();
    this.getAllTasks();
  }

  /** Orders tasks by priority. */
  orderPriority(): void {
    this.taskService.orderByPriority();
    this.toggleArrowDirectionPriority();
    this.getAllTasks();
  }

  /** Orders tasks by date. */
  orderDate(): void {
    this.taskService.orderByDate();
    this.toggleArrowDirectionDate();
    this.getAllTasks();
  }

  /**
   * Handles the search for tasks.
   * @param searchTerm - The term to search for in task status or priority.
   */
  handleSearch(searchTerm: string): void {
    this.taskService
      .searchByStatusOrPriority(searchTerm)
      .subscribe((tasks: Task[]) => {
        this.toDoList = tasks;
      });
  }

  /** Deletes all tasks. */
  deleteAllTasks(): void {
    const isDelete = confirm('Are you sure you want to delete the all tasks?');
    if (isDelete) {
      this.taskService.deleteAll();
      this.getAllTasks();
    }
  }

  /** Completes all tasks. */
  completeAllTasks(): void {
    this.taskService.completeAll();
    this.getAllTasks();
  }
}

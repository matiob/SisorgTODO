import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/Task';

/**
 * Service for managing tasks.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    []
  );
  private isSortByStatus = false;
  private isSortByPriority = false;
  private isSortByDate = false;

  /**
   * Retrieves all tasks.
   * @returns An observable of tasks.
   */
  getAll(): Observable<Task[]> {
    const tasks: Task[] = getStorage();
    this.tasksSubject.next(tasks);
    return this.tasksSubject.asObservable();
  }

  /**
   * Retrieves a task by its ID.
   * @param taskId The ID of the task to retrieve.
   * @returns The task with the specified ID, or null if not found.
   */
  getById(taskId: number): Task | null {
    const todoList = getStorage();
    const todo = todoList.find((task: Task) => task.id === taskId) || null;
    return todo;
  }

  /**
   * Saves a new task or updates an existing one.
   * @param task The task to save or update.
   */
  save(task: Task): void {
    const todoList = getStorage();
    const id = todoList.length > 0 ? todoList[todoList.length - 1].id + 1 : 1;
    task.id = id;
    todoList.push(task);
    setStorage(todoList);
  }

  /**
   * Updates an existing task.
   * @param taskId The ID of the task to update.
   * @param updatedTask The updated task object.
   */
  edit(taskId: number, updatedTask: Task): void {
    const todoList = getStorage();
    const index = todoList.findIndex((task: Task) => task.id === taskId);
    if (index !== -1) {
      todoList[index] = updatedTask;
      setStorage(todoList);
    }
  }

  /**
   * Deletes a task.
   * @param taskId The ID of the task to delete.
   */
  delete(taskId: number): void {
    const todoList = getStorage();
    const index = todoList.findIndex((task: Task) => task.id === taskId);
    if (index !== -1) {
      todoList.splice(index, 1);
      setStorage(todoList);
    }
  }

  /**
   * Orders tasks by status.
   */
  orderByStatus(): void {
    this.isSortByStatus = !this.isSortByStatus;
    let tasks = getStorage();
    this.isSortByStatus
      ? (tasks = tasks.sort(this.customStatusSort))
      : (tasks = tasks.sort(this.customIdSort));
    setStorage(tasks);
  }

  /**
   * Orders tasks by priority.
   */
  orderByPriority(): void {
    this.isSortByPriority = !this.isSortByPriority;
    let tasks = getStorage();
    this.isSortByPriority
      ? (tasks = tasks.sort(this.customPrioritySort))
      : (tasks = tasks.sort(this.customIdSort));
    setStorage(tasks);
  }

  /**
   * Orders tasks by date.
   */
  orderByDate(): void {
    this.isSortByDate = !this.isSortByDate;
    let tasks = getStorage();
    this.isSortByDate
      ? (tasks = tasks.sort((a: Task, b: Task) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return (dateA - dateB) * 1;
        }))
      : (tasks = tasks.sort((a: Task, b: Task) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return (dateA - dateB) * -1;
        }));
    setStorage(tasks);
  }

  /**
   * Searches tasks by status or priority.
   * @param searchTerm The term to search for.
   * @returns An observable of tasks that match the search term.
   */
  searchByStatusOrPriority(searchTerm: string): Observable<Task[]> {
    let tasks = getStorage();
    tasks = tasks.filter(
      (task: Task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.priority.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.tasksSubject.next(tasks);
    return this.tasksSubject.asObservable();
  }

  /**
   * Deletes all tasks.
   */
  deleteAll(): void {
    setStorage([]);
  }

  /**
   * Marks all tasks as completed.
   */
  completeAll(): void {
    let tasks = getStorage();
    tasks = tasks.map((task: Task) => {
      task.status = 'Completed';
      return task;
    });
    setStorage(tasks);
  }

  /**
   * Custom sort function for sorting tasks by status.
   * @param a The first task.
   * @param b The second task.
   * @returns A number indicating the sort order.
   */
  private customStatusSort(a: Task, b: Task): number {
    const statusOrder = { Completed: 0, 'In progress': 1, New: 2 };
    if (statusOrder[a.status] < statusOrder[b.status]) {
      return -1;
    }
    if (statusOrder[a.status] > statusOrder[b.status]) {
      return 1;
    }
    return 0;
  }

  /**
   * Custom sort function for sorting tasks by priority.
   * @param a The first task.
   * @param b The second task.
   * @returns A number indicating the sort order.
   */
  private customPrioritySort(a: Task, b: Task): number {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };

    if (priorityOrder[a.priority] < priorityOrder[b.priority]) {
      return -1;
    }
    if (priorityOrder[a.priority] > priorityOrder[b.priority]) {
      return 1;
    }
    return 0;
  }

  /**
   * Custom sort function for sorting tasks by ID.
   * @param a The first task.
   * @param b The second task.
   * @returns A number indicating the sort order.
   */
  private customIdSort(a: Task, b: Task): number {
    return a.id - b.id;
  }
}

/**
 * Retrieves task data from storage.
 * @returns An array of tasks.
 */
function getStorage() {
  const todoListString = localStorage.getItem('todoList');
  if (todoListString) {
    const todoList = JSON.parse(todoListString);
    return todoList;
  }
  return [];
}

/**
 * Stores task data to storage.
 * @param todoList An array of tasks to be stored.
 */
function setStorage(todoList: Task[] = []): void {
  const todoListString: string = JSON.stringify(todoList);
  localStorage.setItem('todoList', todoListString);
}

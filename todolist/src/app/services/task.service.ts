import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/Task';

function getStorage() {
  const todoListString = localStorage.getItem('todoList');
  if (todoListString) {
    const todoList = JSON.parse(todoListString);
    return todoList;
  }
  return [];
}

function setStorage(todoList: Task[] = []): void {
  const todoListString: string = JSON.stringify(todoList);
  localStorage.setItem('todoList', todoListString);  
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  private isSortByStatus: boolean = false;
  private isSortByPriority: boolean = false;
  private isSortByDate: boolean = false;

  constructor() { }

  getAll(): Observable<Task[]> {
    const tasks: Task[] = getStorage();
    this.tasksSubject.next(tasks);
    return this.tasksSubject.asObservable();
  }

  getById(taskId: number): Task | null {
    const todoList = getStorage();
    const todo =  todoList.find((task: Task) => task.id === taskId) || null;
    return todo;  
  }

  save(task: Task): void {
    const todoList = getStorage();
    const id = (todoList.length > 0) 
      ? todoList[todoList.length - 1].id + 1
      : 1;
    task.id = id;
    todoList.push(task);
    setStorage(todoList);
  }

  edit(taskId: number, updatedTask: Task): void {
    const todoList = getStorage();
    const index = todoList.findIndex((task: Task) => task.id === taskId);
    if (index !== -1) {
      todoList[index] = updatedTask;
      setStorage(todoList);
    }
  }

  delete(taskId: number): void {
    const todoList = getStorage();
    const index = todoList.findIndex((task: Task) => task.id === taskId);
    if (index !== -1) {
      todoList.splice(index, 1);
      setStorage(todoList);
    }
  }

  orderByStatus(): void {
    this.isSortByStatus = !this.isSortByStatus;
    let tasks = getStorage();
    this.isSortByStatus
      ? tasks = tasks.sort(this.customStatusSort)
      : tasks = tasks.sort(this.customIdSort);
    setStorage(tasks);
  }

  orderByPriority(): void {
    this.isSortByPriority = !this.isSortByPriority;
    let tasks = getStorage();
    this.isSortByPriority
      ? tasks = tasks.sort(this.customPrioritySort)
      : tasks = tasks.sort(this.customIdSort);
    setStorage(tasks);
  }

  orderByDate(): void {
    this.isSortByDate = !this.isSortByDate;
    let tasks = getStorage();
    this.isSortByDate
      ? tasks = tasks.sort((a: Task, b: Task) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return (dateA - dateB)*1})
      : tasks = tasks.sort((a: Task, b: Task) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return (dateA - dateB)*-1});
    setStorage(tasks);
  }

  searchByStatusOrPriority(searchTerm: string): Observable<Task[]> {
    let tasks = getStorage();
    tasks = tasks.filter((task: Task) => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.tasksSubject.next(tasks);
    return this.tasksSubject.asObservable();
  }

  deleteAll(): void {
    setStorage([]);
  }

  completeAll(): void {
    let tasks = getStorage();
    tasks = tasks.map((task:Task) => {
      task.status = 'Completed';
      return task;
    })
    setStorage(tasks);
  }

  private customStatusSort(a: Task, b: Task): number {
    const statusOrder = { 'Completed': 0, 'In progress': 1, 'New': 2 };
    if (statusOrder[a.status] < statusOrder[b.status]) {
      return -1;
    }
    if (statusOrder[a.status] > statusOrder[b.status]) {
      return 1 ;
    }
    return 0;
  }
  private customPrioritySort(a: Task, b: Task): number {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
  
    if (priorityOrder[a.priority] < priorityOrder[b.priority]) {
      return -1;
    }
    if (priorityOrder[a.priority] > priorityOrder[b.priority]) {
      return 1 ;
    }
    return 0;
  }
  private customIdSort(a: Task, b: Task): number {
    return a.id - b.id;
  }
}

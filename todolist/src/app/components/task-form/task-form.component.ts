import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/Task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit{
  taskId: number = 0;
  taskForm: FormGroup = new FormGroup({});
  task: Task = {
    id: 0,
    title: '',
    description: '',
    status: 'New',
    priority: 'Low',
    date: new Date(),
  }
  taskType!: string;

  constructor(private formBuilder: FormBuilder,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private router: Router){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((p) => {
      this.taskId = +p.get('taskId')!;
      const task = this.taskService.getById(this.taskId);
      this.taskForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        status: ['New', Validators.required],
        priority: ['Low', Validators.required]
      });
      if (this.activatedRoute.snapshot.url.some(u => u.path === 'view-task')) {
        this.taskForm.disable();
      }
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority
        });
      }
    })
  }

  submitTask(): void {
    const formValue = this.taskForm.value;
    const task: Task = {
      id: this.taskId,
      title: formValue.title,
      description: formValue.description,
      status: formValue.status,
      priority: formValue.priority,
      date: new Date()
    };
    (this.taskId === 0)
      ? this.taskService.save(task)
      : this.taskService.edit(this.taskId, task);
    this.taskForm.reset();
    this.router.navigate(['']);
  }
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Todo } from './models/todo';
import { TodoService } from './services/todo-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Todo List');

  todos: Todo[] = [];
  newTodoText = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todos = this.todoService.getTodos();
  }

  addTodo() {
    if (this.newTodoText.trim()) {
      this.todoService.addTodo(this.newTodoText);
      this.todos = this.todoService.getTodos(); // Refresh
      this.newTodoText = '';
    }
  }

  toggleTodo(id: string) {
    this.todoService.toggleTodo(id);
    this.todos = this.todoService.getTodos();
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id);
    this.todos = this.todoService.getTodos();
  }
}

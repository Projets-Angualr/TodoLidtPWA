import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
// JSON.parse(localStorage.getItem('my-todos-app'))
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: Todo[] = [];
  private storageKey = 'my-todos-app';

  constructor() {
    // localStorage désactivé en dev
    const isDev = !!(window as any).devMode || location.hostname === 'localhost';
    if (!isDev) {
      this.loadTodos();
    }
  }

  private loadTodos(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.todos = JSON.parse(saved).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        }));
      }
    } catch (e) {
      console.warn('localStorage load failed:', e);
    }
  }

  private saveTodos(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }

  getTodos(): Todo[] {
    return [...this.todos]; // Immutabilité
  }

  addTodo(text: string): void {
    if (!text.trim()) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
    this.todos.unshift(todo);
    console.log('Todo ajouté:', todo); // DEBUG
  }

  toggleTodo(id: string): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter((t) => t.id !== id);
  }
}

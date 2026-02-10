import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
// JSON.parse(localStorage.getItem('my-todos-app'))
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: Todo[] = [];
  private storageKey = 'my-todos';

  constructor() {
    this.loadTodos();
  }

  // 🔄 DOUBLE LOAD: localStorage ET Cache API
  private async loadTodos(): Promise<void> {
    // 1. localStorage (priorité)
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.todos = JSON.parse(saved).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt)
        }));
        return;
      }
    } catch (e) {
      console.warn('localStorage load failed:', e);
    }

    // 2. Cache API (backup)
    try {
      if ('caches' in window) {
        const cache = await caches.open('todos-cache-v1');
        const response = await cache.match('/api/todos');
        if (response) {
          this.todos = JSON.parse(await response.text()).map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt)
          }));
        }
      }
    } catch (e) {
      console.warn('Cache API load failed:', e);
    }
  }

  // 🔄 DOUBLE SAVE: localStorage ET Cache API
  private async saveTodos(): Promise<void> {
    // 1. localStorage
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }

    // 2. Cache API (non-bloquant)
    try {
      if ('caches' in window) {
        const cache = await caches.open('todos-cache-v1');
        await cache.put('/api/todos', new Response(JSON.stringify(this.todos)));
      }
    } catch (e) {
      console.warn('Cache API save failed:', e);
    }
  }

  // Garder signatures SYNCHRONES (UX fluide)
  addTodo(text: string): void {
    if (!text.trim()) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    this.todos.unshift(todo);
    this.saveTodos(); // async en fond
  }

  toggleTodo(id: string): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    }
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
  }

  getTodos(): Todo[] {
    return [...this.todos];
  }
}


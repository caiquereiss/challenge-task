import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { DataBase } from './database.js';

const database = new DataBase()
export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query;

      const task = database.select('tasks', {
        title: search,
        description: search
      });

      return response.end(JSON.stringify(task));

    }

  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title) {
        return response.writeHead(400).end(
          JSON.stringify({ message: 'Title is required' })
        )
      }
      if (!description) {
        return response.writeHead(400).end(
          JSON.stringify({ message: 'Description is required' })
        )
      }
      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null
      }
      database.insert('tasks', task);
      return response.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      if (!title || !description) {
        return response.writeHead(400).end(
          JSON.stringify({ message: 'title or description are required' })
        )
      }
      const [task] = database.select('tasks', { id })
      if (!task) {
        return response.writeHead(404).end(
          JSON.stringify({ message: 'Task not found' })
        )
      }

      database.update('tasks', id, {
        title,
        description,
        update_at: new Date()
      })
      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params;

      const [task] = database.select('tasks', { id })
      if (!task) {
        return response.writeHead(404).end(
          JSON.stringify({ message: 'Task not found' })
        )
      }
      const isCompleted = !!task.completed_at;
      const completed_at = isCompleted ? null : new Date()

      database.update('tasks', id, {
        completed_at
      })
      return response.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      const [task] = database.select('tasks', { id })
      if (!task) {
        return response.writeHead(404).end(
          JSON.stringify({ message: 'Task not found' })
        )
      }
      database.delete('tasks', id)
      return response.writeHead(204).end()
    }
  }
]

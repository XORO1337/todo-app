import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
  createdAt: string;
  scheduledDateTime?: string | null;
  location?: string | null;
  weather?: {
    description: string;
    temperature: number;
    icon: string;
  } | null;
  time?: string;
}

interface TodoState {
  todos: Todo[];
  filteredTodos: Todo[];
  activeFilter: 'all' | 'High' | 'Medium' | 'Low';
  activeTags: string[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  filteredTodos: [],
  activeFilter: 'all',
  activeTags: [],
  loading: false,
  error: null,
};

// Load todos from localStorage if available
const storedTodos = localStorage.getItem('todos');
if (storedTodos) {
  try {
    initialState.todos = JSON.parse(storedTodos);
    initialState.filteredTodos = [...initialState.todos];
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    localStorage.removeItem('todos');
  }
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
      // Update filtered todos if no filter is active or if the new todo matches the filter
      if (state.activeFilter === 'all' && state.activeTags.length === 0) {
        state.filteredTodos = [...state.todos];
      } else {
        applyFilters(state);
      }
      // Save to localStorage
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      applyFilters(state);
      // Save to localStorage
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    toggleTodoComplete: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        applyFilters(state);
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    updateTodoPriority: (state, action: PayloadAction<{ id: string; priority: 'High' | 'Medium' | 'Low' }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.priority = action.payload.priority;
        applyFilters(state);
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    updateTodoTags: (state, action: PayloadAction<{ id: string; tags: string[] }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.tags = action.payload.tags;
        applyFilters(state);
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    updateTodoWeather: (state, action: PayloadAction<{ id: string; weather: { description: string; temperature: number; icon: string } }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.weather = action.payload.weather;
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    updateTodoLocation: (state, action: PayloadAction<{ id: string; location: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.location = action.payload.location;
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    updateTodoScheduledDateTime: (state, action: PayloadAction<{ id: string; scheduledDateTime: string | null }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.scheduledDateTime = action.payload.scheduledDateTime;
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    setActiveFilter: (state, action: PayloadAction<'all' | 'High' | 'Medium' | 'Low'>) => {
      state.activeFilter = action.payload;
      applyFilters(state);
    },
    setActiveTags: (state, action: PayloadAction<string[]>) => {
      state.activeTags = action.payload;
      applyFilters(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Helper function to apply filters
function applyFilters(state: TodoState) {
  let filtered = [...state.todos];
  
  // Apply priority filter
  if (state.activeFilter !== 'all') {
    filtered = filtered.filter(todo => todo.priority === state.activeFilter);
  }
  
  // Apply tag filters if any are active
  if (state.activeTags.length > 0) {
    filtered = filtered.filter(todo => 
      state.activeTags.some(tag => todo.tags.includes(tag))
    );
  }
  
  state.filteredTodos = filtered;
}

export const { 
  addTodo, 
  removeTodo, 
  toggleTodoComplete, 
  updateTodoPriority, 
  updateTodoTags,
  updateTodoWeather,
  updateTodoLocation,
  updateTodoScheduledDateTime,
  setActiveFilter,
  setActiveTags,
  setLoading,
  setError
} = todoSlice.actions;

export default todoSlice.reducer;
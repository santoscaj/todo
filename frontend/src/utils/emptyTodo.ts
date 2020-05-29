import {TodoItem, TodoList} from '@/store'

export const emptyTodoItem = () : TodoItem =>({
  id: "",
  content: "",
  completed: false,
  todolist_id: "",
})

export const emptyTodoList = () : TodoList => ({
    id: "",
    name: '',
    user_id: "",
    todoitems: []
})


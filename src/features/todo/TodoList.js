import React, { useEffect, useState } from 'react'
import { FaUpload, FaTrash } from 'react-icons/fa'
import { io } from 'socket.io-client'
const socket = io.connect('http://localhost:3500')

const TodoList = () => {
    const [todo, setTodo] = useState([])
    const [newTodo, setNewTodo] = useState('')

    useEffect(() => {
        socket.on('todos', (data) => {
            setTodo(data)
        })

        socket.on('newTodo', (addedTodo) => {
            setTodo((state) => {
                console.log(state)
                return [...state, addedTodo]
            });
        });

        socket.on('updatedTodo', (updataTodo) => {
            setTodo(prev => prev.map((todo) => (
                todo._id === updataTodo._id ? updataTodo : todo
            )))
        })

        socket.on('deletedTodo', (deletedTodo) => {
            setTodo((prevTodos) =>
                prevTodos.filter((todo) => todo._id !== deletedTodo._id)
            )
        })
        // Clean up event listeners on component unmount
        return () => {
            socket.off('todos');
            socket.off('todoAdded');
            socket.off('todoUpdated');
            socket.off('todoDeleted');
        };
    }, [socket])

    const handleNewTodo = (e) => {
        e.preventDefault()
        if (newTodo.trim() === '') return;
        socket.emit('newTodo', { title: newTodo })
        setNewTodo('');
    }
    const handleUpdatedTodo = (id, completed) => {
        const updatedTodo = {
            id,
            completed: !completed,
        };

        socket.emit('updatedTodo', updatedTodo);
    };

    const handleDeleteTodo = (id) => {
        socket.emit('deleteTodo', { id });
    };

    console.log(newTodo)
    const content = todo?.map((todo, i) => {
        return (
            <li key={todo._id} className='flex items-center justify-between px-4 py-2 bg-gray-700 text-white rounded-md shadow-lg'>

                <span
                    className={`cursor-pointer ${todo.completed ? 'line-through' : ''} flex items-center gap-x-2 text-xl `}
                >
                    <input type="checkbox"
                        className=' h-6 w-6 rounded-full'
                        checked={todo.completed} id=""
                        onChange={() => handleUpdatedTodo(todo._id, todo.completed)} />

                    {todo.title}
                </span>
                <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="ml-2 px-2 py-2 text-lg bg-red-500 text-white rounded-md"
                >
                    <FaTrash />
                </button>
            </li>

        )
    }).sort((a, b) => a.createdAt - b.createdAt)
    return (
        <div className='bg-gray-900 h-[100vh] mx-auto px-4 py-8'>
            <div className='max-w-3xl mx-auto'>
                <h1 className='text-2xl text-white mb-4'>My Todo App</h1>

                <form onSubmit={handleNewTodo}>
                    <div className='flex items-center gap-2 px-3 py-3 w-full border border-gray-500 rounded-lg shadow-xl'>
                        <input type="text"
                            value={newTodo}
                            className='px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' onChange={e => setNewTodo(e.target.value)} />
                        <button className='ml-2 px-4 py-2 text-2xl  bg-gray-500 text-white rounded-md'><FaUpload /></button>

                    </div>
                </form>
                <ul className='mt-4 space-y-2'>
                    {content}
                </ul>
            </div>
        </div>
    )
}

export default TodoList
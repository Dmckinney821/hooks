import React, { useState, useEffect } from 'react';
import axios from 'axios';

const todo = props => {
    const [todoName, setTodoName] = useState('');
    const [todoList, setTodoList] = useState([])
    
    
    useEffect(() => {
        axios.get('https://hooks-726f2.firebaseio.com/todos.json').then(result => {
            console.log(result);
            const todoData = result.data;
            const todos = [];
            for (const key in todoData) {
                todos.push({id: key, name: todoData[key].name})
            }
            setTodoList(todos);
        });
        return () => {
            console.log('Cleanup')
        }
    }, []);

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY)
    }

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler)
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler)
        }
    }, [])

    const inputChangeHandler = (event) => {
        setTodoName(event.target.value)
    };

    

    const todoAddHander = () => {
        setTodoList(todoList.concat(todoName));
        axios.post('https://hooks-726f2.firebaseio.com/todos.json', {name: todoName})
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err)
        })
    }


    return <React.Fragment>
        <input 
            type='text' 
            placeholder='Todo' 
            onChange={inputChangeHandler} 
            value={todoName}
        />
        <button type='button' onClick={todoAddHander}>Add</button>
        <ul>
            {todoList.map(todo => (
            <li key={todo.id}>{todo.name}</li>
            ))}
        </ul>
    </React.Fragment>
}


export default todo;
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

const todo = props => {
    const [todoName, setTodoName] = useState('');
    const [submittedTodo, setSubmittedTodo] = useState(null);
    // const [todoList, setTodoList] = useState([])
    
    const todoListReducer = (state, action) => {
        switch(action.type) {
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter((todo) => todo.id !== action.payload);
            default:
                return state
        }
    }

    const [todoList, dispatch] = useReducer(todoListReducer, [])
    
    useEffect(() => {
        axios.get('https://hooks-726f2.firebaseio.com/todos.json').then(result => {
            console.log(result);
            const todoData = result.data;
            const todos = [];
            for (const key in todoData) {
                todos.push({id: key, name: todoData[key].name})
            }
            dispatch({type: 'SET', payload: todos });
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

    useEffect(
        () => {
            if(submittedTodo) {
        dispatch({type: 'ADD', payload: submittedTodo});
            }
    },
    [submittedTodo]
    );

    const inputChangeHandler = (event) => {
        setTodoName(event.target.value)
    };

    

    const todoAddHander = () => {
        
        axios.post('https://hooks-726f2.firebaseio.com/todos.json', {name: todoName})
        .then(res => {
            setTimeout(() => {
            const todoItem = {id: res.data.name, name: todoName}
            setSubmittedTodo(todoItem);
        }, 3000)
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
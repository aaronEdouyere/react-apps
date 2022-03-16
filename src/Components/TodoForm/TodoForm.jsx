import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = (props) => {

    const [value, setValue] = useState('');

    return ( 
        <form onSubmit={(e) => {
            e.preventDefault();
            props.onFormSubmit(value);
            setValue('');
        }}>
            <input 
                type="text" 
                name="todo" 
                id="todo" 
                className="todo-text" 
                placeholder="Add an item" value={value} onChange={(e) => setValue(e.target.value) } />
            <input type="submit" value="ADD" className="todo-submit-btn" />
        </form>
     );
}
 
export default TodoForm;
import React from 'react';
import LocalStorageService from '../../service/LocalStorage';
import TodoForm from '../TodoForm/TodoForm';
import TodoList from '../TodoList/TodoList';
import { v4 as uuidv4 } from 'uuid';
import './TodoApp.css';
import { endPoint, apiKey } from '../../config';
import { Box, Button, Paper } from '@mui/material';

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            token: sessionStorage.getItem('token'),
            showEmpty: false,
            taskDetails: {}
        }
    }

    componentDidMount = () => {
    //    const data = LocalStorageService.getLocalData();

    //    if(data) {
    //        console.log(data)
    //        this.setState({
    //            todoList : data
    //        })
    //    }

    if(this.props.token) {
        this.setState({
            token: this.props.token
        });        
    }else if(this.state.token){
        this.setState({
            token: this.state.token
        });
    }else{
        window.location = '/';
    }
    const URL = endPoint + 'dashboard';
    console.log(URL)
    // const data = {
    //     name: this.props.name,
    //     token: this.props.token,
    //   };
    fetch(URL, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': this.state.token
        },
      })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)

            this.setState({taskDetails: {
                tasksCompleted: res.tasksCompleted,
                totalTasks: res.totalTasks
            }})
          // redirect if success

          if(res.latestTasks.length) {
            const todoArr = [];
            res.latestTasks.forEach((item)=> {
                todoArr.push({id: item._id, todo: item.name, isCompleted: item.completed})
            });
            this.setState({
                todoList: todoArr
            })
          } else {
              this.showEmptyPanel();
          }
        });
    }

    componentDidUpdate = () => {
        // LocalStorageService.setLocalData(this.state.todoList);
        
    }

    formSubmit = (todo) => {

        if(todo) {
           let todoItem = {
            // id: uuidv4(),
            name: todo,
            isCompleted: false
           }

        // push the created todo item into todoList array.
        //    this.setState({
        //        todoList: [ ...this.state.todoList, todoItem ]
        //    })

        const URL = endPoint + 'tasks';
        // const data = {
        // name: name,
        // apiKey: apiKey,
        // };
        fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': this.state.token
        },
        body: JSON.stringify(todoItem),
        }) 
        .then((res) => res.json())
        .then((res) => { console.log(res)

            let newTask = {
                id: res.task._id,
                todo: res.task.name,
                isCompleted: res.task.completed
               }
               console.log(newTask)
            this.setState({
                todoList: [
                    ...this.state.todoList,
                    newTask
                ]
            })
            this.setState({taskDetails: {
                tasksCompleted: 0,
                totalTasks: this.state.taskDetails.totalTasks + 1
            }})
        });

        }
    }

    changeItemState = (id) => {
        const data = {};
        const newList = this.state.todoList.map((listItem) => {

            if(listItem.id === id) {
                console.log(listItem)
                listItem.isCompleted = !listItem.isCompleted;
                data.name = listItem.todo;
                data.completed =listItem.isCompleted;
            }

            return listItem;
        })

        // assign the newList to the global state todoList
        this.setState({
            todoList: newList
        })
        console.log(data)
        const URL = endPoint + 'tasks/'+id;
        // const data = {
        // name: name,
        // apiKey: apiKey,
        // };
        fetch(URL, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': this.state.token
        },
        body: JSON.stringify(data),
        }) 
        .then((res) => res.json())
        .then((res) => { console.log(res)
        });

    }

    deleteTodoItem = (id) => {
        const newList = this.state.todoList.filter((listItem)=> {
            return listItem.id !== id;
        })

        // assign the newList to the global state todoList
        this.setState({
            todoList: newList
        })

        // 
        const URL = endPoint + 'tasks/'+id;
        fetch(URL, {
            method: 'DELETE',
            headers: {
              'accept': 'application/json',
              'Authorization': this.state.token
            },
          })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);

                if(!this.state.todoList.length) {
                    this.showEmptyPanel()
                }
                this.setState({taskDetails: {
                    tasksCompleted: 0,
                    totalTasks: this.state.taskDetails.totalTasks - 1
                }})
            });
    }

    logout = () => {
        window.location = '/';
        sessionStorage.clear();
    }

    showTaskList = () => {
        this.setState({
            showEmpty: false
        })
    }

    showEmptyPanel = () => {
        this.setState({
            showEmpty: true
        })
    }

    render() {
        return ( 
           <div className='app-wrapper'>
               {
                   !this.state.showEmpty ? (
                    <>
                        <header>
                            <h3>Task Completed: {this.state.taskDetails.tasksCompleted +' / '+ this.state.taskDetails.totalTasks}</h3>
                            <Button variant="contained" onClick={this.logout}>Logout</Button>
                        </header>
                        <div className='todo-container'>
                            <TodoForm onFormSubmit={this.formSubmit} />
                            <TodoList list={this.state.todoList} 
                                changeState={(id) => this.changeItemState(id)}
                                deleteListItem={(id) => this.deleteTodoItem(id)} />
                        </div>
                    </>
                   ) : (
                       <div className='no-task'>
                           <h2>No Task Found</h2>
                           <Button variant="contained" onClick={this.showTaskList}>Add Task</Button>
                       </div>
                   )
               }
           </div>
         );
    }
}
 
export default TodoApp;
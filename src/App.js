import React from 'react';
import './App.css';
import TodoApp from './Components/TodoApp/TodoApp';
import LoginForm from './Components/LoginForm/LoginForm';
import {Routes, Route} from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      token: ''
    }
  }

  tokenChange = (res) => {
    this.setState({
      name: res.name,
      token: res.token
    });

    sessionStorage.setItem('token', res.token);
  }

  render() {
    return (
      <div className="app">
        {/* <LoginForm onTokenChange={(res) => this.tokenChange(res)} /> */}
        {/* <div className="todo-container">
          <TodoApp />
        </div> */}
        <Routes>
          <Route exact path="/" element={<LoginForm onTokenChange={(res) => this.tokenChange(res)} />} />
          <Route exact path="/dashboard" element={<TodoApp token={this.state.token} name={this.state.name} />} />
        </Routes>
      </div>
    );
  }
}

export default App;

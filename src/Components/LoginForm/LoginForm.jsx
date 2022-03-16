import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './LoginForm.css';
import { endPoint, apiKey } from '../../config';
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

const LoginForm = ({onTokenChange}) => {
  const [name, setName] = useState();
  let navigate = useNavigate();

  const handleForm = () => {
    const URL = endPoint + 'login';
    const data = {
      name: name,
      apiKey: apiKey,
    };
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => { console.log(res)
        onTokenChange(res.token);

        // redirect if success
        navigate('/dashboard');
      });
  };

  return (
    <div className="loginform">
      <h1>Login</h1>
      <TextField
        id="outlined-basic"
        label="ID"
        variant="outlined"
        value={apiKey}
        disabled
      />
      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant="contained" onClick={handleForm}>
        Submit
      </Button>
    </div>
  );
};

export default LoginForm;

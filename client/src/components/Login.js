import React, { useState } from "react";
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { useForm } from 'react-hook-form';


const Login = props => {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { handleSubmit, register, errors } = useForm({});

  const onSubmit = e => {
    axiosWithAuth()
      .post('/api/login', {
        username: username,
        password: password,
      })
      .then(res => {
        console.log(res);
        localStorage.setItem('token', res.data.payload);
        props.history.push('/');
      })
      .catch(err => console.log('ERRORRRRR', err))
  };

  const handleChange = e => {
    e.preventDefault();
    setUsername(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='username'>Username</label>
      <input
        id='username'
        name='username'
        type='text'
        onChange={handleChange}
        ref={register({
          required: 'Username required!'
        })}
      />
      {errors.username && errors.username.message}

      <label htmlFor='password'>Password</label>
      <input
        id='password'
        name='password'
        type='password'
        onChange={handleChange}
        ref={register({
          required: 'Password required -- like, obviously.'
        })}
      />
      {errors.password && errors.password.message}

      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;

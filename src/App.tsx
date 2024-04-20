import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from "page/Home";
import { Login } from 'page/Login';
import React, { useState, useEffect } from 'react';

function App() {

  useEffect(() => {
    console.log(process.env.REACT_APP_API_KEY);
  });

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={Login} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

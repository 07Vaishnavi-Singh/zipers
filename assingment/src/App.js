import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import SignIn from './Components/Signin';
import User from './Pages/User';
import Admin from './Pages/Admin';
import Loading from './Pages/Loading';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Loading />} />
        <Route exact path="/login" element={<SignIn />} />
        <Route exact path="/admin/:name" element={<Admin />} />
        <Route exact path="/user/:name" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

export default App;

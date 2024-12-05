import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import {  useDispatch } from 'react-redux'
import Main from "./components/Main";
import About from "./components/About";
import Contact from "./components/Contact";
import Post from "./components/Post"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import SearchPosts from "./components/SearchPosts"

import Register from "./components/Register"
import Addpost from "./components/Addpost"
import { fetchPosts } from './redux/features/posts/postsSlice'
import { fetchUserAuth } from "./redux/features/user/userSlice";

function App(props) {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchUserAuth())
  }, [])

  return (
    <div id="container">
      <Routes>        
        <Route path="/" element={<Main />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post/:id/edit" element={<Addpost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/add-post" element={<Addpost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts/search" element={<SearchPosts />} />

      </Routes>
    </div>
  );
}

export default App;

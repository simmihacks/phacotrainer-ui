//import 'regenerator-runtime/runtime'
import React, {useEffect, useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Routes, Link, useNavigate } from "react-router-dom";

import Register from "./components/Register"
import Upload from "./components/Upload"
import Login from "./components/Login"
import Detail from "./components/Detail"


export default function App() {

    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        setToken("")
        navigate('/login')
    }

    const [token, setToken] = useState("")

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        setToken(authToken)
        console.log("authToken:", authToken, token)
    })

    return(
        <div>
            
            <Routes>
                <Route path="/" exact element={<Upload/>} />
                <Route path="/detail/:uid/:file" exact element={<Detail/>} />
                <Route path="/register" exact element={<Register/>} />
                <Route path="/login" exact element={<Login/>} />
                
            </Routes>
        </div>
    )
  
}

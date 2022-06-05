import React, {useState} from 'react';
import {    
    Container,
    Row,
    Col,
    Form,
    Button,
    Alert,
} from 'react-bootstrap';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Bars } from  'react-loader-spinner';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore"; 

const Login = () => {

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const [status, setStatus] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const db = getFirestore()

    const loginUser = async (e) => {
        e.preventDefault();
        setIsActive(true)

        try{
            let response = await signInWithEmailAndPassword(getAuth(),user.email, user.password)
    
            console.log("response:", response, response.user.accessToken)
            
            if(response._tokenResponse.refreshToken != null){
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                sessionStorage.setItem('localId', response._tokenResponse.localId)
                let localId = response._tokenResponse.localId

                const userRef = await doc(db, "users", localId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    let dd = userSnap.data()
                    sessionStorage.setItem('fullName', dd["fullName"])
                }
                let data = null;
                
                setIsActive(false)
                navigate("/")
            }else{
                setStatus(true)
                setIsActive(false)
            }
        }
        catch(error){
            console.log("Error:", error)
        }

        
    }

    return (
             
                <div style={{width: '100%'}}>
                    <Row>
                         <Col  md={6}>
                            <img id="auth" src="/bg.png" alt="image" />
                        </Col>
                        <Col sm={12} md={1} />
                        <Col sm={12} md={4}>
                            {status ? 
                                <Alert variant="danger"> Invalid email or password. </Alert> : null
                            }
                            <Form onSubmit={loginUser} style={{marginTop: '7em'}}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" value={user.email} onChange={(e)=>{setUser({...user, email: e.target.value})}} placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" value={user.password} onChange={(e)=>{setUser({...user, password: e.target.value})}} placeholder="Password" />
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Remember Me" />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Login
                                </Button>
                            </Form>
                            
                            <br/>
                            <a href="/register">New User? Create Account</a>
                        </Col>
                        <Col sm={12} md={1} />
                    </Row>
                </div>
       
    )
};


export default Login;
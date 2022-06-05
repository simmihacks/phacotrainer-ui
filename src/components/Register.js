import React, {useState, useEffect} from 'react';
import {    
    Container,
    Row,
    Col,
    Form,
    Button,
    Alert
} from 'react-bootstrap';
import { app } from '../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs } from "firebase/firestore";
import { Bars } from  'react-loader-spinner'

const Register = () => {

    const [user, setUser] = useState({email: "", password: "", fullName: ""})

    const [status, setStatus] = useState(false)
    const [isActive, setIsActive] = useState(false)
    

    const createAccount = async (e) =>  {

        setIsActive(true)
        e.preventDefault();

        const authentication = getAuth();
        const db = getFirestore();

        try{

            let response = await createUserWithEmailAndPassword(authentication, user.email, user.password)

            let uid = response.user.uid;
            let fullName = user.fullName;
            await setDoc(doc(db, "users", uid), {
                uid: uid,
                timestamp: new Date().getTime(),
                fullName: fullName
            })

            setIsActive(false)
            setStatus(true);

        }catch(error){

            console.log("Error:", error)

        }

       
    }

    return (
        
        
            <div>
                <Row>
                    <Col md={6}>
                        <img src="/bg.png" id="auth" alt="image" />
                    </Col>
                    <Col md={1} />
                    <Col sm={12} md={4}>
                        
                        <Form onSubmit={createAccount} style={{marginTop: '7em'}}>
                            {status ? 
                                <Alert variant="success"> Account Created Successfully! Login to continue. </Alert> : null
                            }
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" required value={user.fullName} onChange={(e) => setUser( {...user, fullName: e.target.value} )} placeholder="Enter full name"  />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" required value={user.email} onChange={(e) => setUser( {...user, email: e.target.value} )} placeholder="Enter email"  />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" required value={user.password} onChange={ (e) => setUser({...user, password: e.target.value}) } placeholder="Password" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Create Account
                            </Button>
                        </Form>
                        <br/>
                        <a href="/login">Existing User ? Login</a>
                    </Col>
                    <Col md={1} />
                </Row>
            </div>
        
    )

}

export default Register;
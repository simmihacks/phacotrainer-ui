import React from 'react';
import {useParams} from 'react-router';
import {
    Container,
    Form, 
    Button,
    Row,
    Col
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Detail = () => {

    let {uid, file} = useParams();

    let fileName = `${file}.mp4`;

    let fullName = sessionStorage.getItem('fullName')

    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        navigate('/login')
    }

    return (
            <div>
                <div className="sidebar">
                    <h6 style={{color: '#fff',padding: '20px'}}>PhacoTrainer</h6>
                    <div style={{color: '#fff',padding: '20px'}}>
                        <h4>Welcome</h4> 
                        <h5>{fullName}</h5>
                    </div>
                    <div style={{marginTop: '7em'}}>
                        <a href="/">Upload</a>
                        <a onClick={handleLogout}>Logout</a>
                    </div>
                    

                </div>

                <div className="content">
                     <Container style={{marginTop: '2em'}}>
                        <Row style={{marginTop: '5em'}}>
                            <Col sm={12} md={12} key={uid}>
                                <video width="760" height="480" 
                                    src={ `https://firebasestorage.googleapis.com/v0/b/video-uploader-ae0a3.appspot.com/o/${uid}%2F${fileName}?alt=media`} 
                                    controls>
                                    Your browser does not support the video tag.
                                </video>
                            </Col>  
                        </Row>
                     </Container>
                </div>
            </div>

           
        
    )
    

}

export default Detail;
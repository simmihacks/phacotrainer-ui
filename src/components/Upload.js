import React, {useState, useEffect, useCallback, useMemo} from 'react'
import {useDropzone} from 'react-dropzone'
import {
    Container,
    Form, 
    Button,
    Row,
    Col
} from 'react-bootstrap';
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; 
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Bars } from  'react-loader-spinner'

const Upload = () => {

    const [file, setFile] = useState("")
    const storage = getStorage()
    const db = getFirestore()
    const [videos, setVideos] = useState([])
    const [usid, setUsid] = useState("")
    const [isActive, setIsActive] = useState(false)
    const [fs, setFS] = useState(false)

    const navigate = useNavigate();

    const fetchVideos = async () => {
        const querySnapshot = await getDocs(collection(db, "videos"));
        let data = null;
        querySnapshot.forEach((doc) => { setVideos(videos => [...videos, doc.data()]) });
        setUsid(sessionStorage.getItem('localId'))
    }

    useEffect(() => {

        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            navigate('/')
        }

        if (!authToken) {
            navigate('/login')
        }

        setVideos([])
       
        fetchVideos();
    }, [])

    const cancelUpload = () => {
        setFile("")
        setFS(false)
    }

    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        navigate('/login')
    }

    const baseStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '110px',
        borderWidth: 2,
        borderRadius: 5,
        borderRadius: '30px',
        height: '300px',
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        transition: 'border .3s ease-in-out'
    };

    const activeStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };

    let date = new Date().getTime() + parseInt( 100000 * Math.random() );
    const onDrop = useCallback(async acceptedFiles => {
        
        try{
            
            let format = acceptedFiles[0].name.toString().split(".")
            format = format[format.length -1]
            setFile(acceptedFiles[0])

            let fileName = `${date}.${format}`

            let uid = sessionStorage.getItem('localId');
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => { 
                uid = user.uid 
            })
            
            console.log(acceptedFiles[0])
            console.log("uid/filename:", `${uid}/${fileName}`)

            const videoRef = await storageRef(storage, `${uid}/${fileName}`);
            await uploadBytes(videoRef, acceptedFiles[0]).then( async(snapshot) => {
                console.log('Uploaded a blob or file!');
                const docRef = await addDoc(collection(db, "videos"), {
                    fileName: fileName,
                    creationDate: new Date(),
                    uid: uid,
                    videold: date
                });
                window.location.reload()
            });

        }catch(error){
            console.log("Error:", error)
        }


    }, [])

    const {getRootProps, getInputProps, isDragActive,isDragAccept,isDragReject} = useDropzone({onDrop})

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    let fullName = sessionStorage.getItem('fullName')

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
                        <h5>New Video</h5>
                        <Row>
                            <Col md={3} />
                            <Col sm={12} md={6}>

                                <div {...getRootProps({style})}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <p>Click to browse or drag and drop your file</p>
                                    }
                                </div>
                                
                            </Col>
                            <Col md={3} />
    
                        </Row>

                        <Row style={{marginTop: '5em'}}>
                            
                                <h5>Videos</h5>
                                {
                                    videos && videos.map(video => {
                                        return(
                                            <Col sm={12} md={4} key={video.fileName}>
                                                <video width="250" height="240" 
                                                    src={ `https://firebasestorage.googleapis.com/v0/b/video-uploader-ae0a3.appspot.com/o/${video.uid}%2F${video.fileName}?alt=media`} 
                                                    controls>
                                                    Your browser does not support the video tag.
                                                </video>
                                                <a href={`/detail/${video.uid}/${video.fileName.split(".")[0]}`}>
                                                    <BoxArrowUpRight />
                                                </a><br/><br/>

                                            </Col>  
                                        )
                                    })
                                }
                            
                        </Row>
                    </Container>
                </div>
            </div>

           
        
    )
}

export default Upload;
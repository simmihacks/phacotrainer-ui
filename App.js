import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./components/pages/register";
import Dashboard from "./components/pages/dashboard";
import Login from "./components/pages/login";
import AccountRecovery from "./components/pages/account-recovery";
import Video from "./components/pages/video";
import Landing from "./components/pages/landing";

export default function App() {
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //     sessionStorage.removeItem('Auth Token');
  //     setToken("")
  //     navigate('/login')
  // }

  // const [token, setToken] = useState("")

  // useEffect(() => {
  //     let authToken = sessionStorage.getItem('Auth Token')
  //     setToken(authToken)
  // })

  return (
    <Routes>
      {/* Show landing page when not logged in, show dashboard when logged in. */}
      <Route path="/" exact element={<Landing />} />
      <Route path="/dashboard" exact element={<Dashboard />} />
      <Route path="/video/:uid/:file" exact element={<Video />} />
      <Route path="/register" exact element={<Register />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/account-recovery" exact element={<AccountRecovery />} />
    </Routes>
  );
}

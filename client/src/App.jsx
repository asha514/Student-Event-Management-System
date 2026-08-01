import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import RegisterEvent from "./pages/RegisterEvent";
import RegistrationSuccess from "./pages/RegistrationSuccess";


function App() {
  return (
    <Routes>
      <Route path="/events" element={<Events />} />
      <Route path="/my-registrations" element={<MyRegistrations />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-event" element={<RegisterEvent />} />  
      <Route path="/registration-success" element={<RegistrationSuccess />} />
    </Routes>
  );
}

export default App;
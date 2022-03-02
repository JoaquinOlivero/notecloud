import "./App.css";
import Container from "./components/Container/Container";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './contexts/UserContext';
import { SocketContext, socket } from './contexts/UserSocketContext';
import axios from "axios";

function App() {
  // Proxy to api
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_API;
  axios.defaults.withCredentials = true;

  return <div className="App">
    <BrowserRouter>
      <UserProvider>
        <SocketContext.Provider value={socket}>
          <Container />
        </SocketContext.Provider>
      </UserProvider>
    </BrowserRouter>

  </div>;
}

export default App;

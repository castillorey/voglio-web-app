import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./pages/Wrapper";

function App() {
  return (
    <div className="flex justify-center px-6 py-12 lg:px-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <Wrapper>
                <Dashboard />
              </Wrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

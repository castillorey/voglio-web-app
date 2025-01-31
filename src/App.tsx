import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Wrapper from "./pages/Wrapper";
import Voglios from "./pages/Voglios";
import Friends from "./pages/Friends";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Wrapper />} >
            <Route index element={<Voglios />}/>
            <Route path="friends" element={<Friends />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

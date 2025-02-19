import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Wrapper from "./pages/Wrapper";
import Voglios from "./pages/Voglios";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";
import Voglio from "./pages/Voglio";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Wrapper />}>
            <Route index element={<Voglios />} />
            <Route path="category/:categoryId" element={<Category />} />
          </Route>
          <Route path="voglio/:voglioId" element={<Voglio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

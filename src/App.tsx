import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Wrapper from "./pages/Wrapper";
import Collections from "./pages/Collections";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";
import Voglio from "./pages/Voglio";
import Account from "./pages/Account";
import Friends from "./pages/Friends";
import UserCollections from "./pages/UserCollections";
import UserCategory from "./pages/UserCategory";
import Bookmarked from "./pages/Bookmarked";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Wrapper />}>
            <Route index element={<Collections />} />
            <Route path="category/:categoryId" element={<Category />} />
            <Route path="voglio/:voglioId" element={<Voglio />} />
            <Route path="bookmarked" element={<Bookmarked />} />
            <Route path="account" element={<Account />} />
            <Route path="friends" element={<Friends />} />
            <Route path="friends/u/:username" element={<UserCollections />} />
            <Route path="friends/u/:username/category/:categoryId" element={<UserCategory />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Wrapper = lazy(() => import("./pages/Wrapper"));
const Collections = lazy(() => import("./pages/Collections"));
const Category = lazy(() => import("./pages/Category"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Voglio = lazy(() => import("./pages/Voglio"));
const Account = lazy(() => import("./pages/Account"));
const Friends = lazy(() => import("./pages/Friends"));
const UserCollections = lazy(() => import("./pages/UserCollections"));
const UserCategory = lazy(() => import("./pages/UserCategory"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Bookmarked = lazy(() => import("./pages/Bookmarked"));

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#f8f6f4]">
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1a1a1a] border-t-transparent" />
        <p className="text-sm text-[#8a8a8a]">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
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
              <Route path="friends/u/:username/profile" element={<UserProfile />} />
              <Route path="friends/u/:username/category/:categoryId" element={<UserCategory />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;

import { Outlet } from "react-router";
function Main() {
  return (
    <main className="flex justify-center px-6 py-12 lg:px-8">
      <Outlet></Outlet>
    </main>
  );
}
export default Main;

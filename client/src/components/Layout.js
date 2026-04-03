import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Player from "./Player";

function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/profile-setup";

  return (
    <div className={`app-layout ${isAuthPage ? "auth-layout" : ""}`}>
      {!isAuthPage && <Sidebar />}
      <div className="main-content">{children}</div>
      {!isAuthPage && <Player />}
    </div>
  );
}

export default Layout;
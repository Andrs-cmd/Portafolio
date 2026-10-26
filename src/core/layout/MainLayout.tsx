import { Outlet } from "react-router-dom"
import  Navbar  from "../navigation/Navbar"
import IrisChat from "../../components/IrisChat"

function MainLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <IrisChat />
    </div>
  )
}

export default MainLayout

import { Outlet } from "react-router-dom"
import  Navbar  from "../navigation/Navbar"

function MainLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
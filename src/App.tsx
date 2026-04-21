import { BrowserRouter, Routes, Route } from "react-router-dom"
  import MainLayout from "./core/layout/MainLayout"
import Home from "./pages/Home"
import Manifesto from "./pages/Manifesto"
import Lab from "./pages/Lab"
import Archive from "./pages/Archive"
import Contact from "./pages/Contact"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
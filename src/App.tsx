import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import MainLayout from "./core/layout/MainLayout"
import { ThemeProvider } from "./context/ThemeContext"

const Home      = lazy(() => import("./pages/Home"))
const Manifesto = lazy(() => import("./pages/Manifesto"))
const Lab       = lazy(() => import("./pages/Lab"))
const Archive   = lazy(() => import("./pages/Archive"))
const Visual    = lazy(() => import("./pages/Visual"))
const Automation = lazy(() => import("./pages/Automation"))
const Contact   = lazy(() => import("./pages/Contact"))

function PageFallback() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060606", color: "#fff", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", opacity: .55 }}>
      Cargando
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/manifesto" element={<Manifesto />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/visual" element={<Visual />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import MainLayout from "./core/layout/MainLayout"
import { ThemeProvider } from "./context/ThemeContext"

const Home      = lazy(() => import("./pages/Home"))
const Lab       = lazy(() => import("./pages/Lab"))
const Archive   = lazy(() => import("./pages/Archive"))
const Visual    = lazy(() => import("./pages/Visual"))
const Automation = lazy(() => import("./pages/Automation"))
const Contact   = lazy(() => import("./pages/Contact"))
const Legal     = lazy(() => import("./pages/Legal"))

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
              <Route path="/lab" element={<Lab />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/visual" element={<Visual />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

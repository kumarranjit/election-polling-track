import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Contact from "./pages/contact/Contact";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { mobileNumber } = useAuth();

  if (!mobileNumber) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Hero Section */}
      <main className="flex-1 pt-16 pb-4 bg-white">
        {/* Adjust pt for header height, pb for footer */}
        <div className="container mx-auto px-4 pt-4 pb-8">
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />

              {/* Protected routes: require successful login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
            </Routes>
          </AuthProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

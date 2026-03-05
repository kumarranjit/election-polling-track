import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Contact from "./pages/contact/Contact";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { user, mobileNumber, isAuthReady } = useAuth();

  // Wait until we know whether a user is stored in localStorage
  if (!isAuthReady) {
    return null; // or a small loader if you prefer
  }

  // Prefer checking the stored auth user; mobileNumber is a convenience for data fetching.
  if (!user && !mobileNumber) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        {/* Hero Section */}
        <main className="flex-1 pt-16 pb-4 bg-white">
          {/* Adjust pt for header height, pb for footer */}
          <div className="container mx-auto px-4 pt-4 pb-8">
            <Routes>
              <Route path="/" element={<Login />} />

              {/* Protected routes: require successful login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

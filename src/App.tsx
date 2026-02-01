import './App.css'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Contact from './pages/contact/Contact';
// import PollDetail from './pages/poll-detail/PollDetail';
// import CreatePoll from './pages/create-poll/CreatePoll';
// import Results from './pages/results/Results';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
       {/* Hero Section */}
      <main className="flex-1 pt-16 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100"> {/* Adjust pt for header height, pb for footer */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/poll/:id" element={<PollDetail />} />
            <Route path="/create" element={<CreatePoll />} />
            <Route path="/results/:id" element={<Results />} /> */}
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App

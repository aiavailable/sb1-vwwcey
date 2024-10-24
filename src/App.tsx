import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import CreateAd from './pages/CreateAd';
import AdDetails from './pages/AdDetails';
import CategoryView from './pages/CategoryView';
import Messages from './pages/Messages';
import Sitemap from './pages/Sitemap';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/create-ad" element={<CreateAd />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/ad/:id" element={<AdDetails />} />
              <Route path="/category/:category" element={<CategoryView />} />
              <Route path="/_sitemap" element={<Sitemap />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}
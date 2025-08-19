import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { FiHome, FiUser, FiMessageSquare, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/dashboard" className="logo">
          <span>GoalTracker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-menu desktop-nav">
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <FiHome />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/feed" 
            className={`nav-item ${isActive('/feed') ? 'active' : ''}`}
          >
            <FiMessageSquare />
            <span>Feed</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            <FiUser />
            <span>Profile</span>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <nav className={`nav-menu mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FiHome />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/feed" 
            className={`nav-item ${isActive('/feed') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FiMessageSquare />
            <span>Feed</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FiUser />
            <span>Profile</span>
          </Link>
          
          <button onClick={handleLogout} className="nav-item logout-nav">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>

        <div className="header-actions">
          <div className="user-info desktop-only">
            <span className="user-name">{userProfile?.displayName}</span>
          </div>
          
          {/* Desktop Logout */}
          <button onClick={handleLogout} className="logout-button desktop-only">
            <FiLogOut />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

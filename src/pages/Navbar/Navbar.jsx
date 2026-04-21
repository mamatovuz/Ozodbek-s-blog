import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <div>
      <nav>
        <div className="logo">
          <Link to="/">
            <h1>Ozodbek's Blog</h1>
          </Link>
        </div>

        <button
          type="button"
          className={`nav-toggle ${isOpen ? 'open' : ''}`}
          aria-label="Menyuni ochish"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About me</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link to="/skills" onClick={() => setIsOpen(false)}>Skills</Link>
          <Link to="https://t.me/OzodFlow" target="_blank" rel="noreferrer">
            Channel
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar

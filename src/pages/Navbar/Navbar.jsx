import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <nav>
        <div className="logo">
          <Link to="/">
            <h1>Ozodbek's Blog</h1>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About me</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/skills">Skills</Link>
          <a href="https://t.me/OzodCode" target="_blank" rel="noreferrer">
            Channel
          </a>
        </div>
      </nav>
    </div>
  )
}

export default Navbar

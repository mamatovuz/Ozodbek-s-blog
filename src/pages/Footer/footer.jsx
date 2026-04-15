import React from 'react'
import './footer.css'

const Footer = () => {
  const yil = new Date()

  return (
    <footer>
      <div>&copy; {yil.getFullYear()} Ozodbek's Blog</div>
    </footer>
  )
}

export default Footer

import React from 'react'
import './Skills.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/footer'

const Talks = () => {
  return (
    <>
      <Navbar />

      <section className="skills">
        <h1>Men bilgan <span>Dasturlash</span> texnologiyalar</h1>
        <div className="line"></div>

        <div className="grid">
          <div className="card">
            <i className="fa-brands fa-html5"></i>
            <h3>HTML</h3>
            <p>Web sayt strukturasi uchun</p>
          </div>

          <div className="card">
            <i className="fa-brands fa-css3-alt"></i>
            <h3>CSS</h3>
            <p>Dizayn va layout uchun</p>
          </div>

          <div className="card">
            <i className="fa-brands fa-js"></i>
            <h3>JavaScript</h3>
            <p>Interaktivlik va logika</p>
          </div>

          <div className="card">
            <i className="fa-brands fa-node-js"></i>
            <h3>Node.js</h3>
            <p>Backend yaratish uchun</p>
          </div>

          <div className="card">
            <i className="fa-solid fa-database"></i>
            <h3>Database</h3>
            <p>Ma’lumot saqlash</p>
          </div>

          <div className="card">
            <i className="fa-brands fa-react"></i>
            <h3>React</h3>
            <p>Frontend framework</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Talks
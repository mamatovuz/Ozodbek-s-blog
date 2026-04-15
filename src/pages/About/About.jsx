import React from 'react'
import './About.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/footer'
import Rasimim from '../home/img/rasimim.jpg'

const About = () => {
  let yosh = new Date().getFullYear() - 2010

  return (
    <>
      <Navbar />

      <section className="about">
        <h1>Men haqimda</h1>
        <div className="line"></div>

        <div className="about-container">
          
          
          <div className="about-text">
            <p>
              Salom, mening ismim <b>Ozodbek</b>. Yoshim <b>{yosh}</b> da.
              Men frontend dasturchiman va hozir backendni o‘rganayapman.
            </p>

            <p>
              Yaqinda <b>Frontend sertifikat</b> olaman. Keyinchalik
              backendni ham mukammal o‘rganib, <b>FullStack developer</b> bo‘lishni maqsad qilganman.
            </p>

            <p>
              Men kod yozish va trading bilan shug‘ullanaman.
              Qiziqishlarim: <b>Trading, kripto, NFT</b>.
            </p>

            <div className="skills-box">
              <h3>Texnik ko‘nikmalar</h3>
              <ul>
                <li>HTML / CSS / JavaScript</li>
                <li>React.js / Tailwind</li>
                <li>Node.js (o‘rganilmoqda)</li>
                <li>API va Database bilan ishlash</li>
              </ul>
            </div>

            <p className="goal">
              🎯 Maqsadim — kuchli FullStack developer bo‘lish va katta loyihalarda ishlash.
            </p>
          </div>

         
          <div className="about-img">
            <img src={Rasimim} alt="Ozodbek" />
          </div>

        </div>
      </section>

      <Footer />
    </>
  )
}

export default About
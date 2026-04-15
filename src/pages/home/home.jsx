import React from 'react'
import './home.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/footer'
import profile from './img/rasimim.jpg'

const Home = () => {
 const YouTube = () => {
  window.open('https://www.youtube.com/', '_blank')
 }
const GitHub = () => {
  window.open('https://www.github.com/mamatovuz', '_blank')
 }
 const LinkedIn = () => {
  window.open('https://www.linkedin.com/in/ozodbek-mamatov', '_blank')
 }
 const Telegram = () => {
  window.open('https://t.me/OzodCode', '_blank')
 }
 const About = () => {
 window.location.href = '/about'
 }
 const Blog = () => {
 window.location.href = '/blog'
 }


 	return (
    <>
    	<Navbar />
		<div className='contain'>
		
			<section className='header'>
				<div className='header-container'>
					<img src={profile} alt='profile' className='profile-img' />

					<div className='header-text'>
						<h1 className='tittle'>
							Ozodbek
						</h1>
						<h3>Frontend Dasturchin</h3>

						<div className='icons'>
							<i onClick={YouTube} className='fab fa-youtube'></i>
							<i onClick={GitHub} className='fab fa-github'></i>
							<i onClick={LinkedIn} className='fab fa-linkedin'></i>
						<i onClick={Telegram} className="fa-brands fa-telegram"></i>
						</div>

					
					</div>
				</div>
			</section>
  <div className="pastki">
    	<p>Raqamli dunyoda raqamsiz narsalar haqida gaplashamiz</p>

						<div className='buttons'>
							<button onClick={Blog} className='btn primary'>Read Blog</button>
							<button onClick={About} className='btn outline'>About Me</button>
						</div>
  </div>
		
		</div>
    	<Footer />
    </>
	)
}

export default Home

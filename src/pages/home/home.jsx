import React from 'react'
import './home.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/footer'
import profile from './img/rasimim.jpg'
import { Link } from 'react-router-dom'

const Home = () => {
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
							<Link to="https://www.youtube.com/@mamatov_ads" target="_blank" rel="noreferrer" aria-label="YouTube">
								<i className='fab fa-youtube'></i>
							</Link>
							<Link to="https://www.github.com/mamatovuz" target="_blank" rel="noreferrer" aria-label="GitHub">
								<i className='fab fa-github'></i>
							</Link>
							<Link to="https://www.linkedin.com/in/mamatovozodbek/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
								<i className='fab fa-linkedin'></i>
							</Link>
							<Link to="https://t.me/OzodCode" target="_blank" rel="noreferrer" aria-label="Telegram">
								<i className="fa-brands fa-telegram"></i>
							</Link>
						</div>

					
					</div>
				</div>
			</section>
  <div className="pastki">
    	<p>Raqamli dunyoda raqamsiz narsalar haqida gaplashamiz</p>

						<div className='buttons'>
							<Link to="/blog" className='btn primary'>Read Blog</Link>
							<Link to="/about" className='btn outline'>About Me</Link>
						</div>
  </div>
		
		</div>
    	<Footer />
    </>
	)
}

export default Home

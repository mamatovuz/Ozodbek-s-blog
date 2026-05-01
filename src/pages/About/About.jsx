import React from 'react'
import './About.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/footer'
import Rasimim from '../home/img/rasimim.jpg'

const About = () => {
	return (
		<>
			<Navbar />
			<div className='About-page'>
				<div className='title'>
					<h1>Men haqimda</h1>
					<hr />
				</div>

				<div className='aboutp'>
					<p>
						Salom, mening ismim <b>Ozodbek</b>. Men <b>Andijon</b>likman va hozirda dasturlashni chuqur o‘rganib kelmoqdaman. 
						<b> Frontend</b> yo‘nalishini tugatib, hozir <b>Backend</b> tomon qadam qo‘yyapman.
					</p>

					<img src={Rasimim} alt="Ozodbek rasmi" />

					<p>
						Hozirgi kunda ko‘pchilik <b>AI sabab dasturchilarga ish qolmaydi</b> degan gaplarni aytmoqda. 
						Lekin men bu fikrga boshqacha qarayman. Shuning uchun blogimning asosiy g‘oyasi:
						<b> "Raqamli dunyoda raqamsiz narsalar haqida gaplashamiz"</b>.
					</p>

					<p>
						Oddiy qilib aytganda, hamma texnologiya haqida gapirayotgan paytda, biz insoniylik, fikrlash, 
						odatlar va hayotiy qarashlar haqida ham suhbatlashamiz. Bu — biroz boshqacha yondashuv.
					</p>

					<p>
						Ochig‘ini aytsam, ko‘pchilik meni <b>"dangasa"</b> deb o‘ylaydi. Chunki ba’zida ishlarni 
						keyinga qoldirgan paytlarim bo‘lgan. Lekin men o‘z ustimda ishlashni davom ettiryapman 
						va har kuni oz bo‘lsa ham oldinga harakat qilaman.
					</p>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default About
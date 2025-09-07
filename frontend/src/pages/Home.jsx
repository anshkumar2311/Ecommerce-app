import React from 'react'
import '../pageStyles/Home.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'

function Home() {
    return (
        <>
            <Navbar />
            <ImageSlider />
            <div className="home-container">
                <h2 className="home-heading">Trending Now</h2>
            </div>
            <Footer />
        </>
    )
}

export default Home

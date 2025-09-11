import React from 'react';
import { Phone, Mail, GitHub, LinkedIn, YouTube, Instagram } from '@mui/icons-material';
import '../componentStyles/Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/*Section 1*/}
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p><Phone fontSize='Small' />Phone : 7906558634</p>
                    <p><Mail fontSize='Small' />Email : anshkumar1399@gmail.com</p>
                </div>
                {/*Section 2*/}
                <div className="footer-section social">
                    <h3>Follow Me</h3>
                    <div className="social-links">
                        <a href="" target="_blank">
                            <GitHub className='social-icon' />
                        </a>
                        <a href="" target="_blank">
                            <LinkedIn className='social-icon' />
                        </a>
                        <a href="" target="_blank">
                            <YouTube className='social-icon' />
                        </a>
                        <a href="" target="_blank">
                            <Instagram className='social-icon' />
                        </a>
                    </div>
                </div>
                {/*Section 3*/}
                <div className="footer-section about">
                    <h3>About Us</h3>
                    <p>This is a sample e-commerce website made by Ansh Kumar using MERN stack.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {(new Date().getFullYear())} Ansh Kumar. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer

import React from 'react';
import aboutImage from '../utils/img/about-chef1.jpg';
import '../styles/About.css';

function About() {
    return (
        <div className="about-container">
            <h1 className='mt-5'>About Us</h1>
            <img src={aboutImage} alt="About Us" className="about-image" />
            <p className="about-description">
                Welcome to Our Restaurant! We're dedicated to providing you with the best dining experience. Our menu is crafted with love, featuring locally sourced ingredients and innovative recipes. Our team is passionate about food and hospitality, ensuring that every visit is memorable. Join us to enjoy a culinary journey that delights all your senses!
            </p>
        </div>
    )
}

export default About;

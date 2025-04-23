import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Homepage.css';
 
const Homepage: React.FC = () => {
    return (
        <div className="homepage">
            {/* Navbar Section */}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        Cognizant Hospital
                    </Link>
                    <ul className="navbar-links">
                        <li>
                            <Link to="/" className="navbar-link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <a href="#about" className="navbar-link">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="#services" className="navbar-link">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="#testimonials" className="navbar-link">
                                Testimonials
                            </a>
                        </li>
                        <li>
                            <a href="#contact" className="navbar-link">
                                Contact
                            </a>
                        </li>
                        <li>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup" className="navbar-link navbar-signup">
                                Sign Up
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
 
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to Cognizant Hospital</h1>
                    <p className="hero-subtitle">
                        Your health is our priority. Experience world-class healthcare services with compassion and care.
                    </p>
                    {/* <div className="hero-buttons">
                        <Link to="/login" className="btn btn-primary">
                            Login
                        </Link>
                        <Link to="/signup" className="btn btn-secondary">
                            Sign Up
                        </Link>
                    </div> */}
                </div>
                <div className="hero-image">
                    <img
                        src="/images/back.jfif"
                        alt="Hospital"
                    />
                </div>
            </section>
 
            {/* Services Section */}
            <section id="services" className="services-section">
                <h2 className="section-title">Our Services</h2>
                <div className="services-container">
                    <div className="service-card">
                        <img
                            src="/images/Emergency.jfif"
                            alt="Emergency Care"
                        />
                        <h3>Emergency Care</h3>
                        <p>24/7 emergency services with highly trained medical staff and advanced equipment.</p>
                    </div>
                    <div className="service-card">
                        <img
                            src="/images/SpecialTreatments.jfif"
                            alt="Specialized Treatments"
                        />
                        <h3>Specialized Treatments</h3>
                        <p>Specialized departments for cardiology, oncology, neurology, and more.</p>
                    </div>
                    <div className="service-card">
                        <img
                            src="/images/Diagnosis.jfif"
                            alt="Diagnostics"
                        />
                        <h3>Diagnostics</h3>
                        <p>State-of-the-art diagnostic facilities including MRI, CT scan, and X-ray.</p>
                    </div>
                </div>
            </section>
 
            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <h2 className="section-title">What Our Patients Say</h2>
                <div className="testimonials-container">
                    <div className="testimonial-card">
                        <p>
                            "The doctors and staff are amazing. They provided excellent care and made me feel at ease
                            during my treatment."
                        </p>
                        <h4>- John Doe</h4>
                    </div>
                    <div className="testimonial-card">
                        <p>
                            "The facilities are top-notch, and the staff is very professional. I highly recommend this
                            hospital."
                        </p>
                        <h4>- Jane Smith</h4>
                    </div>
                </div>
            </section>
 
            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <h2 className="section-title">Contact Us</h2>
                <p>Email: contact@cognizanthospital.com</p>
                <p>Phone: +1 234 567 890</p>
                <p>Address: 123 Health Street, Wellness City</p>
            </section>
        </div>
    );
};
 
export default Homepage;
 
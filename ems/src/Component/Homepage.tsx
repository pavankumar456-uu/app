import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import '../CSS/Homepage.css';

const Homepage = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="homepage-banner">
                <h1 className="homepage-title">Welcome to Cognizant Hospital</h1>
                <p className="homepage-subtitle">Your health, our priority</p>
                <div className="homepage-buttons">
                    <Button as={Link as any} to="/registration" variant="primary" className="homepage-btn">
                        Login
                    </Button>
                </div>
            </div>

            {/* Navigation Bar */}
            <Navbar expand="lg" className="bg-primary navbar-dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">Cognizant Hospital</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/registration">Login</Nav.Link>
                            <Nav.Link href="#about">About Us</Nav.Link>
                            <Nav.Link href="#services">Services</Nav.Link>
                            <Nav.Link href="#contact">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Content Section */}
            <div className="homepage-content">
                <section id="about" className="py-5 bg-light">
                    <Container>
                        <h2 className="text-primary">About Us</h2>
                        <p>
                            Cognizant Hospital is dedicated to providing the best healthcare services to our patients.
                            With state-of-the-art facilities and experienced staff, we ensure your well-being is our top priority.
                        </p>
                    </Container>
                </section>
                <section id="services" className="py-5">
                    <Container>
                        <h2 className="text-primary">Our Services</h2>
                        <ul className="list-unstyled">
                            <li className="mb-2">✔ General Medicine</li>
                            <li className="mb-2">✔ Specialist Consultations</li>
                            <li className="mb-2">✔ Emergency Care</li>
                            <li className="mb-2">✔ Diagnostics and Imaging</li>
                            <li className="mb-2">✔ Pharmacy Services</li>
                        </ul>
                    </Container>
                </section>
                <section id="contact" className="py-5 bg-light">
                    <Container>
                        <h2 className="text-primary">Contact Us</h2>
                        <p>Email: <a href="mailto:contact@cognizanthospital.com">contact@cognizanthospital.com</a></p>
                        <p>Phone: <a href="tel:+1234567890">+1 234 567 890</a></p>
                        <p>Address: 123 Health Street, Wellness City</p>
                    </Container>
                </section>
            </div>
        </>
    );
};

export default Homepage;
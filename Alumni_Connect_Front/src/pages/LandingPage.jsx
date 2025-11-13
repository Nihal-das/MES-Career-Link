import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AlumniConnectLanding = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div>
      {/* Hero Section with Background Video */}
<section className="position-relative text-white text-center" style={{ height: "100vh" }}>
  <video autoPlay loop muted playsInline className="position-absolute w-100 h-100 object-fit-cover" style={{ zIndex: -1 }}>
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div className="container d-flex flex-column justify-content-center align-items-center h-100" data-aos="fade-down">
    <h1 className="display-4 fw-bold">Reconnect. Collaborate. Succeed.</h1>
    <p className="lead">Join our global alumni network and unlock new opportunities.</p>
    <Link to="/Login"><button className="btn btn-light btn-lg mt-3" data-aos="zoom-in">Login</button></Link>
  </div>
</section>


<section className="container my-5">
  <h2 className="text-center mb-4" data-aos="fade-down">Why Join Alumni Connect?</h2>
  <div className="row text-center">
    <div className="col-md-4" data-aos="fade-right">
      <div className="p-4 border rounded shadow-sm">
        <img src="https://source.unsplash.com/300x200/?network,team" className="img-fluid rounded mb-3" alt="Networking" />
        <h3>Networking</h3>
        <p>Connect with alumni, mentors, and industry leaders.</p>
      </div>
    </div>
    <div className="col-md-4" data-aos="zoom-in">
      <div className="p-4 border rounded shadow-sm">
        <img src="https://source.unsplash.com/300x200/?career,success" className="img-fluid rounded mb-3" alt="Job Referrals" />
        <h3>Job Referrals</h3>
        <p>Discover career opportunities shared by alumni.</p>
      </div>
    </div>
    <div className="col-md-4" data-aos="fade-left">
      <div className="p-4 border rounded shadow-sm">
        <img src="https://source.unsplash.com/300x200/?event,seminar" className="img-fluid rounded mb-3" alt="Exclusive Events" />
        <h3>Exclusive Events</h3>
        <p>Stay updated with alumni meetups and webinars.</p>
      </div>
    </div>
  </div>
</section>


<section className="bg-light py-5">
  <div className="container text-center">
    <h2 data-aos="fade-down">What Alumni Say</h2>
    <div className="row mt-4">
      <div className="col-md-4" data-aos="fade-up">
        <div className="p-3 border rounded shadow-sm">
          <img src="https://source.unsplash.com/100x100/?person,professional" className="rounded-circle mb-2" alt="John Doe" />
          <p>“This platform helped me reconnect with mentors and land a job at a top company!”</p>
          <h5>- John Doe</h5>
        </div>
      </div>
      <div className="col-md-4" data-aos="fade-up">
        <div className="p-3 border rounded shadow-sm">
          <img src="https://source.unsplash.com/100x100/?woman,executive" className="rounded-circle mb-2" alt="Jane Smith" />
          <p>“The alumni community is incredibly supportive and resourceful!”</p>
          <h5>- Jane Smith</h5>
        </div>
      </div>
      <div className="col-md-4" data-aos="fade-up">
        <div className="p-3 border rounded shadow-sm">
          <img src="https://source.unsplash.com/100x100/?businessman,success" className="rounded-circle mb-2" alt="Alex Johnson" />
          <p>“I found amazing career opportunities through Alumni Connect.”</p>
          <h5>- Alex Johnson</h5>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Community Stats */}
      <section className="bg-dark text-white text-center py-5">
        <h2 data-aos="fade-down">Our Growing Community</h2>
        <div className="container d-flex justify-content-around mt-4">
          <div data-aos="zoom-in">
            <h3 className="fw-bold">10,000+</h3>
            <p>Active Members</p>
          </div>
          <div data-aos="zoom-in">
            <h3 className="fw-bold">500+</h3>
            <p>Events Hosted</p>
          </div>
          <div data-aos="zoom-in">
            <h3 className="fw-bold">1,200+</h3>
            <p>Job Postings</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-primary text-white text-center py-3">
        <p>Connect with us:</p>
        <div>
          <a href="#" className="text-white mx-2">Facebook</a> |
          <a href="#" className="text-white mx-2">LinkedIn</a> |
          <a href="#" className="text-white mx-2">Twitter</a>
        </div>
        <p className="mt-2">© 2025 Alumni Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AlumniConnectLanding;



import React from 'react';
import './Footer.css';

/**
 * Footer Component
 * Simple branded footer shown on all pages.
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        TURF<span>ZONE</span>
      </div>
      <p className="footer-tagline">Book Premium Sports Facilities</p>
      <p className="footer-copy">
        © {new Date().getFullYear()} TurfZone — Built with React.js + Spring Boot + MySQL
      </p>
    </footer>
  );
}

export default Footer;

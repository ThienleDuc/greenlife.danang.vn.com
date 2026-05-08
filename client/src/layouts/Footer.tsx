// src/layouts/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-brand-name">
          GreenLife Da Nang
        </span>
        <span className="footer-copyright">
          © 2024 GreenLife Da Nang. The Conscious Guardian initiative.
        </span>
      </div>
      <div className="footer-links">
        <a className="footer-link" href="#">
          Privacy Policy
        </a>
        <a className="footer-link" href="#">
          Terms of Service
        </a>
        <a className="footer-link" href="#">
          Department of Agriculture
        </a>
        <a className="footer-link" href="#">
          Contact Support
        </a>
      </div>
    </footer>
  );
};

export default Footer;
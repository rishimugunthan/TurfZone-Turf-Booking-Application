import React from 'react';
import './HeroSection.css';
function HeroSection() {
  const scrollToTurfs = () => {
    const section = document.getElementById('turfs-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      {}
      <div className="hero-bg" />
      <div className="hero-pattern" />

      {}
      <div className="hero-content">
        <div className="hero-badge">⚡ Premium Sports Facilities</div>
        <h1 className="hero-title">
          PLAY <span className="hero-accent">YOUR</span> GAME
        </h1>
        <p className="hero-sub">
          Book premium turf slots in seconds. From cricket to badminton —
          find your court, pick your time, get on the field.
        </p>
        <button className="hero-cta" onClick={scrollToTurfs}>
          BROWSE TURFS ↓
        </button>
      </div>

      {}
      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-num">3+</div>
          <div className="stat-label">Premium Turfs</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">6</div>
          <div className="stat-label">Sports</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">4.8★</div>
          <div className="stat-label">Top Rating</div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

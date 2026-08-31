
import { Link } from "react-router-dom";
import { FaArrowRight, FaBagShopping, FaBrain, FaCalendarCheck, FaHeart, FaPaw, FaShieldHeart, FaStethoscope, FaStar, FaUserDoctor, FaWandMagicSparkles } from "react-icons/fa6";
import { GiDogHouse, GiScissors } from "react-icons/gi";
import "./HomePage.css";

const services = [
  { icon: FaBagShopping, title: "Pet Shop", text: "Food, toys, essentials, and thoughtful treats for every kind of pet.", link: "/products", action: "Explore shop", tone: "coral" },
  { icon: FaPaw, title: "My Pets", text: "Keep your pet profiles, health records, and care details together.", link: "/pets", action: "Manage pets", tone: "mint" },
  { icon: FaStethoscope, title: "Veterinary Care", text: "Find the care your companion needs and book appointments easily.", link: "/vet-booking", action: "Book a visit", tone: "blue" },
  { icon: GiScissors, title: "Grooming", text: "Freshen up with professional grooming appointments for your pet.", link: "/grooming", action: "Book grooming", tone: "yellow" },
  { icon: GiDogHouse, title: "Pet Boarding", text: "A comfortable, caring stay while you are away from home.", link: "/boarding", action: "Find a stay", tone: "lavender" },
  { icon: FaBrain, title: "AI Assistant", text: "Get quick, friendly guidance for everyday pet care questions.", link: "/ai-assistant", action: "Ask the assistant", tone: "peach" },
];

function HomePage() {
  return (
    <div className="home-page">

      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow"><FaHeart /> Care made for every companion</span>
              <h1>Everything your pet needs, all in one happy place.</h1>
              <p className="hero-copy">From everyday essentials to expert care, PetCare Hub makes life with dogs, cats, birds, and every beloved companion feel simpler.</p>
              <div className="hero-actions">
                <Link to="/products" className="home-button home-button-primary">Explore pet care <FaArrowRight /></Link>
                <Link to="/pets" className="home-button home-button-secondary">Manage my pets</Link>
              </div>
              <div className="hero-proof"><span><FaStar /> <strong>4.9/5</strong> from pet parents</span><span><FaShieldHeart /> Care you can trust</span></div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image-wrap">
                <img src="/petcare-hero.png" alt="A dog, cat, and bird together at home" className="hero-image" />
                <div className="hero-floating-card floating-top"><FaPaw /> <span><strong>All kinds of pets</strong><small>Dogs, cats, birds & more</small></span></div>
                <div className="hero-floating-card floating-bottom"><FaCalendarCheck /> <span><strong>Care on your schedule</strong><small>Easy appointments & bookings</small></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container"><div className="trust-grid">
          <div><FaShieldHeart /><span><strong>Trusted care</strong><small>Designed around pet wellbeing</small></span></div>
          <div><FaUserDoctor /><span><strong>Expert services</strong><small>Easy access to pet care</small></span></div>
          <div><FaHeart /><span><strong>Made for pet parents</strong><small>Everything in one place</small></span></div>
        </div></div>
      </section>

      <section className="home-section services-section">
        <div className="container">
          <div className="section-heading text-center"><span className="eyebrow">A little help for every need</span><h2>Care that keeps tails wagging.</h2><p>Simple tools and helpful services for every stage of your pet's life.</p></div>
          <div className="row g-4">
            {services.map(({ icon: Icon, title, text, link, action, tone }) => <div className="col-md-6 col-xl-4" key={title}><article className="service-card"><div className={`service-icon ${tone}`}><Icon /></div><h3>{title}</h3><p>{text}</p><Link to={link} className="service-link">{action} <FaArrowRight /></Link></article></div>)}
          </div>
        </div>
      </section>

      <section className="home-section about-section">
        <div className="container"><div className="row align-items-center g-5">
          <div className="col-lg-6 order-lg-2"><div className="about-copy"><span className="eyebrow">More than a pet platform</span><h2>Built for the everyday moments that matter most.</h2><p>Whether you are welcoming a new pet or caring for an old friend, PetCare Hub brings the things you need closer together.</p><ul><li><FaHeart /> A thoughtful home for your pet's care</li><li><FaCalendarCheck /> Book and organise care in a few clicks</li><li><FaWandMagicSparkles /> Friendly support whenever you need it</li></ul><Link to="/register" className="home-button home-button-primary">Join PetCare Hub <FaArrowRight /></Link></div></div>
          <div className="col-lg-6 order-lg-1"><div className="about-collage"><img src="/petcare-about.png" alt="A dog, cat, and bird enjoying a sunny pet-friendly space" className="about-photo about-photo-main" /><img src="/petcare-hero.png" alt="A happy dog and cat" className="about-photo about-photo-small" /><div className="about-badge"><FaHeart /><strong>Happy pets</strong><span>start with loving care</span></div></div></div>
        </div></div>
      </section>

      <section className="stats-section"><div className="container"><div className="row text-center g-4"><div className="col-6 col-lg-3"><strong>6</strong><span>Care services</span></div><div className="col-6 col-lg-3"><strong>24/7</strong><span>Helpful AI support</span></div><div className="col-6 col-lg-3"><strong>100%</strong><span>Made for pet parents</span></div><div className="col-6 col-lg-3"><strong>1</strong><span>Happy place for all pets</span></div></div></div></section>

      <section className="home-section"><div className="container"><div className="cta-panel"><div><span className="eyebrow eyebrow-light">Your pet's next happy day starts here</span><h2>Give your companion the care they deserve.</h2><p>Start exploring pet products, services, and support today.</p></div><Link to="/register" className="home-button home-button-light">Create a free account <FaArrowRight /></Link></div></div></section>
    </div>
  );
}

export default HomePage;

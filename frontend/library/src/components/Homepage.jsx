import Header from "./Header/Header";
import Carousels from "./Carousels";
import CheckSearch from "./CheckSearch";
import Cards from "./Cards";
import CheckSec from "./CheckSec";
import CheckCard from "./CheckCard";
import CheckCounter from "./CheckCounter";
import Footer from "./Footer";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons CSS

export default function Homepage() {
  return (
    <div>
      <Header />
      <Carousels />
      <CheckSearch />
      <Cards />
      <CheckCard />
      <CheckSec />
      <CheckCounter />
      <Footer />

      <a
        href="https://wa.me/+923109985164?text=Hello%20Sir%20I%20have%20a%20question"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact via WhatsApp"
      >
        <i className="bi bi-whatsapp"></i>
      </a>
    </div>
  );
}

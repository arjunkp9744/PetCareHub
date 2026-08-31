import {
  Container,
  Nav,
  Navbar as BootstrapNavbar,
  NavDropdown,
} from "react-bootstrap";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  navigate("/login");
  };


  const isServiceActive = [
    "/vet-booking",
    "/appointments",
    "/grooming",
    "/grooming/bookings",
    "/boarding",
     "/boarding/bookings",
  ].includes(pathname);

  const isAccountActive = [
    "/profile",
    "/orders",
    "/wishlist",
    "/login",
    "/register",
  ].includes(pathname);

  return (
    <BootstrapNavbar
      expand="lg"
      sticky="top"
      className="modern-navbar"
      data-bs-theme="dark"
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="modern-brand"
        >
          <span className="brand-icon">🐾</span>
          <span>
            Pet<span>Care</span> Hub
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="main-navbar"
          className="modern-toggle"
        />

        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center modern-nav">
            <Nav.Link
              as={Link}
              to="/"
              className={isActive("/") ? "active" : ""}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/products"
              className={isActive("/products") ? "active" : ""}
            >
              Shop
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/pets"
              className={isActive("/pets") ? "active" : ""}
            >
              My Pets
            </Nav.Link>

            <NavDropdown
              title="Services"
              id="services-dropdown"
              className={isServiceActive ? "active-dropdown" : ""}
              menuVariant="dark"
            >
              <NavDropdown.Item as={Link} to="/vet-booking">
                🩺 Veterinary
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/appointments">
                📅 My Appointments
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/grooming">
                ✂️ Grooming
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/grooming/bookings">
                🐶 Grooming Bookings
              </NavDropdown.Item>

              <NavDropdown.Item
                as={Link}
                to="/boarding"
              >
                🏠 Pet Boarding
              </NavDropdown.Item>

              <NavDropdown.Item
                as={Link}
                to="/boarding/bookings"
              >
                📋 Boarding Bookings
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/ai-assistant"
              className={`ai-link ${
                isActive("/ai-assistant") ? "active" : ""
              }`}
            >
              <span>🤖</span> AI Assistant
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/cart"
              className={`cart-link ${isActive("/cart") ? "active" : ""}`}
            >
              🛒 Cart
            </Nav.Link>

            <NavDropdown
              title="Account"
              id="account-dropdown"
              className={`account-dropdown ${
                isAccountActive ? "active-dropdown" : ""
              }`}
              menuVariant="dark"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                👤 Profile
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/orders">
                📦 My Orders
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/wishlist">
                ❤️ Wishlist
              </NavDropdown.Item>

              <NavDropdown.Divider />

             <NavDropdown.Item
                as={Link}
                to="/login"
              >
                🔑 Login
              </NavDropdown.Item>

              <NavDropdown.Item
                as={Link}
                to="/register"
              >
                📝 Create Account
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item
                onClick={handleLogout}
              >
                🚪 Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
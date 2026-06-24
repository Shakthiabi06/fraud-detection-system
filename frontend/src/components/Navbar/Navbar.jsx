import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Transactions", to: "/transactions" },
  { label: "Analytics", to: "/analytics" },
];

export default function Navbar() {
  // Placeholder state: there's no real notification feed yet (that depends
  // on Person 1's backend). Wiring this to actual state instead of always
  // rendering the red dot means the UI won't lie about having unread
  // alerts when it doesn't. Set this from real data once notifications exist.
  const [hasUnreadNotifications] = useState(false);

  return (
    <nav className="product-nav">
      <NavLink className="wordmark" to="/" aria-label="Fraud Risk Command home">
        Sentinel Ledger
      </NavLink>
      <div className="nav-tabs" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}
            to={item.to}
            end={item.to === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="nav-actions">
        <button className="notification-button" type="button" aria-label="Notifications">
          {hasUnreadNotifications && <span />}
        </button>
        <button className="profile-button" type="button">
          <span>SK</span>
          <strong>Shakthi</strong>
        </button>
      </div>
    </nav>
  );
}

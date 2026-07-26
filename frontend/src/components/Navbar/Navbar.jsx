import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getFraudSummary, USE_LIVE_API } from "../../services/api";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Transactions", to: "/transactions" },
  { label: "Analytics", to: "/analytics" },
];

export default function Navbar() {
  // In live mode, polls /fraud-summary every 30 seconds to check
  // alert_count — lights up the notification dot when there are active
  // alerts. In mock mode stays false (no real alerts to report).
  const [hasAlerts, setHasAlerts] = useState(false);

  useEffect(() => {
    if (!USE_LIVE_API) return;

    const checkAlerts = async () => {
      try {
        const summary = await getFraudSummary();
        setHasAlerts((summary.alertCount ?? 0) > 0);
      } catch {
        // Silently ignore — a failed poll shouldn't break the nav
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="product-nav">
      <NavLink className="wordmark" to="/" aria-label="Sentinel home">
        Sentinel
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
        <button
          className="notification-button"
          type="button"
          aria-label={hasAlerts ? "Active alerts" : "No alerts"}
        >
          {hasAlerts && <span />}
        </button>
        <button className="profile-button" type="button">
          <span>SK</span>
          <strong>Shakthi</strong>
        </button>
      </div>
    </nav>
  );
}

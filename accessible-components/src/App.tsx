import { useState } from "react";
import Modal from "./playground/Modal";
import Tabs from "./playground/Tabs";
import Disclosure from "./playground/Disclosure";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const demoTabs = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <div style={{ padding: "1rem 0" }}>
          <h3>Profile</h3>
          <p>
            This is the profile tab. You can add a user summary, avatar, and personal
            details here.
          </p>
        </div>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      content: (
        <div style={{ padding: "1rem 0" }}>
          <h3>Settings</h3>
          <p>
            This is the settings tab. You can include preferences, privacy controls, and
            account configurations here.
          </p>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <div style={{ padding: "1rem 0" }}>
          <h3>Notifications</h3>
          <p>
            This is the notifications tab. You can show updates, alerts, and message
            preferences here.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Demo Modal">
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <label>
            Name
            <input
              type="text"
              placeholder="Type here"
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>

          <button type="button" onClick={() => setIsOpen(false)}>
            Close
          </button>

          <a href="https://example.com" target="_blank" rel="noreferrer">
            Visit example
          </a>
        </div>
      </Modal>

      <div style={{ marginTop: "2rem" }}>
        <Tabs tabs={demoTabs} />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h3>Disclosure</h3>
        <Disclosure buttonLabel="More details">
          <p>
            This is some placeholder detail text inside the disclosure panel. It is
            revealed when the disclosure is expanded and hidden (using the hidden
            attribute) when collapsed.
          </p>
        </Disclosure>
      </div>
    </div>
  );
}

export default App;


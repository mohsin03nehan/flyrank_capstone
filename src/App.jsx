import { useState } from 'react';

const initialSettings = {
  displayName: 'Maya Chen',
  email: 'maya@flyrank.ai',
  language: 'English (US)',
  timezone: 'Pacific Time (UTC-8)',
  profileVisibility: 'Private',
  earlyAccess: true,
  desktopNotifications: true,
  weeklyDigest: false,
  securityAlerts: true,
  theme: 'Dark',
  autoSave: true,
  compactMode: false,
  readingMode: 'Focus',
};

const navItems = ['Profile', 'Notifications', 'Security', 'Appearance'];

function App() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-shell">
      <div className="settings-layout">
        <aside className="sidebar">
          <div className="brand-block">
            <div className="brand-mark">F</div>
            <div>
              <p className="eyebrow">Workspace</p>
              <h2>FlyRank</h2>
            </div>
          </div>

          <nav className="nav-list" aria-label="Settings navigation">
            {navItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 0 ? 'nav-item active' : 'nav-item'}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-card">
            <p className="eyebrow">Plan</p>
            <strong>Pro Team</strong>
            <span>12 seats active</span>
          </div>
        </aside>

        <main className="content-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Account settings</p>
              <h1>Personal preferences</h1>
            </div>
            <button type="button" className="ghost-button">
              View profile
            </button>
          </header>

          <form onSubmit={handleSave} className="settings-form">
            <section className="section-block">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Profile</p>
                  <h3>Identity details</h3>
                </div>
                <span className="status-pill">Synced</span>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>Display name</span>
                  <input
                    type="text"
                    value={settings.displayName}
                    onChange={(event) => updateSetting('displayName', event.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Email address</span>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(event) => updateSetting('email', event.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Language</span>
                  <select
                    value={settings.language}
                    onChange={(event) => updateSetting('language', event.target.value)}
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </label>

                <label className="field">
                  <span>Timezone</span>
                  <select
                    value={settings.timezone}
                    onChange={(event) => updateSetting('timezone', event.target.value)}
                  >
                    <option>Pacific Time (UTC-8)</option>
                    <option>Eastern Time (UTC-5)</option>
                    <option>Central European Time (UTC+1)</option>
                    <option>UTC</option>
                  </select>
                </label>

                <label className="field full-width">
                  <span>Profile visibility</span>
                  <div className="segmented-control">
                    {['Private', 'Team', 'Public'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={settings.profileVisibility === option ? 'segment active' : 'segment'}
                        onClick={() => updateSetting('profileVisibility', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </section>

            <section className="section-block">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Notifications</p>
                  <h3>Communication preferences</h3>
                </div>
              </div>

              <div className="switch-list">
                <div className="switch-row">
                  <div>
                    <strong>Early access features</strong>
                    <p>Receive new workflows before general rollout.</p>
                  </div>
                  <button
                    type="button"
                    className={settings.earlyAccess ? 'switch on' : 'switch'}
                    onClick={() => updateSetting('earlyAccess', !settings.earlyAccess)}
                    aria-label="Toggle early access features"
                  >
                    <span />
                  </button>
                </div>

                <div className="switch-row">
                  <div>
                    <strong>Desktop notifications</strong>
                    <p>Show push-style updates for mentions and tasks.</p>
                  </div>
                  <button
                    type="button"
                    className={settings.desktopNotifications ? 'switch on' : 'switch'}
                    onClick={() => updateSetting('desktopNotifications', !settings.desktopNotifications)}
                    aria-label="Toggle desktop notifications"
                  >
                    <span />
                  </button>
                </div>

                <div className="switch-row">
                  <div>
                    <strong>Weekly digest</strong>
                    <p>Summaries of your most important team activity.</p>
                  </div>
                  <button
                    type="button"
                    className={settings.weeklyDigest ? 'switch on' : 'switch'}
                    onClick={() => updateSetting('weeklyDigest', !settings.weeklyDigest)}
                    aria-label="Toggle weekly digest"
                  >
                    <span />
                  </button>
                </div>

                <div className="switch-row">
                  <div>
                    <strong>Security alerts</strong>
                    <p>Instant updates for sign-ins and policy changes.</p>
                  </div>
                  <button
                    type="button"
                    className={settings.securityAlerts ? 'switch on' : 'switch'}
                    onClick={() => updateSetting('securityAlerts', !settings.securityAlerts)}
                    aria-label="Toggle security alerts"
                  >
                    <span />
                  </button>
                </div>
              </div>
            </section>

            <section className="section-block">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Appearance</p>
                  <h3>Workspace style</h3>
                </div>
              </div>

              <div className="field-grid appearance-grid">
                <label className="field full-width">
                  <span>Theme</span>
                  <div className="segmented-control">
                    {['Light', 'Dark', 'System'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={settings.theme === option ? 'segment active' : 'segment'}
                        onClick={() => updateSetting('theme', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="field full-width">
                  <span>Reading mode</span>
                  <div className="segmented-control">
                    {['Focus', 'Comfort', 'Expanded'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={settings.readingMode === option ? 'segment active' : 'segment'}
                        onClick={() => updateSetting('readingMode', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>

                <div className="switch-row compact-row">
                  <div>
                    <strong>Auto-save drafts</strong>
                    <p>Keep your latest edits synced as you work.</p>
                  </div>
                  <button
                    type="button"
                    className={settings.autoSave ? 'switch on' : 'switch'}
                    onClick={() => updateSetting('autoSave', !settings.autoSave)}
                    aria-label="Toggle auto-save drafts"
                  >
                    <span />
                  </button>
                </div>

                <div className="switch-row compact-row">
                  <div>
                    <strong>Compact mode</strong>
                    <p>Use denser spacing to fit more on screen.</p>
                  </div>
                  <button
                    type="button"
                    className={settings.compactMode ? 'switch on' : 'switch'}
                    onClick={() => updateSetting('compactMode', !settings.compactMode)}
                    aria-label="Toggle compact mode"
                  >
                    <span />
                  </button>
                </div>
              </div>
            </section>

            <div className="form-footer">
              <button type="button" className="secondary-button">
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Save changes
              </button>
            </div>
            {saved && <p className="success-banner">Settings saved successfully.</p>}
          </form>
        </main>
      </div>
    </div>
  );
}

export default App;

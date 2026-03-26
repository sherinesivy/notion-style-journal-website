import { useState } from "react";
import { useJournal } from "../context/JournalContext";
import { presetThemes } from "../themes/themes";

function ThemeSwitcher() {
  const { currentTheme, setCurrentTheme, customThemes, saveCustomTheme, deleteCustomTheme } = useJournal();
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customColors, setCustomColors] = useState({
    bg: "#ffffff",
    sidebar: "#f7f7f5",
    text: "#37352f",
    muted: "#9b9a97",
    border: "#e9e9e7",
    accent: "#2eaadc",
  });

  // live preview — apply colors to CSS variables as user picks them
  const handleColorChange = (key, value) => {
    const updated = { ...customColors, [key]: value };
    setCustomColors(updated);

    // instantly apply to the page so user can see live changes
    const root = document.documentElement;
    root.style.setProperty(`--${key}`, value);
  };

  const handleSaveCustomTheme = () => {
    if (!customName.trim()) return;
    saveCustomTheme({ ...customColors, name: customName });
    setCustomName("");
    setShowCustomBuilder(false);
  };

  // if user cancels, revert back to current theme
  const handleCancel = () => {
    setShowCustomBuilder(false);
    const root = document.documentElement;
    root.style.setProperty("--bg", currentTheme.bg);
    root.style.setProperty("--sidebar", currentTheme.sidebar);
    root.style.setProperty("--text", currentTheme.text);
    root.style.setProperty("--muted", currentTheme.muted);
    root.style.setProperty("--border", currentTheme.border);
    root.style.setProperty("--accent", currentTheme.accent);
  };

  const colorLabels = {
    bg: "🖼️ background",
    sidebar: "📋 sidebar",
    text: "✏️ text",
    muted: "🩶 muted text",
    border: "📐 borders",
    accent: "✨ accent",
  };

  return (
    <div className="theme-switcher">
      <button className="theme-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        🎨 themes
      </button>

      {isOpen && (
        <div className="theme-panel">
          <p className="theme-panel-label">presets</p>

          <div className="theme-presets-grid">
            {Object.values(presetThemes).map((theme) => (
              <button
                key={theme.name}
                className={`theme-preset-btn ${currentTheme.name === theme.name ? "active" : ""}`}
                onClick={() => {
                  setCurrentTheme(theme);
                  setShowCustomBuilder(false);
                }}
                title={theme.name}
              >
                <span
                  className="theme-preview-circle"
                  style={{ background: theme.bg, border: `3px solid ${theme.accent}` }}
                />
                <span className="theme-preset-name">{theme.name}</span>
              </button>
            ))}
          </div>

          {customThemes.length > 0 && (
            <>
              <p className="theme-panel-label" style={{ marginTop: "14px" }}>your themes</p>
              <div className="theme-presets-grid">
                {customThemes.map((theme) => (
                  <div key={theme.id} className="custom-theme-item">
                    <button
                      className={`theme-preset-btn ${currentTheme.name === theme.name ? "active" : ""}`}
                      onClick={() => setCurrentTheme(theme)}
                      title={theme.name}
                    >
                      <span
                        className="theme-preview-circle"
                        style={{ background: theme.bg, border: `3px solid ${theme.accent}` }}
                      />
                      <span className="theme-preset-name">{theme.name}</span>
                    </button>
                    <button
                      className="delete-theme-btn"
                      onClick={() => deleteCustomTheme(theme.id)}
                    >✕</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {showCustomBuilder ? (
            <div className="custom-builder">
              <p className="theme-panel-label" style={{ marginTop: "14px" }}>
                🎨 build your theme
              </p>
              <input
                type="text"
                placeholder="give it a name..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="custom-theme-name-input"
              />
              <div className="color-pickers">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="color-picker-row">
                    <label>{colorLabels[key]}</label>
                    <div className="color-picker-right">
                      <span className="color-hex">{value}</span>
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="custom-builder-actions">
                <button className="save-theme-btn" onClick={handleSaveCustomTheme}>
                  save theme
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="new-theme-btn"
              onClick={() => setShowCustomBuilder(true)}
            >
              + create your own
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
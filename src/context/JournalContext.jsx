import { createContext, useContext, useState, useEffect } from "react";
import { presetThemes } from "../themes/themes";
import { v4 as uuidv4 } from "uuid";

const JournalContext = createContext();

export function JournalProvider({ children }) {
  // all journal entries
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("journal-entries");
    return saved ? JSON.parse(saved) : [];
  });

  // which entry is currently open
  const [activeId, setActiveId] = useState(null);

  // current theme object
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("journal-theme");
    return saved ? JSON.parse(saved) : presetThemes.light;
  });

  // user's saved custom themes
  const [customThemes, setCustomThemes] = useState(() => {
    const saved = localStorage.getItem("journal-custom-themes");
    return saved ? JSON.parse(saved) : [];
  });

  // search query
  const [searchQuery, setSearchQuery] = useState("");

  // save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("journal-entries", JSON.stringify(entries));
  }, [entries]);

  // save theme
  useEffect(() => {
    localStorage.setItem("journal-theme", JSON.stringify(currentTheme));
    // apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty("--bg", currentTheme.bg);
    root.style.setProperty("--sidebar", currentTheme.sidebar);
    root.style.setProperty("--text", currentTheme.text);
    root.style.setProperty("--muted", currentTheme.muted);
    root.style.setProperty("--border", currentTheme.border);
    root.style.setProperty("--accent", currentTheme.accent);
  }, [currentTheme]);

  // save custom themes
  useEffect(() => {
    localStorage.setItem("journal-custom-themes", JSON.stringify(customThemes));
  }, [customThemes]);

  // ADD a new entry
  const addEntry = () => {
    const newEntry = {
      id: uuidv4(),
      title: "Untitled",
      content: "",
      tags: [],
      coverImage: null,
      createdAt: new Date().toLocaleDateString(),
    };
    setEntries([newEntry, ...entries]);
    setActiveId(newEntry.id);
  };

  // UPDATE an entry
  const updateEntry = (id, changes) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, ...changes } : e)));
  };

  // DELETE an entry
  const deleteEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
    setActiveId(null);
  };

  // SAVE a custom theme
  const saveCustomTheme = (theme) => {
    setCustomThemes([...customThemes, { ...theme, id: uuidv4() }]);
  };

  // DELETE a custom theme
  const deleteCustomTheme = (id) => {
    setCustomThemes(customThemes.filter((t) => t.id !== id));
  };

  const activeEntry = entries.find((e) => e.id === activeId);

  return (
    <JournalContext.Provider value={{
      entries, activeEntry, activeId, setActiveId,
      addEntry, updateEntry, deleteEntry,
      currentTheme, setCurrentTheme,
      customThemes, saveCustomTheme, deleteCustomTheme,
      searchQuery, setSearchQuery,
    }}>
      {children}
    </JournalContext.Provider>
  );
}

// custom hook so you don't have to type useContext(JournalContext) every time
export function useJournal() {
  return useContext(JournalContext);
}
import { useJournal } from "../context/JournalContext";
import ThemeSwitcher from "./ThemeSwitcher";

function Sidebar() {
  const {
    entries,
    activeId,
    setActiveId,
    addEntry,
    deleteEntry,
    searchQuery,
    setSearchQuery,
  } = useJournal();

  // filter entries based on search query
  const filteredEntries = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar">
      {/* app title */}
      <div className="sidebar-header">
        <h1 className="sidebar-title">📓 my journal</h1>
      </div>

      {/* search bar */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="🔍 search entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* new entry button */}
      <button className="new-entry-btn" onClick={addEntry}>
        + New Page
      </button>

      {/* entries list */}
      <div className="entries-list">
        {filteredEntries.length === 0 && (
          <p className="no-entries">no entries yet 🌸</p>
        )}
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className={`entry-item ${activeId === entry.id ? "active" : ""}`}
            onClick={() => setActiveId(entry.id)}
          >
            <div className="entry-item-title">
              {entry.title || "Untitled"}
            </div>
            <div className="entry-item-meta">
              <span className="entry-date">{entry.createdAt}</span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // prevents opening the entry when clicking delete
                  deleteEntry(entry.id);
                }}
              >
                ✕
              </button>
            </div>
            {/* show tags if any */}
            {entry.tags.length > 0 && (
              <div className="entry-tags">
                {entry.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
        ))}
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default Sidebar;
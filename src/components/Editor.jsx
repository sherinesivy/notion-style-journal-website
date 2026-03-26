import { useJournal } from "../context/JournalContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="toolbar">
      <button onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}><i>I</i></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "active" : ""}><s>S</s></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "active" : ""}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "active" : ""}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "active" : ""}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "active" : ""}>1. List</button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "active" : ""}>" "</button>
    </div>
  );
}

function Editor() {
  const { activeEntry, updateEntry } = useJournal();

  const editor = useEditor({
    extensions: [StarterKit],
    content: activeEntry?.content || "",
    onUpdate: ({ editor }) => {
      if (activeEntry) {
        updateEntry(activeEntry.id, { content: editor.getHTML() });
      }
    },
  }, [activeEntry?.id]); // reinitialize when entry changes

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateEntry(activeEntry.id, { coverImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const newTag = e.target.value.trim().toLowerCase();
      if (!activeEntry.tags.includes(newTag)) {
        updateEntry(activeEntry.id, {
          tags: [...activeEntry.tags, newTag],
        });
      }
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    updateEntry(activeEntry.id, {
      tags: activeEntry.tags.filter((t) => t !== tagToRemove),
    });
  };

  if (!activeEntry) {
    return (
      <div className="editor-empty">
        <p>select an entry or create a new one 🌸</p>
      </div>
    );
  }

  return (
    <div className="editor">
      {/* cover image */}
      <div className="cover-image-container">
        {activeEntry.coverImage ? (
          <div className="cover-image-wrapper">
            <img src={activeEntry.coverImage} alt="cover" className="cover-image" />
            <button
              className="remove-cover-btn"
              onClick={() => updateEntry(activeEntry.id, { coverImage: null })}
            >
              remove cover
            </button>
          </div>
        ) : (
          <label className="add-cover-btn">
            + add cover image
            <input type="file" accept="image/*" onChange={handleCoverImage} style={{ display: "none" }} />
          </label>
        )}
      </div>

      {/* title */}
      <input
        className="entry-title-input"
        type="text"
        placeholder="Untitled"
        value={activeEntry.title}
        onChange={(e) => updateEntry(activeEntry.id, { title: e.target.value })}
      />

      {/* tags */}
      <div className="tags-container">
        {activeEntry.tags.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
            <button onClick={() => removeTag(tag)}>✕</button>
          </span>
        ))}
        <input
          type="text"
          className="tag-input"
          placeholder="add tag + press enter"
          onKeyDown={handleTagKeyDown}
        />
      </div>

      {/* tiptap editor */}
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}

export default Editor;
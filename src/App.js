import { JournalProvider } from "./context/JournalContext";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import "./App.css";

function App() {
  return (
    <JournalProvider>
      <div className="app-layout">
        <Sidebar />
        <Editor />
      </div>
    </JournalProvider>
  );
}

export default App;

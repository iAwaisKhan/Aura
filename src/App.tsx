import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Notes from "./components/Notes";
import Tasks from "./components/Tasks";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Focus from "./components/Focus";
import Settings from "./components/Settings";
import SharedNoteView from "./components/SharedNoteView";
import SearchResults from "./components/SearchResults";
import { Avatar } from "./components/ui/Avatar";
import { CommandPalette } from "./components/ui/CommandPalette";
import { 
  Home, 
  StickyNote, 
  CheckSquare, 
  Clock, 
  Brain, 
  Settings as SettingsIcon, 
  Search, 
  User, 
  Sun, 
  Moon,
  GraduationCap,
  Command,
  Plus
} from "lucide-react";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState(() => {
    if (window.location.pathname.startsWith('/share/')) return "shared-note";
    return "dashboard";
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("aura-theme") === "dark" || 
           (!localStorage.getItem("aura-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const actions = [
    { id: "nv-dash", title: "Dashboard", icon: Home, category: "Navigation", perform: () => setActiveView("dashboard") },
    { id: "nv-notes", title: "Notes", icon: StickyNote, category: "Navigation", perform: () => setActiveView("notes") },
    { id: "nv-tasks", title: "Tasks", icon: CheckSquare, category: "Navigation", perform: () => setActiveView("tasks") },
    { id: "nv-focus", title: "Focus Mode", icon: Brain, category: "Navigation", perform: () => setActiveView("focus") },
    { id: "nv-settings", title: "Settings", icon: SettingsIcon, category: "Navigation", perform: () => setActiveView("settings") },
    { id: "theme-toggle", title: "Toggle appearance", icon: isDarkMode ? Sun : Moon, category: "Action", perform: () => setIsDarkMode(!isDarkMode) },
  ];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("aura-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (activeView === "shared-note") {
    return <SharedNoteView />;
  }

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "notes", icon: StickyNote, label: "Notes" },
    { id: "tasks", icon: CheckSquare, label: "Tasks" },
    { id: "focus", icon: Brain, label: "Focus Mode" },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text transition-colors duration-500">
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-border/10 flex flex-col bg-surface/40 backdrop-blur-xl z-20"
      >
        <div className="p-8 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          <button className="text-2xl font-display uppercase tracking-[0.2em] relative group">
            Aura
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeView === item.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "hover:bg-primary/5 text-text/70 hover:text-text"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeView === item.id ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={toggleTheme}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-surface/50 border border-border/10 hover:border-primary/30 transition-all duration-300"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-sm font-medium">{isDarkMode ? "Light" : "Dark"} Mode</span>
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-10 z-10">
          <motion.h2 
            key={activeView}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-display tracking-tight text-text capitalize"
          >
            {activeView}
          </motion.h2>
          
          <div className="flex items-center gap-6">
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView("profile")}
              className="cursor-pointer"
            >
              <Avatar size="md" fallback="AK" status="online" />
            </motion.div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-10 pb-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-6xl mx-auto space-y-10"
            >
              {activeView === "dashboard" ? (
                <Dashboard />
              ) : activeView === "notes" ? (
                <div className="h-[calc(100vh-12rem)]">
                  <Notes />
                </div>
              ) : activeView === "tasks" ? (
                <div className="h-[calc(100vh-12rem)]">
                  <Tasks />
                </div>
              ) : activeView === "profile" ? (
                <Profile />
              ) : activeView === "focus" ? (
                <Focus />
              ) : activeView === "settings" ? (
                <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              ) : (
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-primary/5 flex items-center justify-center mb-8">
                    <Brain className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-3xl font-display mb-4">Under Construction</h3>
                  <p className="text-lg text-text/60 max-w-sm font-medium leading-relaxed">
                    We're migrating the {activeView} module to the new React architecture.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
      
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/2 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-primary/3 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        actions={actions}
      />
    </div>
  );
};

export default App;

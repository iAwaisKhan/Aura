import React from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  StickyNote, 
  CheckSquare, 
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { storage } from "../js/storageManager";
import { Note } from "./Notes";
import { Task } from "./Tasks";
import { FocusSession } from "../types/focus";

const Dashboard: React.FC = () => {
  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      await storage.init();
      return await storage.getAll<Note>("notes");
    }
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      await storage.init();
      return await storage.getAll<Task>("tasks");
    }
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["focusSessions"],
    queryFn: async () => {
      await storage.init();
      return await storage.getAll<FocusSession>("focusSessions");
    }
  });

  const pendingTasks = tasks.filter(t => t.status === "To Do");
  const completedTasks = tasks.filter(t => t.status === "Done");

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const totalFocusSecondsToday = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const totalFocusHoursToday = (totalFocusSecondsToday / 3600).toFixed(1);

  // Focus Score and Insights
  const focusInsights = React.useMemo(() => {
    if (sessions.length === 0) return { score: 0, streak: 0, bestTime: "N/A" };

    // Group by hour
    const hourCounts: Record<number, number> = {};
    sessions.forEach(s => {
      hourCounts[s.hour] = (hourCounts[s.hour] || 0) + s.duration;
    });

    let bestHour = -1;
    let maxDuration = 0;
    Object.entries(hourCounts).forEach(([hour, duration]) => {
      if (duration > maxDuration) {
        maxDuration = duration;
        bestHour = parseInt(hour);
      }
    });

    const formatHour = (h: number) => {
      if (h === -1) return "N/A";
      const start = h % 12 || 12;
      const ampm = h < 12 ? "AM" : "PM";
      const end = (h + 1) % 12 || 12;
      const endAmpm = (h + 1) < 12 ? "AM" : "PM";
      return `${start}–${end} ${endAmpm}`;
    };

    // Calculate Streak
    const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === i || diffDays === i + 1) {
        streak++;
      } else {
        break;
      }
    }

    return { 
      score: Math.min(100, Math.floor((totalFocusSecondsToday / 7200) * 100)), // 2 hours = 100%
      streak, 
      bestTime: formatHour(bestHour) 
    };
  }, [sessions, totalFocusSecondsToday]);

  if (notesLoading || tasksLoading || sessionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 p-10 rounded-4xl bg-linear-to-br from-primary/10 via-transparent to-transparent border border-primary/10 relative overflow-hidden group shadow-sm"
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-display mb-3 text-text">Good morning, Scholar</h1>
            <p className="text-lg text-text/70 leading-relaxed max-w-md font-medium">
              Ready to make today productive? You have <span className="text-primary">{pendingTasks.length} tasks</span> pending and <span className="text-primary">{notes.length} notes</span> archived.
              <br />
              <span className="text-sm mt-2 block opacity-60">Insight: You focus best between {focusInsights.bestTime}</span>
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-48 h-48" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-4xl bg-surface border border-border/10 flex flex-col justify-center items-center text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center mb-4 border border-secondary/10">
            <TrendingUp className="w-8 h-8 text-secondary" />
          </div>
          <span className="text-3xl font-display text-text">{focusInsights.streak} Days</span>
          <span className="text-[10px] text-text/50 font-bold tracking-[0.2em] uppercase mt-1">Deep-Focus Streak</span>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Time", value: `${totalFocusHoursToday}h`, icon: Clock, color: "text-blue-500" },
          { label: "Tasks Pending", value: pendingTasks.length, icon: CheckSquare, color: "text-primary" },
          { label: "Total Notes", value: notes.length, icon: StickyNote, color: "text-secondary" },
          { label: "Focus Score", value: `${focusInsights.score}%`, icon: TrendingUp, color: "text-purple-500" }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.2 }}
            className="p-6 rounded-3xl bg-surface/50 border border-border/10 hover:border-primary/20 transition-all cursor-pointer group hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text/50 group-hover:text-primary transition-colors">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="text-3xl font-display text-text">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text/50">Recent Notes</h3>
            <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid gap-3">
            {notes.slice(0, 3).map(note => (
              <div key={note.id} className="p-5 rounded-3xl bg-surface/50 border border-border/10 flex items-center gap-5 hover:bg-surface/80 transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary shadow-sm hover:shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-primary/10">
                  <StickyNote className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate text-text">{note.title || "Untitled Note"}</h4>
                  <p className="text-[10px] text-text/50 font-bold uppercase tracking-wider mt-1">Modified {new Date(note.lastModified).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {notes.length === 0 && <p className="text-sm text-text/40 italic p-6 bg-surface/20 rounded-3xl text-center font-medium border border-dashed border-border/20">No notes created yet</p>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text/50">Today's Tasks</h3>
            <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest">
              Open Board <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid gap-3">
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="p-5 rounded-3xl bg-surface/50 border border-border/10 flex items-center gap-5 hover:bg-surface/80 transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary shadow-sm hover:shadow-md">
                <div className="w-6 h-6 rounded-full border-2 border-primary/20 shrink-0 group-hover:border-primary transition-all flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate text-text">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${task.priority === "High" ? "bg-red-500/10 text-red-500" : "bg-primary/5 text-primary/70"}`}>{task.priority} Priority</span>
                    {task.dueDate && (
                      <span className="text-[9px] text-text/50 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && <p className="text-sm text-text/40 italic p-6 bg-surface/20 rounded-3xl text-center font-medium border border-dashed border-border/20">Clean slate! No pending tasks.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

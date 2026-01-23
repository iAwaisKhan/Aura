import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, Github, Chrome, UserPlus, ArrowRight, Loader2, CheckCircle2, User, Shield } from "lucide-react";
import { Avatar } from "./ui/Avatar";

const Profile: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup" | "account">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => {
        setMode("account");
        setIsSuccess(false);
    }, 2000);
  };

  const handleOAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setMode("account");
        setIsSuccess(false);
      }, 1500);
    }, 1000);
  };

  if (mode === "account") {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-surface/50 backdrop-blur-md border border-border/10 rounded-3xl shadow-sm overflow-hidden p-10 space-y-10"
        >
          <header className="flex items-center gap-6">
            <Avatar 
              size="lg" 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Awais" 
              fallback="AK" 
              status="online" 
            />
            <div>
              <h2 className="text-3xl font-display italic text-text">Awais Khan</h2>
              <p className="text-xs font-bold text-text/30 uppercase tracking-[0.2em] mt-1">Free Tier • Harmonic Soul</p>
            </div>
          </header>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-border/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-text/30" />
                <span className="text-sm font-medium">awais@aura.io</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Verified</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border/5 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-text/30 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">Security & Keys</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text/20" />
            </div>
          </div>

          <div className="pt-6 border-t border-border/5 flex flex-col gap-4">
            <button 
              onClick={() => setMode("login")}
              className="w-full h-11 border border-border/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-surface/50 backdrop-blur-md border border-border/10 rounded-3xl shadow-sm overflow-hidden p-8 space-y-8"
      >
        <header className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={mode + (isSuccess ? "-s" : "")}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-2xl font-display text-text italic"
            >
              {isSuccess ? "Identity Secured" : (mode === "login" ? "Welcome Back" : "New Journey")}
            </motion.h1>
          </AnimatePresence>
          <p className="text-xs text-text/40 font-medium tracking-wide">
            {mode === "login" ? "Enter your frequency to continue" : "Join the mindful network"}
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isSuccess ? (
            <>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {mode === "signup" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="Neural Name"
                        required
                        className="w-full h-11 bg-transparent border-b border-border/20 px-1 py-2 text-sm text-text placeholder:text-text/20 focus:outline-hidden focus:border-primary/50 transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="email"
                  placeholder="Email Resonance"
                  required
                  className="w-full h-11 bg-transparent border-b border-border/20 px-1 py-2 text-sm text-text placeholder:text-text/20 focus:outline-hidden focus:border-primary/50 transition-all"
                />

                <input
                  type="password"
                  placeholder="Security Cipher"
                  required
                  className="w-full h-11 bg-transparent border-b border-border/20 px-1 py-2 text-sm text-text placeholder:text-text/20 focus:outline-hidden focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-4">
                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="w-full h-12 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "login" ? "Authorize" : "Synchronize")}
                </button>
                
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center px-1"><div className="w-full border-t border-border/5"></div></div>
                  <span className="relative bg-surface px-4 text-[8px] font-black uppercase tracking-[0.3em] text-text/20">External Verification</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => handleOAuth("Google")}
                    disabled={isLoading}
                    className="h-11 rounded-xl border border-border/10 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Chrome className="w-4 h-4 text-text/30 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text/40 group-hover:text-text">Google</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleOAuth("GitHub")}
                    disabled={isLoading}
                    className="h-11 rounded-xl border border-border/10 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Github className="w-4 h-4 text-text/30 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text/40 group-hover:text-text">GitHub</span>
                  </button>
                </div>

                <div className="flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-text/30 pt-2">
                  <button onClick={toggleMode} type="button" className="hover:text-primary transition-colors">
                    {mode === "login" ? "No Identity? Create One" : "Existing Identity? Login"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto border border-primary/20">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-text">Access Granted</p>
                <p className="text-[10px] font-medium text-text/40">Syncing workspace resonance...</p>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;

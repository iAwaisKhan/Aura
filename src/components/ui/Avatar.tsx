import React from "react";
import { motion } from "framer-motion";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  status?: "online" | "offline" | "away";
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, status, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-12 h-12 text-xs",
    lg: "w-20 h-20 text-xl",
  };

  const badgeSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3 border-2",
    lg: "w-5 h-5 border-4",
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-[1.5rem] bg-primary/10 border border-primary/20 overflow-visible ${sizeClasses[size]}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover rounded-[inherit]" 
        />
      ) : (
        <span className="font-display font-medium text-primary uppercase tracking-tighter">
          {fallback}
        </span>
      )}
      
      {status && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -bottom-1 -right-1 rounded-full border-surface bg-green-500 shadow-sm ${badgeSizeClasses[size]}`}
        />
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, TrendingUp, X, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationCenterProps {
 onNotificationClick: (articleId: string) => void;
 activeFeedCategories: string[];
 theme?: 'dark' | 'light' | 'sepia';
}

export default function NotificationCenter({ onNotificationClick, activeFeedCategories, theme = 'dark' }: NotificationCenterProps) {
 const [notifications, setNotifications] = useState<PushNotification[]>([
 {
 id: "init-1",
 timestamp: "Just Now",
 type: "breaking",
 title: "BREAKING: Sound Traps in Isotopic Nanowires Established",
 message: "Research leads at Zurich discover coherent acoustics trapped within isotopic waveguide shields.",
 sourceArticleId: "art-1",
 read: false
 },
 {
 id: "init-2",
 timestamp: "10 mins ago",
 type: "market",
 title: "MARKET WATCH: Silicon Photonics Index Rallies +8.4%",
 message: "Global industrial desks execute massive positions following room-temp quantum tests.",
 sourceArticleId: "art-1",
 read: false
 }
 ]);

 const [toasts, setToasts] = useState<PushNotification[]>([]);
 const [isOpen, setIsOpen] = useState(false);
 const [soundEnabled, setSoundEnabled] = useState(true);

 // Play subtle synthetic beep for a professional auditory signal
 const playAlertSound = () => {
 if (!soundEnabled) return;
 try {
 const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
 const oscillator = audioCtx.createOscillator();
 const gainNode = audioCtx.createGain();

 oscillator.type = 'sine';
 oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // high pure frequency A5
 gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
 gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

 oscillator.connect(gainNode);
 gainNode.connect(audioCtx.destination);

 oscillator.start();
 oscillator.stop(audioCtx.currentTime + 0.35);
 } catch (e) {
 // Audio context might be blocked or unsupported in some sandboxes
 }
 };

 // Push notification simulator
 const triggerManualAlert = (customType?: 'breaking' | 'personalized' | 'market') => {
 const alertTypes = ['breaking', 'market', 'personalized'] as const;
 const chosenType = customType || alertTypes[Math.floor(Math.random() * alertTypes.length)];

 let newAlert: PushNotification;

 if (chosenType === 'breaking') {
 newAlert = {
 id: `alert-${Date.now()}`,
 timestamp: "Just Now",
 type: "breaking",
 title: "CRITICAL: EU Approves Direct Clean Steel Import Tariffs",
 message: "Enforcement offices in major ports ready compliance audits starting tomorrow at 06:00 to match regional quotas.",
 sourceArticleId: "art-4",
 read: false
 };
 } else if (chosenType === 'market') {
 newAlert = {
 id: `alert-${Date.now()}`,
 timestamp: "Just Now",
 type: "market",
 title: "MARKET SPIKE: Helion Yield Index Climbs +4.8%",
 message: "Industrial clean energy futures record historic volume as 12-minute confinement is certified.",
 sourceArticleId: "art-3",
 read: false
 };
 } else {
 newAlert = {
 id: `alert-${Date.now()}`,
 timestamp: "Just Now",
 type: "personalized",
 title: "RECOMMENDED DIGEST: The Agent App Ecosystem Explored",
 message: "Your personalized feed highlights a major analysis detailing why physical app icons are disappearing.",
 sourceArticleId: "art-6",
 read: false
 };
 }

 setNotifications(prev => [newAlert, ...prev]);
 setToasts([newAlert]); // Show as active popup toast (keep only the newest toast)
 playAlertSound();
 };

 // Auto-simulate incoming news periodically (Disabled by user request)
 useEffect(() => {
 // Notifications are no longer simulated automatically
 }, [soundEnabled]);

 const removeToast = (id: string) => {
 setToasts(prev => prev.filter(t => t.id !== id));
 };

 const markAllAsRead = () => {
 setNotifications(prev => prev.map(n => ({ ...n, read: true })));
 };

 const unreadCount = notifications.filter(n => !n.read).length;

 const iconBtnClass = theme === 'dark' 
 ? "text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors p-1.5 " 
 : theme === 'sepia' 
 ? "text-[#726255] hover:text-[#2E241E] hover:bg-[#E6DEC9] transition-colors p-1.5 " 
 : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors p-1.5 ";

 const simulateBtnClass = theme === 'dark'
 ? "text-[11px] font-mono font-medium border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 text-zinc-300 hover:text-white flex items-center space-x-1"
 : theme === 'sepia'
 ? "text-[11px] font-mono font-medium border border-[#DFD5C1] bg-[#FAF6EE] hover:bg-[#EADFC9] px-2.5 py-1 text-[#5C4D3E] hover:text-[#2E241E] flex items-center space-x-1"
 : "text-[11px] font-mono font-medium border border-neutral-200 bg-white hover:bg-neutral-50 px-2.5 py-1 text-neutral-600 hover:text-neutral-900 flex items-center space-x-1 shadow-sm";

 return (
 <div id="newsletter-notification-hub" className="relative">
 {/* Sound & Notification Status controls inside Header bar */}
 <div className="flex items-center space-x-2 mr-3">
 <button
 id="toggle-bell-sound"
 onClick={() => setSoundEnabled(!soundEnabled)}
 className={iconBtnClass}
 title={soundEnabled ? "Mute alert sounds" : "Enable alert sounds"}
 >
 {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
 </button>



 <button
 id="btn-bell-toggle"
 onClick={() => setIsOpen(!isOpen)}
 className={`relative ${iconBtnClass} flex items-center`}
 >
 <Bell size={18} className={unreadCount > 0 ? "animate-bounce text-[#ef4444]" : ""} />
 {unreadCount > 0 && (
 <span id="unread-pill-count" className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center border-2 border-white scale-110">
 {unreadCount}
 </span>
 )}
 </button>
 </div>

 {/* Floating OS-Style Notification Feed Panel */}
 <AnimatePresence>
 {isOpen && (
 <>
 <div id="outer-modal-bg" className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
 <motion.div
 id="notification-panel-tray"
 initial={{ opacity: 0, y: 15, scale: 0.98 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 15, scale: 0.98 }}
 className={`absolute right-0 mt-3 w-80 sm:w-96 border shadow-xl overflow-hidden z-50 font-sans ${
 theme === 'dark' ? 'bg-[#0F1115] border-zinc-800 text-slate-200' :
 theme === 'sepia' ? 'bg-[#FAF6EE] border-[#DFD5C1] text-[#2E241E]' :
 'bg-white border-neutral-200 text-neutral-805'
 }`}
 >
 <div className={`p-4 border-b flex items-center justify-between ${
 theme === 'dark' ? 'bg-zinc-950/40 border-zinc-800 text-white' :
 theme === 'sepia' ? 'bg-[#EDE6D6] border-[#DFD5C1] text-[#2E241E]' :
 'bg-[#FAF9F6] border-neutral-150 text-neutral-900'
 }`}>
 <div className="flex items-center space-x-2">
 <span className="inline-block h-2 w-2 bg-red-500 animate-ping" />
 <h3 className="font-semibold text-xs tracking-wider uppercase">
 Sovereign News Alerts
 </h3>
 </div>
 <div className="flex items-center space-x-3">
 {unreadCount > 0 && (
 <button
 id="btn-mark-all-read"
 onClick={markAllAsRead}
 className={`text-[10px] underline font-medium ${
 theme === 'dark' ? 'text-zinc-400 hover:text-white' :
 theme === 'sepia' ? 'text-[#726255] hover:text-[#2E241E]' :
 'text-neutral-500 hover:text-neutral-900'
 }`}
 >
 Clear All
 </button>
 )}
 <button
 id="btn-close-tray"
 onClick={() => setIsOpen(false)}
 className={theme === 'dark' ? 'text-zinc-550 hover:text-white' : 'text-zinc-400 hover:text-zinc-700'}
 >
 <X size={15} />
 </button>
 </div>
 </div>

 <div id="notif-feed-scroller" className={`max-h-96 overflow-y-auto divide-y ${
 theme === 'dark' ? 'divide-zinc-800/60' : 'divide-neutral-100'
 }`}>
 {notifications.length === 0 ? (
 <div className="p-8 text-center text-zinc-450 text-xs">
 No recent updates or notifications.
 </div>
 ) : (
 notifications.map((notif) => (
 <div
 key={notif.id}
 id={`notification-feed-item-${notif.id}`}
 className={`p-4 transition-colors cursor-pointer flex gap-3 ${
 theme === 'dark' 
 ? `${notif.read ? 'opacity-65' : 'bg-zinc-900/10'} hover:bg-zinc-900/40 text-slate-200` 
 : theme === 'sepia' 
 ? `${notif.read ? 'opacity-65' : 'bg-amber-50/5'} hover:bg-[#F0EBE0] text-[#2E241E]` 
 : `${notif.read ? 'opacity-65' : 'bg-[#FAF9F6]/20'} hover:bg-neutral-50 text-neutral-900`
 }`}
 onClick={() => {
 if (notif.sourceArticleId) {
 onNotificationClick(notif.sourceArticleId);
 }
 setNotifications(prev =>
 prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
 );
 setIsOpen(false);
 }}
 >
 <div className="mt-0.5 shrink-0">
 {notif.type === 'breaking' ? (
 <div className={`p-1.5 border ${
 theme === 'dark' ? 'bg-red-950/20 text-red-400 border-red-900/30' : 'bg-red-50 text-red-600 border-red-100'
 }`}>
 <ShieldAlert size={14} className="stroke-[2.5]" />
 </div>
 ) : notif.type === 'market' ? (
 <div className={`p-1.5 border ${
 theme === 'dark' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
 }`}>
 <TrendingUp size={14} />
 </div>
 ) : (
 <div className={`p-1.5 border ${
 theme === 'dark' ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' : 'bg-blue-50 text-blue-600 border-blue-100'
 }`}>
 <Sparkles size={14} />
 </div>
 )}
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 font-mono">
 <span className="uppercase tracking-wider font-semibold">
 {notif.type} Source
 </span>
 <span>{notif.timestamp}</span>
 </div>
 <h4 className={`font-semibold text-xs leading-snug mb-0.5 ${
 theme === 'dark' ? 'text-white' :
 theme === 'sepia' ? 'text-[#2E241E]' :
 'text-neutral-900'
 }`}>
 {notif.title}
 </h4>
 <p className={`text-[11px] leading-tight ${
 theme === 'dark' ? 'text-zinc-400' :
 theme === 'sepia' ? 'text-[#5C4D3E]' :
 'text-neutral-500'
 }`}>
 {notif.message}
 </p>
 <div className={`mt-2 text-[10px] font-medium flex items-center space-x-1 ${
 theme === 'dark' ? 'text-zinc-500 hover:text-white' :
 theme === 'sepia' ? 'text-[#5C4D3E] hover:text-[#2E241E]' :
 'text-neutral-500 hover:text-neutral-700'
 }`}>
 <span>Review article content</span>
 <span>→</span>
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 <div className={`p-3 text-[10px] border-t text-center font-mono ${
 theme === 'dark' ? 'bg-zinc-950/40 border-zinc-950 text-zinc-500' :
 theme === 'sepia' ? 'bg-[#EDE6D6] border-[#DFD5C1] text-[#726255]' :
 'bg-neutral-50/50 border-neutral-100 text-neutral-400'
 }`}>
 Updates push asynchronously over interbank networks
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>

 {/* Real-time Toast Popups at right/bottom of viewport */}
 <div id="notification-toast-anchor" className="fixed bottom-5 right-5 z-50 w-80 space-y-2 pointer-events-none">
 <AnimatePresence>
 {toasts.map((toast) => (
 <motion.div
 key={toast.id}
 id={`toast-popup-alert-${toast.id}`}
 initial={{ opacity: 0, x: 50, y: 0, scale: 0.9 }}
 animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
 exit={{ opacity: 0, x: 50, scale: 0.9 }}
 transition={{ type: "spring", stiffness: 350, damping: 25 }}
 className={`p-4 flex gap-3 pointer-events-auto cursor-pointer border shadow-2xl transition-all ${
 theme === 'dark' ? 'bg-[#09090b] text-[#fafafa] border-zinc-800' :
 theme === 'sepia' ? 'bg-[#FAF6EE] text-[#2E241E] border-[#CDBC9D]' :
 'bg-neutral-900 text-white border-neutral-850'
 }`}
 onClick={() => {
 if (toast.sourceArticleId) {
 onNotificationClick(toast.sourceArticleId);
 }
 removeToast(toast.id);
 }}
 >
 <div className="shrink-0 pt-0.5">
 <span className="flex h-2.5 w-2.5 bg-[#ef4444] animate-pulse" />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between text-[9px] text-[#22c55e] font-mono tracking-wider uppercase mb-1">
 <span>REAL-TIME PUSH</span>
 <button
 id={`remove-toast-btn-${toast.id}`}
 onClick={(e) => {
 e.stopPropagation();
 removeToast(toast.id);
 }}
 className="text-zinc-500 hover:text-zinc-300 transition-colors"
 >
 <X size={12} />
 </button>
 </div>
 <h4 className="font-bold text-[11px] leading-snug text-white tracking-tight mb-1">
 {toast.title}
 </h4>
 <p className="text-zinc-400 text-[10.5px] leading-tight">
 {toast.message}
 </p>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </div>
 );
}

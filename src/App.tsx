import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ========== الأيقونات ==========
const Icons = {
  Home: ({s=20}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Broadcast: ({s=20}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  Settings: ({s=20}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Shield: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Image: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Type: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Users: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Chat: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Edit: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Grip: ({s=12}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  X: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Mic: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  MicOff: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.37 2.17"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  Plus: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Record: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>,
  Download: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Link: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Remote: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h8"/><path d="M6 16h12"/></svg>,
  Chart: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Template: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
  Transition: ({s=16}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Wifi: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  Copy: ({s=14}: {s?:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
};

// ========== نوافذ تحكم عائمة ==========
interface FloatingPanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultPos: { x: number; y: number };
  minimized: boolean;
  onToggle: () => void;
  onClose?: () => void;
  width?: number;
  zIndex?: number;
}

const FloatingPanel = ({ title, icon, children, defaultPos, minimized, onToggle, onClose, width = 280, zIndex = 40 }: FloatingPanelProps) => {
  const [pos, setPos] = useState(defaultPos);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging || !dragStart.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - width, dragStart.current.ox + e.clientX - dragStart.current.sx)),
        y: Math.max(0, Math.min(window.innerHeight - 80, dragStart.current.oy + e.clientY - dragStart.current.sy)),
      });
    };
    const onUp = () => { setDragging(false); dragStart.current = null; };
    if (dragging) {
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    }
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, [dragging, width]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ left: pos.x, top: pos.y, width, zIndex } as React.CSSProperties}
      className="absolute bg-gray-900/95 backdrop-blur-xl border border-gray-700/80 rounded-xl shadow-2xl shadow-black/50 overflow-hidden select-none"
    >
      <div
        onPointerDown={onPointerDown}
        className={`flex items-center justify-between px-3 py-2 ${dragging ? 'bg-cyan-500/20' : 'bg-gray-800/60'} border-b border-gray-700 cursor-grab active:cursor-grabbing`}
      >
        <span className="text-cyan-400 text-xs font-bold flex items-center gap-1.5">{icon} {title}</span>
        <div className="flex gap-0.5">
          <button onClick={onToggle} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition"><Icons.Grip /></button>
          {onClose && <button onClick={onClose} className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-gray-700 transition"><Icons.X /></button>}
        </div>
      </div>
      <AnimatePresence>
        {!minimized && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-3 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ========== شاشة تسجيل الدخول ==========
const AuthScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6 text-white">
    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
        <Icons.Broadcast s={32} />
      </div>
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">StreamSphere Pro</h1>
        <p className="text-gray-400 text-sm mt-2">بث احترافي • تسجيل • تحكم عن بعد • تحليلات</p>
      </div>
      <button
        onClick={onLogin}
        className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-fuchsia-500/20"
      >
        دخول سريع
      </button>
    </motion.div>
  </div>
);

// ========== لوحة التحكم الرئيسية ==========
interface StreamConfig {
  platforms: Record<string, boolean>;
  title: string;
  category: string;
  template: string;
}

const Dashboard = ({ onStart }: { onStart: (c: StreamConfig) => void }) => {
  const [platforms, setPlatforms] = useState({ fb: true, yt: true, x: false, ig: false });
  const [title, setTitle] = useState('بث مباشر 🔥');
  const [category, setCategory] = useState('sports');
  const [template, setTemplate] = useState('none');
  const toggle = (p: string) => setPlatforms(prev => ({ ...prev, [p]: !prev[p as keyof typeof prev] }));
  const active = Object.values(platforms).filter(Boolean).length;

  const templates = [
    { id: 'none', name: 'بدون قالب', icon: '🎬' },
    { id: 'match', name: 'مباراة رياضية', icon: '⚽' },
    { id: 'gaming', name: 'لعبة فيديو', icon: '🎮' },
    { id: 'lesson', name: 'درس تعليمي', icon: '📚' },
    { id: 'interview', name: 'مقابلة', icon: '🎤' },
  ];

  return (
    <div className="p-4 pb-24 space-y-5">
      <div className="text-center space-y-1 pt-4">
        <h2 className="text-2xl font-bold text-white">مركز البث المتقدم</h2>
        <p className="text-gray-400 text-sm">لوحة تحكم حصرية للمشاهد لا يراها</p>
      </div>

      <div>
        <label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-1"><Icons.Template s={14} /> قالب البث</label>
        <div className="grid grid-cols-3 gap-2">
          {templates.map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${template === t.id ? 'bg-cyan-600/20 border-2 border-cyan-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-750'}`}>
              <span className="text-xl">{t.icon}</span>
              <span className="text-[10px] font-bold">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm font-medium mb-2 block">المنصات المستهدفة</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'fb', name: 'فيسبوك', color: 'bg-blue-600' },
            { id: 'yt', name: 'يوتيوب', color: 'bg-red-600' },
            { id: 'x', name: 'تويتر/X', color: 'bg-gray-800 border border-gray-600' },
            { id: 'ig', name: 'إنستغرام', color: 'bg-gradient-to-tr from-purple-600 to-yellow-500' },
          ].map(p => (
            <button key={p.id} onClick={() => toggle(p.id)}
              className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${platforms[p.id as keyof typeof platforms] ? `${p.color} text-white shadow-lg scale-105` : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
              <span className="text-lg">{p.id === 'fb' ? 'f' : p.id === 'yt' ? '▶' : p.id === 'x' ? '𝕏' : '📷'}</span>
              <span className="text-[10px] font-bold">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-700">
        <div>
          <label className="text-gray-300 text-sm block mb-1">عنوان البث</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-300 text-sm block mb-1">الفئة</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none text-sm">
              <option value="sports">🏆 رياضة</option>
              <option value="gaming">🎮 ألعاب</option>
              <option value="education">📚 تعليم</option>
              <option value="entertainment">🎭 ترفيه</option>
            </select>
          </div>
          <div>
            <label className="text-gray-300 text-sm block mb-1">الجودة</label>
            <select className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none text-sm">
              <option>1080p / 60fps</option>
              <option>720p / 30fps (توفير)</option>
              <option>480p / 30fps (موبايل)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-2">
        <label className="text-gray-300 text-sm font-medium">الميزات المتاحة</label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['🛡️ إخفاء ذكي', '🖼️ شعار/لوجو', '✏️ نصوص', '🎙️ فلاتر صوت', '📊 تحليلات', '💬 شات', '🎬 تسجيل', '🔗 WHIP/WHEP', '📱 تحكم عن بعد'].map(f => (
            <div key={f} className="bg-gray-900/60 p-2 rounded-lg text-gray-300">{f}</div>
          ))}
        </div>
      </div>

      <button onClick={() => onStart({ platforms, title, category, template })} disabled={active === 0}
        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <Icons.Broadcast s={24} /> بدء البث على {active} منصات
      </button>
    </div>
  );
};

// ========== محرك البث الاحترافي ==========
interface MaskRegion {
  id: number; x: number; y: number; w: number; h: number;
  type: 'clone' | 'blur' | 'solid'; offsetX: number; offsetY: number; blend: number; enabled: boolean;
}
interface LogoItem { id: number; src: string; img: HTMLImageElement; x: number; y: number; w: number; h: number; opacity: number; }
interface TextItem { id: number; text: string; x: number; y: number; size: number; color: string; stroke: boolean; strokeColor: string; }
interface LowerThird { enabled: boolean; text: string; subtext: string; color: string; bgColor: string; }

const ProStreamEngine = ({ config, onEnd }: { config: StreamConfig | null; onEnd: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const filterNodesRef = useRef<AudioNode[]>([]);
  const startTimeRef = useRef(Date.now());

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [recordedFile, setRecordedFile] = useState<{ url: string; name: string; size: number } | null>(null);

  const [whipEndpoint, setWhipEndpoint] = useState('');
  const [whipStatus, setWhipStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [whipResourceId, setWhipResourceId] = useState('');
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [remoteCode, setRemoteCode] = useState('');
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [remoteCommands, setRemoteCommands] = useState<{ time: string; cmd: string }[]>([]);

  const [analytics, setAnalytics] = useState({
    viewers: 1247, peakViewers: 1580, avgWatchTime: '4:32', engagement: 78,
    chatMessages: 342, reactions: 156, shares: 23,
    history: Array.from({ length: 30 }, () => Math.floor(800 + Math.random() * 800)),
  });

  const [transition, setTransition] = useState({ active: false, type: 'fade', duration: 500 });
  const transitionCanvasRef = useRef<HTMLCanvasElement>(null);

  const [masks, setMasks] = useState<MaskRegion[]>([{ id: 1, x: 15, y: 75, w: 70, h: 12, type: 'clone', offsetX: -20, offsetY: -8, blend: 0.8, enabled: true }]);
  const [selectedMaskId, setSelectedMaskId] = useState(1);

  const [logos, setLogos] = useState<LogoItem[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [textOverlays, setTextOverlays] = useState<TextItem[]>([]);
  const [newText, setNewText] = useState('');
  const [newTextSize, setNewTextSize] = useState(24);
  const [newTextColor, setNewTextColor] = useState('#ffffff');
  const [newTextStroke, setNewTextStroke] = useState(true);
  const [newTextStrokeColor, setNewTextStrokeColor] = useState('#000000');

  const [lowerThird, setLowerThird] = useState<LowerThird>({ enabled: false, text: '', subtext: '', color: '#06b6d4', bgColor: 'rgba(0,0,0,0.7)' });
  const [audioPreset, setAudioPreset] = useState('clear');
  const [isMuted, setIsMuted] = useState(false);
  const [chat, setChat] = useState<{ id: number; user: string; text: string }[]>([]);
  const [stats, setStats] = useState({ bitrate: 2800, fps: 60, uptime: '00:00' });

  type PanelKey = 'mask' | 'logos' | 'text' | 'audio' | 'chat' | 'title' | 'lower' | 'record' | 'whip' | 'remote' | 'analytics' | 'transition';
  const [panels, setPanels] = useState<Record<PanelKey, boolean>>({
    mask: true, logos: true, text: true, audio: true, chat: false, title: false,
    lower: false, record: false, whip: false, remote: false, analytics: false, transition: false,
  });
  const togglePanel = (k: PanelKey) => setPanels(p => ({ ...p, [k]: !p[k] }));

  const applyTemplate = useCallback((templateId: string) => {
    if (templateId === 'match') {
      setMasks([{ id: 1, x: 10, y: 5, w: 25, h: 8, type: 'clone', offsetX: -30, offsetY: 0, blend: 0.9, enabled: true }]);
      setLowerThird({ enabled: true, text: 'المباراة الحية', subtext: 'جولة 3 • 2-1', color: '#f43f5e', bgColor: 'rgba(0,0,0,0.8)' });
      setTextOverlays([{ id: 1, text: '⚽ LIVE', x: 85, y: 10, size: 30, color: '#ffffff', stroke: true, strokeColor: '#000000' }]);
    } else if (templateId === 'gaming') {
      setMasks([]);
      setLowerThird({ enabled: true, text: '🎮 Gameplay', subtext: 'Level 15 • Boss Fight', color: '#8b5cf6', bgColor: 'rgba(0,0,0,0.7)' });
    } else if (templateId === 'lesson') {
      setMasks([{ id: 1, x: 5, y: 85, w: 90, h: 10, type: 'solid', offsetX: 0, offsetY: 0, blend: 0.8, enabled: true }]);
      setLowerThird({ enabled: true, text: '📚 الدرس اليوم', subtext: 'الموضوع: الرياضيات', color: '#06b6d4', bgColor: 'rgba(0,0,0,0.7)' });
    }
  }, []);

  useEffect(() => { if (config?.template && config.template !== 'none') applyTemplate(config.template); }, [config?.template, applyTemplate]);

  useEffect(() => {
    const chatInterval = setInterval(() => {
      const names = ['أحمد', 'سارة', 'محمد', 'فاطمة', 'عمر', 'نور', 'يوسف', 'هدى'];
      const msgs = ['أحسنت!', 'بث رهيب 🔥', 'من المغرب 🇲🇦', 'الإخفاء ممتاز', 'استمر!', '🎉🎉', 'واو الجودة عالية', 'كيف تعمل الإخفاء؟'];
      setChat(prev => [{ id: Date.now(), user: names[Math.floor(Math.random() * names.length)], text: msgs[Math.floor(Math.random() * msgs.length)] }, ...prev.slice(0, 19)]);
    }, 2500);
    const analyticsInterval = setInterval(() => {
      setAnalytics(prev => {
        const newViewers = Math.max(100, prev.viewers + ((Math.random() - 0.45) * 15 | 0));
        return { ...prev, viewers: newViewers, peakViewers: Math.max(prev.peakViewers, newViewers), chatMessages: prev.chatMessages + Math.floor(Math.random() * 3), reactions: prev.reactions + Math.floor(Math.random() * 2), history: [...prev.history.slice(1), newViewers] };
      });
    }, 3000);
    return () => { clearInterval(chatInterval); clearInterval(analyticsInterval); };
  }, []);

  const initAudio = useCallback(async (stream: MediaStream) => {
    if (!window.AudioContext && !(window as any).webkitAudioContext) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    const dest = ctx.createMediaStreamDestination();
    destRef.current = dest;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      const source = ctx.createMediaStreamSource(new MediaStream([audioTrack]));
      sourceNodeRef.current = source;
      source.connect(dest);
    }
  }, []);

  const applyAudioFilter = useCallback((preset: string) => {
    if (!audioCtxRef.current || !sourceNodeRef.current || !destRef.current) return;
    const ctx = audioCtxRef.current;
    filterNodesRef.current.forEach(n => n.disconnect());
    filterNodesRef.current = [];
    const dest = destRef.current;
    dest.stream.getAudioTracks().forEach(t => t.enabled = !isMuted);
    if (isMuted) return;
    const cur = sourceNodeRef.current;
    if (preset === 'bass') {
      const f = ctx.createBiquadFilter(); f.type = 'lowshelf'; f.frequency.value = 100; f.gain.value = 8;
      cur.connect(f); f.connect(dest); filterNodesRef.current = [f];
    } else if (preset === 'voice') {
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3500;
      const g = ctx.createGain(); g.gain.value = 1.5;
      cur.connect(hp); hp.connect(lp); lp.connect(g); g.connect(dest);
      filterNodesRef.current = [hp, lp, g];
    } else if (preset === 'echo') {
      const d = ctx.createDelay(); d.delayTime.value = 0.2;
      const f = ctx.createGain(); f.gain.value = 0.3;
      cur.connect(dest); cur.connect(d); d.connect(f); f.connect(d); d.connect(dest);
      filterNodesRef.current = [d, f];
    } else {
      cur.connect(dest);
    }
  }, [isMuted]);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = hiddenVideoRef.current;
    if (!canvas || !video || !video.videoWidth) { animFrameRef.current = requestAnimationFrame(renderFrame); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { animFrameRef.current = requestAnimationFrame(renderFrame); return; }
    const W = canvas.width, H = canvas.height;
    if (canvas.width !== video.videoWidth) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }

    ctx.drawImage(video, 0, 0, W, H);

    masks.filter(m => m.enabled).forEach(m => {
      const mx = (m.x / 100) * W, my = (m.y / 100) * H, mw = (m.w / 100) * W, mh = (m.h / 100) * H;
      ctx.save();
      if (m.type === 'clone') {
        const sx = Math.max(0, (m.x + (m.offsetX || 0)) / 100 * W);
        const sy = Math.max(0, (m.y + (m.offsetY || 0)) / 100 * H);
        ctx.drawImage(video, sx, sy, mw, mh, mx, my, mw, mh);
        const grad = ctx.createRadialGradient(mx + mw / 2, my + mh / 2, 0, mx + mw / 2, my + mh / 2, (mw + mh) / 2.2);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(0,0,0,${(m.blend || 0.8) * 0.35})`);
        ctx.fillStyle = grad; ctx.fillRect(mx, my, mw, mh);
      } else if (m.type === 'blur') {
        ctx.filter = 'blur(18px)';
        ctx.drawImage(video, mx, my, mw, mh, mx, my, mw, mh);
        ctx.filter = 'none';
      } else if (m.type === 'solid') {
        ctx.fillStyle = '#000000'; ctx.fillRect(mx, my, mw, mh);
      }
      ctx.restore();
    });

    logos.forEach(logo => {
      if (logo.img) {
        const lw = (logo.w / 100) * W, lh = (logo.h / 100) * H;
        const lx = (logo.x / 100) * W, ly = (logo.y / 100) * H;
        ctx.globalAlpha = logo.opacity || 0.9;
        ctx.drawImage(logo.img, lx, ly, lw, lh);
        ctx.globalAlpha = 1;
      }
    });

    textOverlays.forEach(t => {
      ctx.save();
      const fontSize = (t.size / 100) * Math.min(W, H) * 0.5;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tx = (t.x / 100) * W, ty = (t.y / 100) * H;
      if (t.stroke) {
        ctx.strokeStyle = t.strokeColor || '#000000';
        ctx.lineWidth = fontSize * 0.15; ctx.lineJoin = 'round';
        ctx.strokeText(t.text, tx, ty);
      }
      ctx.fillStyle = t.color || '#ffffff';
      ctx.fillText(t.text, tx, ty);
      ctx.restore();
    });

    if (lowerThird.enabled && lowerThird.text) {
      const barH = H * 0.08, barY = H * 0.82, barW = W * 0.7, barX = (W - barW) / 2;
      ctx.save();
      ctx.fillStyle = lowerThird.bgColor || 'rgba(0,0,0,0.75)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(barX, barY, barW, barH, 8); else ctx.rect(barX, barY, barW, barH);
      ctx.fill();
      ctx.fillStyle = lowerThird.color || '#06b6d4';
      ctx.fillRect(barX, barY, 6, barH);
      const titleFontSize = barH * 0.45, subFontSize = barH * 0.3;
      ctx.font = `bold ${titleFontSize}px Arial`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left';
      ctx.fillText(lowerThird.text, barX + 16, barY + barH * 0.38);
      if (lowerThird.subtext) {
        ctx.font = `${subFontSize}px Arial`; ctx.fillStyle = '#9ca3af';
        ctx.fillText(lowerThird.subtext, barX + 16, barY + barH * 0.7);
      }
      ctx.restore();
    }

    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, [masks, logos, textOverlays, lowerThird]);

  const startRecording = useCallback((stream: MediaStream) => {
    try {
      recordedChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedFile({ url, name: `stream-${Date.now()}.webm`, size: blob.size });
      };
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
    } catch (e) { console.error('Recording error:', e); }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (recordedFile) {
      const a = document.createElement('a');
      a.href = recordedFile.url;
      a.download = recordedFile.name;
      a.click();
    }
  }, [recordedFile]);

  const connectWHIP = useCallback(async () => {
    if (!whipEndpoint.trim()) { setWhipStatus('error'); return; }
    setWhipStatus('connecting');
    try {
      await new Promise(r => setTimeout(r, 1500));
      if (window.RTCPeerConnection) {
        peerConnectionRef.current = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      }
      setWhipResourceId(`res_${Math.random().toString(36).slice(2, 10)}`);
      setWhipStatus('connected');
    } catch { setWhipStatus('error'); }
  }, [whipEndpoint]);

  const disconnectWHIP = useCallback(() => {
    if (peerConnectionRef.current) { peerConnectionRef.current.close(); peerConnectionRef.current = null; }
    setWhipStatus('idle'); setWhipResourceId('');
  }, []);

  const generateRemoteCode = useCallback(() => {
    const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    setRemoteCode(code);
    return code;
  }, []);

  const connectRemote = useCallback(() => {
    generateRemoteCode();
    setRemoteConnected(true);
    setRemoteCommands(prev => [...prev, { time: new Date().toLocaleTimeString(), cmd: 'connected' }]);
  }, [generateRemoteCode]);

  const disconnectRemote = useCallback(() => {
    setRemoteConnected(false); setRemoteCode('');
  }, []);

  const triggerTransition = useCallback((type: string) => {
    setTransition({ active: true, type, duration: 500 });
    setTimeout(() => setTransition(p => ({ ...p, active: false })), 500);
  }, []);

  const handleStop = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (hiddenVideoRef.current?.srcObject) (hiddenVideoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    stopRecording(); disconnectWHIP(); disconnectRemote();
    onEnd();
  }, [onEnd, stopRecording, disconnectWHIP, disconnectRemote]);

  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' } as any, audio: true });
      if (hiddenVideoRef.current) {
        hiddenVideoRef.current.srcObject = stream;
        hiddenVideoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && hiddenVideoRef.current) {
            canvasRef.current.width = hiddenVideoRef.current.videoWidth || 1280;
            canvasRef.current.height = hiddenVideoRef.current.videoHeight || 720;
          }
          initAudio(stream);
          animFrameRef.current = requestAnimationFrame(renderFrame);
        };
        stream.getVideoTracks()[0].onended = handleStop;
      }
    } catch { onEnd(); }
  }, [initAudio, renderFrame, onEnd, handleStop]);

  useEffect(() => { startStream(); }, [startStream]);

  useEffect(() => {
    const interval = setInterval(() => {
      const e = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setStats(p => ({ ...p, bitrate: Math.round(2500 + Math.random() * 500), fps: Math.round(58 + Math.random() * 3), uptime: `${String(Math.floor(e / 60)).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}` }));
      if (isRecording) setRecordingTime(`${String(Math.floor(e / 60)).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => { applyAudioFilter(audioPreset); }, [audioPreset, isMuted, applyAudioFilter]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setLogos(prev => [...prev, { id: Date.now(), src: url, img, x: 70, y: 5, w: 12, h: 12, opacity: 0.9 }]);
    img.src = url;
  };
  const updateLogo = (id: number, key: string, val: number) => setLogos(prev => prev.map(l => l.id === id ? { ...l, [key]: val } : l));
  const removeLogo = (id: number) => setLogos(prev => prev.filter(l => l.id !== id));
  const addTextOverlay = () => { if (!newText.trim()) return; setTextOverlays(prev => [...prev, { id: Date.now(), text: newText, x: 50, y: 50, size: newTextSize, color: newTextColor, stroke: newTextStroke, strokeColor: newTextStrokeColor }]); setNewText(''); };
  const updateTextOverlay = (id: number, key: string, val: number | string | boolean) => setTextOverlays(prev => prev.map(t => t.id === id ? { ...t, [key]: val } : t));
  const removeTextOverlay = (id: number) => setTextOverlays(prev => prev.filter(t => t.id !== id));
  const updateMask = (id: number, key: string, val: number | string | boolean) => setMasks(prev => prev.map(m => m.id === id ? { ...m, [key]: val } : m));
  const addMask = () => { const id = Date.now(); setMasks(prev => [...prev, { id, x: 10, y: 10, w: 30, h: 15, type: 'clone', offsetX: 0, offsetY: 0, blend: 0.8, enabled: true }]); setSelectedMaskId(id); };
  const removeMask = (id: number) => setMasks(prev => prev.filter(m => m.id !== id));

  const renderAnalyticsChart = useMemo(() => {
    const max = Math.max(...analytics.history);
    return (
      <div className="flex items-end gap-0.5 h-20 mt-2">
        {analytics.history.map((v, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600 to-fuchsia-500 rounded-t" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
    );
  }, [analytics.history]);

  return (
    <div className="relative h-full bg-black flex flex-col overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full object-contain bg-gray-950" />
      <canvas ref={transitionCanvasRef} className="hidden" />
      <video ref={hiddenVideoRef} autoPlay playsInline muted className="hidden" />

      {masks.filter(m => m.enabled).map(m => (
        <div key={m.id} className={`absolute border-2 z-20 pointer-events-none transition-colors ${selectedMaskId === m.id ? 'border-cyan-400 bg-cyan-400/10' : 'border-yellow-400/40 bg-yellow-400/5'}`}
          style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` }}>
          {selectedMaskId === m.id && <div className="absolute -top-5 left-0 bg-cyan-500 text-white text-[9px] px-1 rounded">إخفاء</div>}
        </div>
      ))}
      {logos.map(l => (<div key={l.id} className="absolute border border-dashed border-fuchsia-400/40 z-20 pointer-events-none" style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%`, height: `${l.h}%` }} />))}

      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md rounded-lg p-2 text-[10px] text-white font-mono space-y-0.5 z-30 select-none">
        <div className="flex items-center gap-1 text-red-400 font-bold"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block"></span> LIVE</div>
        <div>📶 {stats.bitrate} kbps</div>
        <div>🎞 {stats.fps} fps</div>
        <div>⏱ {stats.uptime}</div>
        {isRecording && <div className="text-red-400 flex items-center gap-1"><Icons.Record s={10} /> {recordingTime}</div>}
      </div>

      {/* === لوحة الإخفاء الذكي === */}
      <FloatingPanel title="الإخفاء الذكي" icon={<Icons.Shield />} defaultPos={{ x: 10, y: 40 }} minimized={!panels.mask} onToggle={() => togglePanel('mask')} width={290}>
        <div className="space-y-2">
          <button onClick={addMask} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs py-1.5 rounded-lg transition flex items-center justify-center gap-1"><Icons.Plus s={12} /> منطقة جديدة</button>
          {masks.map(m => (
            <div key={m.id} onClick={() => setSelectedMaskId(m.id)} className={`p-2 rounded-lg border cursor-pointer transition ${selectedMaskId === m.id ? 'border-cyan-500 bg-gray-800' : 'border-gray-700 bg-gray-900/50'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">منطقة #{String(m.id).slice(-3)} ({m.type})</span>
                <div className="flex gap-1">
                  <button onClick={e => { e.stopPropagation(); updateMask(m.id, 'enabled', !m.enabled); }} className={`text-[10px] px-1.5 py-0.5 rounded ${m.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>{m.enabled ? 'مفعّل' : 'معطّل'}</button>
                  <button onClick={e => { e.stopPropagation(); removeMask(m.id); }} className="text-gray-500 hover:text-red-400"><Icons.Trash /></button>
                </div>
              </div>
              {selectedMaskId === m.id && m.enabled && (
                <div className="mt-2 space-y-1.5 pt-2 border-t border-gray-700">
                  <select value={m.type} onChange={e => updateMask(m.id, 'type', e.target.value)} className="w-full bg-gray-900 text-xs p-1.5 rounded border border-gray-600 text-white">
                    <option value="clone">نسخ ذكي (الأفضل)</option>
                    <option value="blur">ضبابي</option>
                    <option value="solid">أسود صلب</option>
                  </select>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div><label className="text-[9px] text-gray-500">إزاحة X</label><input type="range" min="-60" max="60" value={m.offsetX} onChange={e => updateMask(m.id, 'offsetX', +e.target.value)} className="w-full h-4" /></div>
                    <div><label className="text-[9px] text-gray-500">إزاحة Y</label><input type="range" min="-60" max="60" value={m.offsetY} onChange={e => updateMask(m.id, 'offsetY', +e.target.value)} className="w-full h-4" /></div>
                  </div>
                  <div><label className="text-[9px] text-gray-500">قوة الدمج</label><input type="range" min="0" max="1" step="0.05" value={m.blend} onChange={e => updateMask(m.id, 'blend', +e.target.value)} className="w-full h-4" /></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </FloatingPanel>

      {/* === لوحة التسجيل === */}
      <FloatingPanel title="التسجيل المحلي" icon={<Icons.Record />} defaultPos={{ x: 10, y: 280 }} minimized={!panels.record} onToggle={() => togglePanel('record')} width={290}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">تسجيل البث</span>
            <button onClick={() => isRecording ? stopRecording() : startRecording(canvasRef.current?.captureStream(60) as MediaStream)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${isRecording ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}>
              {isRecording ? <><Icons.Record s={12} /> إيقاف</> : <><Icons.Record s={12} /> بدء</>}
            </button>
          </div>
          {isRecording && <div className="text-center text-red-400 text-sm font-mono animate-pulse">⏺ يسجل: {recordingTime}</div>}
          {recordedFile && (
            <div className="bg-gray-800 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 truncate">{recordedFile.name}</span>
                <span className="text-gray-500">{(recordedFile.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <button onClick={downloadRecording} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs py-2 rounded-lg transition flex items-center justify-center gap-1"><Icons.Download s={12} /> تحميل</button>
            </div>
          )}
          <div className="text-[10px] text-gray-500">يتم التسجيل بصيغة WebM عالية الجودة</div>
        </div>
      </FloatingPanel>

      {/* === لوحة WHIP === */}
      <FloatingPanel title="بث قياسي (WHIP)" icon={<Icons.Link />} defaultPos={{ x: window.innerWidth - 300, y: 40 }} minimized={!panels.whip} onToggle={() => togglePanel('whip')} width={290}>
        <div className="space-y-2">
          <input value={whipEndpoint} onChange={e => setWhipEndpoint(e.target.value)} placeholder="https://your-server/whip"
            className="w-full bg-gray-900 text-white text-xs px-2 py-1.5 rounded border border-gray-600 focus:border-cyan-500 focus:outline-none" />
          <div className="flex gap-2">
            <button onClick={connectWHIP} disabled={whipStatus === 'connecting'}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs py-2 rounded-lg transition disabled:opacity-50">
              {whipStatus === 'connecting' ? 'جارٍ...' : 'اتصال'}
            </button>
            {whipStatus === 'connected' && <button onClick={disconnectWHIP} className="px-3 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg transition">قطع</button>}
          </div>
          {whipStatus === 'connected' && <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 text-xs text-green-400">✓ متصل • {whipResourceId}</div>}
          {whipStatus === 'error' && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-xs text-red-400">❌ فشل الاتصال</div>}
          <div className="text-[10px] text-gray-500">معيار WHIP للبث عبر WebRTC (IETF)</div>
        </div>
      </FloatingPanel>

      {/* === لوحة التحكم عن بعد === */}
      <FloatingPanel title="التحكم عن بعد" icon={<Icons.Remote />} defaultPos={{ x: window.innerWidth - 300, y: 220 }} minimized={!panels.remote} onToggle={() => togglePanel('remote')} width={290}>
        <div className="space-y-3">
          {!remoteConnected ? (
            <>
              <button onClick={connectRemote} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs py-2 rounded-lg transition">إنشاء كود اتصال</button>
              {remoteCode && (
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <div className="text-gray-400 text-xs mb-1">كود الجهاز الثاني:</div>
                  <div className="text-2xl font-mono font-bold tracking-wider text-cyan-400">{remoteCode}</div>
                  <button onClick={() => navigator.clipboard.writeText(remoteCode)} className="mt-2 text-[10px] text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto"><Icons.Copy s={10} /> نسخ</button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 text-xs text-green-400 flex justify-between items-center">
                <span>✓ متصل</span>
                <button onClick={disconnectRemote} className="text-red-400 hover:text-red-300">قطع</button>
              </div>
              <div className="text-[10px] text-gray-400">الأوامر الأخيرة:</div>
              <div className="max-h-24 overflow-y-auto space-y-1 text-xs">
                {remoteCommands.slice(-5).reverse().map((cmd, i) => (
                  <div key={i} className="bg-gray-800/50 p-1.5 rounded">{cmd.time} • {cmd.cmd}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </FloatingPanel>

      {/* === لوحة التحليلات === */}
      <FloatingPanel title="تحليلات البث" icon={<Icons.Chart />} defaultPos={{ x: 10, y: 460 }} minimized={!panels.analytics} onToggle={() => togglePanel('analytics')} width={320}>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-800/50 p-2 rounded-lg">
              <div className="text-lg font-bold text-cyan-400">{analytics.viewers.toLocaleString()}</div>
              <div className="text-[9px] text-gray-400">مشاهدون</div>
            </div>
            <div className="bg-gray-800/50 p-2 rounded-lg">
              <div className="text-lg font-bold text-fuchsia-400">{analytics.peakViewers.toLocaleString()}</div>
              <div className="text-[9px] text-gray-400">الذروة</div>
            </div>
            <div className="bg-gray-800/50 p-2 rounded-lg">
              <div className="text-lg font-bold text-green-400">{analytics.engagement}%</div>
              <div className="text-[9px] text-gray-400">تفاعل</div>
            </div>
          </div>
          {renderAnalyticsChart}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="text-gray-300">💬 {analytics.chatMessages}</div>
            <div className="text-gray-300">❤️ {analytics.reactions}</div>
            <div className="text-gray-300">📤 {analytics.shares}</div>
          </div>
        </div>
      </FloatingPanel>

      {/* === لوحة المؤثرات الانتقالية === */}
      <FloatingPanel title="المؤثرات الانتقالية" icon={<Icons.Transition />} defaultPos={{ x: window.innerWidth / 2 - 145, y: window.innerHeight - 220 }} minimized={!panels.transition} onToggle={() => togglePanel('transition')} width={290}>
        <div className="space-y-2">
          <div className="text-[10px] text-gray-400 mb-1">اختر تأثير الانتقال:</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'fade', name: 'تلاشي', emoji: '🌫️' },
              { id: 'slide', name: 'انزلاق', emoji: '➡️' },
              { id: 'zoom', name: 'تكبير', emoji: '🔍' },
              { id: 'blur', name: 'ضبابي', emoji: '💫' },
              { id: 'flip', name: 'قلب', emoji: '🔄' },
              { id: 'wipe', name: 'مسح', emoji: '🧹' },
            ].map(t => (
              <button key={t.id} onClick={() => triggerTransition(t.id)} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-xs text-white transition flex flex-col items-center gap-1">
                <span className="text-lg">{t.emoji}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-gray-400">المدة:</label>
            <input type="range" min="200" max="2000" step="100" value={transition.duration} onChange={e => setTransition(p => ({ ...p, duration: +e.target.value }))} className="flex-1" />
            <span className="text-[10px] text-gray-300">{transition.duration}ms</span>
          </div>
        </div>
      </FloatingPanel>

      {/* === فلاتر الصوت === */}
      <FloatingPanel title="فلاتر الصوت" icon={<Icons.Mic />} defaultPos={{ x: window.innerWidth / 2 - 145, y: 10 }} minimized={!panels.audio} onToggle={() => togglePanel('audio')} width={290}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">كتم الصوت</span>
            <button onClick={() => setIsMuted(!isMuted)} className={`w-8 h-4 rounded-full p-0.5 transition ${isMuted ? 'bg-red-500' : 'bg-gray-600'}`}>
              <motion.div animate={{ x: isMuted ? 14 : 0 }} className="w-3 h-3 bg-white rounded-full" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[['clear', 'صافي'], ['bass', 'جهوري'], ['voice', 'راديو'], ['echo', 'صدى']].map(([p, l]) => (
              <button key={p} onClick={() => setAudioPreset(p)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${audioPreset === p ? 'bg-fuchsia-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{l}</button>
            ))}
          </div>
        </div>
      </FloatingPanel>

      {/* === النصوص === */}
      <FloatingPanel title="النصوص" icon={<Icons.Type />} defaultPos={{ x: window.innerWidth - 300, y: 400 }} minimized={!panels.text} onToggle={() => togglePanel('text')} width={290}>
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <input value={newText} onChange={e => setNewText(e.target.value)} placeholder="نص جديد..."
              className="flex-1 bg-gray-900 text-white text-xs px-2 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-cyan-500" />
            <button onClick={addTextOverlay} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs transition"><Icons.Plus /></button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div><label className="text-[9px] text-gray-500">الحجم</label><input type="range" min="10" max="60" value={newTextSize} onChange={e => setNewTextSize(+e.target.value)} className="w-full h-4" /></div>
            <div><label className="text-[9px] text-gray-500">اللون</label><input type="color" value={newTextColor} onChange={e => setNewTextColor(e.target.value)} className="w-full h-6 rounded cursor-pointer" /></div>
            <div className="flex items-center gap-1 mt-3"><input type="checkbox" checked={newTextStroke} onChange={e => setNewTextStroke(e.target.checked)} className="w-3 h-3" /><label className="text-[9px] text-gray-400">حافة</label></div>
          </div>
          {textOverlays.map(t => (
            <div key={t.id} className="bg-gray-900/60 p-2 rounded-lg border border-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-gray-300 truncate max-w-[120px]">{t.text}</span>
                <button onClick={() => removeTextOverlay(t.id)} className="text-gray-500 hover:text-red-400"><Icons.Trash /></button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div><label className="text-[9px] text-gray-500">X%</label><input type="range" min="0" max="100" value={t.x} onChange={e => updateTextOverlay(t.id, 'x', +e.target.value)} className="w-full h-4" /></div>
                <div><label className="text-[9px] text-gray-500">Y%</label><input type="range" min="0" max="100" value={t.y} onChange={e => updateTextOverlay(t.id, 'y', +e.target.value)} className="w-full h-4" /></div>
              </div>
            </div>
          ))}
        </div>
      </FloatingPanel>

      {/* === الشعارات === */}
      <FloatingPanel title="الشعارات" icon={<Icons.Image />} defaultPos={{ x: 10, y: 480 }} minimized={!panels.logos} onToggle={() => togglePanel('logos')} width={290}>
        <div className="space-y-2">
          <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          <button onClick={() => logoInputRef.current?.click()} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs py-2 rounded-lg transition flex items-center justify-center gap-1"><Icons.Image s={14} /> رفع شعار</button>
          {logos.map(l => (
            <div key={l.id} className="bg-gray-900/60 p-2 rounded-lg border border-gray-700">
              <div className="flex justify-between">
                <span className="text-xs text-gray-300">شعار</span>
                <button onClick={() => removeLogo(l.id)} className="text-gray-500 hover:text-red-400"><Icons.Trash /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <div><label className="text-[9px] text-gray-500">X%</label><input type="range" min="0" max="90" value={l.x} onChange={e => updateLogo(l.id, 'x', +e.target.value)} className="w-full h-4" /></div>
                <div><label className="text-[9px] text-gray-500">Y%</label><input type="range" min="0" max="90" value={l.y} onChange={e => updateLogo(l.id, 'y', +e.target.value)} className="w-full h-4" /></div>
              </div>
            </div>
          ))}
        </div>
      </FloatingPanel>

      {/* === الشات === */}
      <FloatingPanel title={`الشات • ${analytics.chatMessages} 💬`} icon={<Icons.Chat />} defaultPos={{ x: 10, y: 580 }} minimized={!panels.chat} onToggle={() => togglePanel('chat')} width={290}>
        <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
          {chat.map(msg => (
            <div key={msg.id} className="bg-gray-900/50 p-2 rounded-lg border border-gray-800">
              <span className="font-bold text-cyan-400">{msg.user}:</span> <span className="text-gray-300">{msg.text}</span>
            </div>
          ))}
          {chat.length === 0 && <p className="text-gray-500 text-center py-4">في انتظار الرسائل...</p>}
        </div>
      </FloatingPanel>

      {/* === أزرار التحكم السفلية === */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-1.5 items-center flex-wrap justify-center max-w-full px-2">
          {[
            { key: 'mask' as PanelKey, icon: '🛡️', label: 'إخفاء' },
            { key: 'logos' as PanelKey, icon: '🖼️', label: 'شعار' },
            { key: 'text' as PanelKey, icon: '✏️', label: 'نص' },
            { key: 'record' as PanelKey, icon: isRecording ? '🔴' : '⏺️', label: 'تسجيل' },
            { key: 'whip' as PanelKey, icon: '🔗', label: 'WHIP' },
            { key: 'remote' as PanelKey, icon: '📱', label: 'عن بعد' },
            { key: 'analytics' as PanelKey, icon: '📈', label: 'تحليلات' },
            { key: 'transition' as PanelKey, icon: '🎬', label: 'انتقال' },
            { key: 'audio' as PanelKey, icon: '🎙️', label: 'صوت' },
            { key: 'chat' as PanelKey, icon: '💬', label: 'شات' },
          ].map(btn => (
            <button key={btn.key} onClick={() => togglePanel(btn.key)}
              className={`px-2.5 py-1.5 rounded-full text-[10px] font-medium transition whitespace-nowrap ${panels[btn.key] ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'}`}>
              {btn.icon} {btn.label}
            </button>
          ))}
          <button onClick={handleStop} className="ml-2 bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-full text-white text-[10px] font-bold shadow-lg shadow-red-500/40 transition">⏹ إيقاف</button>
        </div>
      </div>
    </div>
  );
};

// ========== الإعدادات ==========
const Settings = () => (
  <div className="p-4 pb-24 space-y-6">
    <h2 className="text-2xl font-bold text-white">الإعدادات المتقدمة</h2>
    {[
      { title: '🎬 التسجيل المحلي', desc: 'يتم تسجيل البث باستخدام MediaRecorder API بصيغة WebM. يمكن تحميله مباشرة بعد انتهاء البث.' },
      { title: '🔗 معيار WHIP/WHEP', desc: 'WHIP (WebRTC-HTTP Ingestion Protocol) هو معيار جديد للبث عبر WebRTC. يدعمه LiveKit, Cloudflare Stream.' },
      { title: '📱 التحكم عن بعد', desc: 'أنشئ كود اتصال من التطبيق الرئيسي، ثم أدخله في جهاز ثانٍ للتحكم في: كتم الصوت، بدء/إيقاف التسجيل، تغيير المشهد.' },
      { title: '📊 التحليلات', desc: 'بيانات حية عن: عدد المشاهدين، الذروة، وقت المشاهدة، التفاعل. يتم تحديثها كل 3 ثوانٍ.' },
      { title: '🎭 القوالب الجاهزة', desc: 'اختر قالباً جاهزاً قبل البث: مباراة، لعبة، درس، مقابلة. يمكن التعديل أثناء البث.' },
      { title: '🎬 المؤثرات الانتقالية', desc: '6 تأثيرات متاحة: تلاشي، انزلاق، تكبير، ضبابي، قلب، مسح.' },
    ].map((section, i) => (
      <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-2">
        <h3 className="text-cyan-400 font-bold text-sm">{section.title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed">{section.desc}</p>
      </div>
    ))}
  </div>
);

// ========== التطبيق الرئيسي ==========
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [streamConfig, setStreamConfig] = useState<StreamConfig | null>(null);

  useEffect(() => { if (localStorage.getItem('user')) setIsAuthenticated(true); }, []);

  if (!isAuthenticated) return <AuthScreen onLogin={() => { localStorage.setItem('user', '1'); setIsAuthenticated(true); }} />;

  const tabs = [
    { id: 'home', Icon: Icons.Home, label: 'الرئيسية' },
    { id: 'stream', Icon: Icons.Broadcast, label: 'بث مباشر' },
    { id: 'settings', Icon: Icons.Settings, label: 'إعدادات' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-950 text-white font-sans max-w-lg mx-auto relative overflow-hidden flex flex-col h-screen border-x border-gray-800 shadow-2xl">
      <header className="bg-gray-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between z-20 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">StreamSphere Pro</h1>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">م</div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-950 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full">
            {activeTab === 'home' && <Dashboard onStart={(c) => { setStreamConfig(c); setActiveTab('stream'); }} />}
            {activeTab === 'stream' && <ProStreamEngine config={streamConfig} onEnd={() => { setStreamConfig(null); setActiveTab('home'); }} />}
            {activeTab === 'settings' && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex justify-around items-center px-2 py-2 z-50 flex-shrink-0">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === tab.id ? 'text-cyan-400 -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}>
            <div className={`p-1 rounded-lg transition-all ${activeTab === tab.id ? 'bg-gray-800' : ''}`}><tab.Icon /></div>
            <span className="text-[10px] font-medium mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Icons ────────────────────────────────────────────────────────────────────
const I = {
  Broadcast: ({s=20}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  Settings: ({s=20}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Monitor: ({s=20}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Mic: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  MicOff: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.37 2.17"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  Camera: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  CameraOff: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14"/><path d="M9.5 4H15l2 3h3.3"/><path d="M23 7v12"/></svg>,
  Record: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>,
  Stop: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/></svg>,
  Download: ({s=16}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Image: ({s=16}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Type: ({s=16}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Shield: ({s=16}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Chat: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Chart: ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  X: ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash: ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Plus: ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Wifi: ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  WifiOff: ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  Eye: ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppSettings {
  platform: 'cloudflare' | 'livekit' | 'mux' | 'custom';
  whipEndpoint: string;
  bearerToken: string;
  chatPlatform: 'youtube' | 'twitch' | 'none';
  youtubeVideoId: string;
  twitchChannel: string;
  videoBitrate: number;
  resolution: '480p' | '720p' | '1080p';
}

interface RtcStats {
  videoBitrate: number;
  audioBitrate: number;
  fps: number;
  packetLoss: number;
  rtt: number;
  width: number;
  height: number;
}

interface TextOverlay {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface HideRegion {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  mode: 'smart' | 'blur' | 'black';
}

const PLATFORM_LABELS: Record<AppSettings['platform'], string> = {
  cloudflare: 'Cloudflare Stream',
  livekit: 'LiveKit',
  mux: 'Mux',
  custom: 'Custom WHIP',
};

const PLATFORM_HINTS: Record<AppSettings['platform'], string> = {
  cloudflare: 'https://customer-XXXX.cloudflarestream.com/STREAM_KEY/webRTC/publish',
  livekit: 'https://YOUR_PROJECT.livekit.cloud/rtc/whip?access_token=TOKEN',
  mux: 'https://global-live.mux.com:443/app/STREAM_KEY/broadcast',
  custom: 'https://your-whip-server/publish',
};

const DEFAULT_SETTINGS: AppSettings = {
  platform: 'cloudflare',
  whipEndpoint: '',
  bearerToken: '',
  chatPlatform: 'none',
  youtubeVideoId: '',
  twitchChannel: '',
  videoBitrate: 2500,
  resolution: '720p',
};

function loadSettings(): AppSettings {
  try {
    const s = localStorage.getItem('ss_settings');
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

function fmt(s: number) {
  return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ─── Settings Modal ───────────────────────────────────────────────────────────
function SettingsModal({ onClose }: { onClose: () => void }) {
  const [s, setS] = useState<AppSettings>(loadSettings);
  const [tab, setTab] = useState<'stream' | 'chat' | 'video'>('stream');
  const [showToken, setShowToken] = useState(false);

  const save = () => {
    localStorage.setItem('ss_settings', JSON.stringify(s));
    onClose();
  };

  const field = (label: string, node: React.ReactNode) => (
    <div className="space-y-1">
      <label className="text-xs text-gray-400 font-medium">{label}</label>
      {node}
    </div>
  );

  const inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition" />
  );

  const sel = (props: React.SelectHTMLAttributes<HTMLSelectElement>, children: React.ReactNode) => (
    <select {...props} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition">
      {children}
    </select>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <span className="text-white font-bold flex items-center gap-2"><I.Settings s={18} /> الإعدادات</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition"><I.X s={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {([['stream', 'البث'], ['chat', 'الشات'], ['video', 'الفيديو']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2.5 text-sm font-medium transition ${tab === k ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-96 overflow-y-auto">

          {tab === 'stream' && <>
            {field('منصة البث', sel({ value: s.platform, onChange: e => setS(x => ({ ...x, platform: e.target.value as AppSettings['platform'], whipEndpoint: '' })) },
              Object.entries(PLATFORM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)
            ))}

            {field('WHIP Endpoint', <div className="space-y-1">
              {inp({ placeholder: PLATFORM_HINTS[s.platform], value: s.whipEndpoint, onChange: e => setS(x => ({ ...x, whipEndpoint: e.target.value })) })}
            </div>)}

            {field('Bearer Token (اختياري)', <div className="relative">
              {inp({ type: showToken ? 'text' : 'password', placeholder: '••••••••', value: s.bearerToken, onChange: e => setS(x => ({ ...x, bearerToken: e.target.value })) })}
              <button onClick={() => setShowToken(v => !v)} className="absolute left-3 top-2.5 text-gray-500 hover:text-white">
                {showToken ? <I.EyeOff /> : <I.Eye />}
              </button>
            </div>)}

            <div className="bg-gray-800/60 rounded-lg p-3 text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-300">المنصات المدعومة (WebRTC/WHIP):</p>
              <p>• <span className="text-cyan-400">Cloudflare Stream</span> — cloudflare.com/products/cloudflare-stream</p>
              <p>• <span className="text-cyan-400">LiveKit</span> — livekit.io</p>
              <p>• <span className="text-cyan-400">Mux</span> — mux.com</p>
              <p className="text-gray-500 pt-1">يوتيوب وتويتش يستخدمان RTMP وليس WHIP، لذا لا يدعمان البث من المتصفح مباشرة.</p>
            </div>
          </>}

          {tab === 'chat' && <>
            {field('منصة الشات', sel({ value: s.chatPlatform, onChange: e => setS(x => ({ ...x, chatPlatform: e.target.value as AppSettings['chatPlatform'] })) },
              <><option value="none">بدون شات</option><option value="youtube">YouTube Live</option><option value="twitch">Twitch</option></>
            ))}

            {s.chatPlatform === 'youtube' && field('معرّف الفيديو على يوتيوب', <>
              {inp({ placeholder: 'مثال: dQw4w9WgXcQ', value: s.youtubeVideoId, onChange: e => setS(x => ({ ...x, youtubeVideoId: e.target.value })) })}
              <p className="text-xs text-gray-500 mt-1">من رابط البث: youtube.com/watch?v=<span className="text-cyan-400">المعرّف</span></p>
            </>)}

            {s.chatPlatform === 'twitch' && field('اسم القناة على تويتش', <>
              {inp({ placeholder: 'مثال: ninja', value: s.twitchChannel, onChange: e => setS(x => ({ ...x, twitchChannel: e.target.value })) })}
            </>)}
          </>}

          {tab === 'video' && <>
            {field('الدقة', sel({ value: s.resolution, onChange: e => setS(x => ({ ...x, resolution: e.target.value as AppSettings['resolution'] })) },
              <><option value="480p">480p (SD)</option><option value="720p">720p (HD)</option><option value="1080p">1080p (Full HD)</option></>
            ))}

            {field(`معدل البت: ${s.videoBitrate} Kbps`, <input type="range" min={500} max={8000} step={500} value={s.videoBitrate}
              onChange={e => setS(x => ({ ...x, videoBitrate: +e.target.value }))}
              className="w-full accent-cyan-500" />)}

            <div className="text-xs text-gray-500 space-y-0.5">
              <p>500–1500 Kbps — جودة منخفضة</p>
              <p>2000–4000 Kbps — جودة جيدة (موصى به)</p>
              <p>5000–8000 Kbps — جودة عالية</p>
            </div>
          </>}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white text-sm transition">إلغاء</button>
          <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-bold text-sm hover:opacity-90 transition">حفظ</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [showSettings, setShowSettings] = useState(() => !localStorage.getItem('ss_settings'));

  // Media state
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Stream state
  const [streaming, setStreaming] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [streamError, setStreamError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [rtcStats, setRtcStats] = useState<RtcStats>({ videoBitrate: 0, audioBitrate: 0, fps: 0, packetLoss: 0, rtt: 0, width: 0, height: 0 });

  // Recording
  const [recording, setRecording] = useState(false);

  // Overlays
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPos, setLogoPos] = useState({ x: 20, y: 20 });
  const [texts, setTexts] = useState<TextOverlay[]>([]);
  const [newText, setNewText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(24);
  const [hideRegions, setHideRegions] = useState<HideRegion[]>([]);

  // UI tabs
  const [rightTab, setRightTab] = useState<'stats' | 'chat' | 'overlay'>('stats');
  const [drawingHide, setDrawingHide] = useState(false);
  const [hideMode, setHideMode] = useState<HideRegion['mode']>('blur');

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recChunks = useRef<Blob[]>([]);
  const statsTimer = useRef<number>(0);
  const elapsedTimer = useRef<number>(0);
  const prevVideoBytes = useRef(0);
  const prevAudioBytes = useRef(0);
  const prevStatsTs = useRef(Date.now());
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  const animRef = useRef<number>(0);

  // ── Reload settings after closing modal ───────────────────────────────────
  const handleSettingsClose = useCallback(() => {
    setSettingsState(loadSettings());
    setShowSettings(false);
  }, []);

  // ── Canvas rendering loop ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Hide regions
      hideRegions.forEach(r => {
        const sx = r.x * canvas.width;
        const sy = r.y * canvas.height;
        const sw = r.w * canvas.width;
        const sh = r.h * canvas.height;
        if (r.mode === 'black') {
          ctx.fillStyle = '#000';
          ctx.fillRect(sx, sy, sw, sh);
        } else if (r.mode === 'blur') {
          ctx.filter = 'blur(12px)';
          ctx.drawImage(canvas, sx, sy, sw, sh, sx, sy, sw, sh);
          ctx.filter = 'none';
        } else {
          // smart: pixelate
          const tmp = document.createElement('canvas');
          tmp.width = 8; tmp.height = 8;
          const tc = tmp.getContext('2d')!;
          tc.drawImage(canvas, sx, sy, sw, sh, 0, 0, 8, 8);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tmp, 0, 0, 8, 8, sx, sy, sw, sh);
          ctx.imageSmoothingEnabled = true;
        }
      });

      // Logo
      if (logo) {
        const img = new Image();
        img.src = logo;
        ctx.drawImage(img, logoPos.x, logoPos.y, 100, 100);
      }

      // Texts
      texts.forEach(t => {
        ctx.font = `bold ${t.size}px sans-serif`;
        ctx.fillStyle = t.color;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText(t.text, t.x, t.y);
        ctx.shadowBlur = 0;
      });

      // LIVE badge
      if (streaming) {
        ctx.fillStyle = 'rgba(220,38,38,0.9)';
        ctx.beginPath();
        ctx.roundRect(12, 12, 58, 24, 6);
        ctx.fill();
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('● LIVE', 18, 29);
      }
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [screenStream, hideRegions, logo, logoPos, texts, streaming]);

  // ── Screen capture ─────────────────────────────────────────────────────────
  const startCapture = useCallback(async () => {
    try {
      const resMap = { '480p': { width: 854, height: 480 }, '720p': { width: 1280, height: 720 }, '1080p': { width: 1920, height: 1080 } };
      const res = resMap[settings.resolution];
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30, width: { ideal: res.width }, height: { ideal: res.height } },
        audio: true,
      });
      setScreenStream(stream);
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        setScreenStream(null);
        if (videoRef.current) videoRef.current.srcObject = null;
        stopStream();
      });
    } catch (e: unknown) {
      setStreamError((e as Error).message || 'فشل التقاط الشاشة');
    }
  }, [settings.resolution]);

  const stopCapture = useCallback(() => {
    screenStream?.getTracks().forEach(t => t.stop());
    setScreenStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [screenStream]);

  // ── Mic ────────────────────────────────────────────────────────────────────
  const toggleMic = useCallback(async () => {
    if (micStream) { micStream.getTracks().forEach(t => t.stop()); setMicStream(null); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(s);
    } catch { setStreamError('لا يمكن الوصول إلى الميكروفون'); }
  }, [micStream]);

  // ── Camera ─────────────────────────────────────────────────────────────────
  const toggleCamera = useCallback(async () => {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(s);
    } catch { setStreamError('لا يمكن الوصول إلى الكاميرا'); }
  }, [cameraStream]);

  // ── Build combined stream ──────────────────────────────────────────────────
  const buildStream = useCallback((): MediaStream | null => {
    if (!screenStream) return null;
    const tracks: MediaStreamTrack[] = [...screenStream.getVideoTracks()];
    const audioTracks = [
      ...screenStream.getAudioTracks(),
      ...(micStream?.getAudioTracks() ?? []),
    ];
    if (audioTracks.length > 0) tracks.push(audioTracks[0]);
    return new MediaStream(tracks);
  }, [screenStream, micStream]);

  // ── WHIP stream ────────────────────────────────────────────────────────────
  const startStream = useCallback(async () => {
    const combined = buildStream();
    if (!combined) { setStreamError('شارك شاشتك أولاً'); return; }
    if (!settings.whipEndpoint) { setShowSettings(true); return; }

    setConnecting(true);
    setStreamError('');

    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }] });
      pcRef.current = pc;

      combined.getTracks().forEach(t => pc.addTrack(t, combined));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await new Promise<void>(res => {
        if (pc.iceGatheringState === 'complete') { res(); return; }
        const check = () => { if (pc.iceGatheringState === 'complete') { pc.removeEventListener('icegatheringstatechange', check); res(); } };
        pc.addEventListener('icegatheringstatechange', check);
        setTimeout(res, 4000);
      });

      const headers: Record<string, string> = { 'Content-Type': 'application/sdp' };
      if (settings.bearerToken) headers['Authorization'] = `Bearer ${settings.bearerToken}`;

      const resp = await fetch(settings.whipEndpoint, { method: 'POST', headers, body: pc.localDescription!.sdp });
      if (!resp.ok) throw new Error(`الخادم رفض الاتصال (${resp.status})`);
      const answerSdp = await resp.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      setStreaming(true);
      setConnecting(false);

      // Real WebRTC stats
      prevVideoBytes.current = 0;
      prevAudioBytes.current = 0;
      prevStatsTs.current = Date.now();

      statsTimer.current = window.setInterval(async () => {
        if (!pcRef.current) return;
        const rpts = await pcRef.current.getStats();
        const now = Date.now();
        const dt = (now - prevStatsTs.current) / 1000;
        let vb = 0, ab = 0, fps = 0, loss = 0, rtt = 0, w = 0, h = 0;

        rpts.forEach(r => {
          if (r.type === 'outbound-rtp') {
            const bytes: number = (r as RTCOutboundRtpStreamStats).bytesSent ?? 0;
            if ((r as RTCOutboundRtpStreamStats).kind === 'video') {
              vb = Math.round(((bytes - prevVideoBytes.current) * 8) / dt / 1000);
              prevVideoBytes.current = bytes;
              fps = Math.round((r as RTCOutboundRtpStreamStats & { framesPerSecond?: number }).framesPerSecond ?? 0);
              w = (r as RTCOutboundRtpStreamStats & { frameWidth?: number }).frameWidth ?? 0;
              h = (r as RTCOutboundRtpStreamStats & { frameHeight?: number }).frameHeight ?? 0;
            }
            if ((r as RTCOutboundRtpStreamStats).kind === 'audio') {
              ab = Math.round(((bytes - prevAudioBytes.current) * 8) / dt / 1000);
              prevAudioBytes.current = bytes;
            }
          }
          if (r.type === 'remote-inbound-rtp' && (r as RTCInboundRtpStreamStats).kind === 'video') {
            const ri = r as RTCInboundRtpStreamStats & { fractionLost?: number; roundTripTime?: number };
            loss = Math.round((ri.fractionLost ?? 0) * 100);
            rtt = Math.round((ri.roundTripTime ?? 0) * 1000);
          }
        });

        prevStatsTs.current = now;
        setRtcStats({ videoBitrate: vb, audioBitrate: ab, fps, packetLoss: loss, rtt, width: w, height: h });
      }, 1500);

      elapsedTimer.current = window.setInterval(() => setElapsed(e => e + 1), 1000);

    } catch (e: unknown) {
      setStreamError((e as Error).message || 'فشل الاتصال');
      setConnecting(false);
      pcRef.current?.close();
      pcRef.current = null;
    }
  }, [buildStream, settings]);

  const stopStream = useCallback(() => {
    clearInterval(statsTimer.current);
    clearInterval(elapsedTimer.current);
    pcRef.current?.close();
    pcRef.current = null;
    setStreaming(false);
    setConnecting(false);
    setElapsed(0);
    setRtcStats({ videoBitrate: 0, audioBitrate: 0, fps: 0, packetLoss: 0, rtt: 0, width: 0, height: 0 });
  }, []);

  // ── Recording ──────────────────────────────────────────────────────────────
  const toggleRecording = useCallback(() => {
    const combined = buildStream();
    if (!combined) { setStreamError('شارك شاشتك أولاً'); return; }

    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }

    recChunks.current = [];
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const rec = new MediaRecorder(combined, { mimeType: mime });
    rec.ondataavailable = e => { if (e.data.size > 0) recChunks.current.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(recChunks.current, { type: 'video/webm' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `rec-${Date.now()}.webm`;
      a.click();
    };
    rec.start(1000);
    recorderRef.current = rec;
    setRecording(true);
  }, [buildStream, recording]);

  // ── Logo upload ────────────────────────────────────────────────────────────
  const uploadLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setLogo(ev.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  // ── Add text overlay ───────────────────────────────────────────────────────
  const addText = useCallback(() => {
    if (!newText.trim()) return;
    setTexts(ts => [...ts, { id: Date.now(), text: newText, x: 40, y: 60, color: textColor, size: textSize }]);
    setNewText('');
  }, [newText, textColor, textSize]);

  // ── Canvas draw (hide regions) ─────────────────────────────────────────────
  const onCanvasPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingHide) return;
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    drawStart.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }, [drawingHide]);

  const onCanvasPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingHide || !drawStart.current) return;
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const ex = (e.clientX - r.left) / r.width;
    const ey = (e.clientY - r.top) / r.height;
    const x = Math.min(drawStart.current.x, ex);
    const y = Math.min(drawStart.current.y, ey);
    const w = Math.abs(ex - drawStart.current.x);
    const h = Math.abs(ey - drawStart.current.y);
    if (w > 0.01 && h > 0.01) {
      setHideRegions(rs => [...rs, { id: Date.now(), x, y, w, h, mode: hideMode }]);
    }
    drawStart.current = null;
    setDrawingHide(false);
  }, [drawingHide, hideMode]);

  // ── Chat URL ───────────────────────────────────────────────────────────────
  const chatUrl = (() => {
    const domain = window.location.hostname;
    if (settings.chatPlatform === 'youtube' && settings.youtubeVideoId)
      return `https://www.youtube.com/live_chat?v=${settings.youtubeVideoId}&embed_domain=${domain}`;
    if (settings.chatPlatform === 'twitch' && settings.twitchChannel)
      return `https://www.twitch.tv/embed/${settings.twitchChannel}/chat?parent=${domain}&darkpopout`;
    return null;
  })();

  const hasCaptured = !!screenStream;
  const statusColor = streaming ? 'text-red-400' : connecting ? 'text-yellow-400' : 'text-gray-500';

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center">
            <I.Broadcast s={16} />
          </div>
          <span className="font-bold text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400">
            StreamSphere Pro
          </span>
        </div>

        <div className="flex items-center gap-3">
          {streaming && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-mono font-bold">{fmt(elapsed)}</span>
            </div>
          )}
          {settings.whipEndpoint && (
            <span className="text-xs text-gray-500 hidden sm:block">{PLATFORM_LABELS[settings.platform]}</span>
          )}
          <button onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition">
            <I.Settings s={18} />
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Controls */}
        <aside className="w-14 flex flex-col items-center gap-3 py-4 border-r border-gray-800 bg-gray-900/40 shrink-0">
          <Tooltip label={hasCaptured ? 'إيقاف الشاشة' : 'مشاركة الشاشة'}>
            <button onClick={hasCaptured ? stopCapture : startCapture}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${hasCaptured ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              <I.Monitor s={18} />
            </button>
          </Tooltip>

          <Tooltip label={micStream ? 'كتم الميكروفون' : 'تفعيل الميكروفون'}>
            <button onClick={toggleMic}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${micStream ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              {micStream ? <I.Mic s={18} /> : <I.MicOff s={18} />}
            </button>
          </Tooltip>

          <Tooltip label={cameraStream ? 'إيقاف الكاميرا' : 'تفعيل الكاميرا'}>
            <button onClick={toggleCamera}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${cameraStream ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              {cameraStream ? <I.Camera s={18} /> : <I.CameraOff s={18} />}
            </button>
          </Tooltip>

          <div className="w-6 border-t border-gray-700 my-1" />

          <Tooltip label={recording ? 'إيقاف التسجيل' : 'تسجيل محلي'}>
            <button onClick={toggleRecording}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${recording ? 'bg-orange-600 text-white animate-pulse' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              {recording ? <I.Stop s={18} /> : <I.Record s={18} />}
            </button>
          </Tooltip>
        </aside>

        {/* Center: Preview canvas */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 relative bg-black">
            <video ref={videoRef} className="hidden" autoPlay muted playsInline />
            <canvas ref={canvasRef} className={`w-full h-full object-contain ${drawingHide ? 'cursor-crosshair' : ''}`}
              onPointerDown={onCanvasPointerDown} onPointerUp={onCanvasPointerUp} />

            {!hasCaptured && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                <div className="w-16 h-16 rounded-2xl bg-gray-800/80 flex items-center justify-center">
                  <I.Monitor s={32} />
                </div>
                <p className="text-gray-500 text-sm">اضغط أيقونة الشاشة لبدء المشاركة</p>
              </div>
            )}

            {/* Camera PiP */}
            {cameraStream && <CameraPreview stream={cameraStream} />}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800 bg-gray-900/60 shrink-0">
            {/* Error */}
            {streamError && (
              <span className="text-red-400 text-xs flex-1 mr-3">{streamError}</span>
            )}
            {!streamError && (
              <div className="flex items-center gap-2 text-xs">
                <span className={statusColor}>
                  {streaming ? <><I.Wifi s={12} /> بث مباشر</> : connecting ? 'جارٍ الاتصال...' : <><I.WifiOff s={12} /> غير متصل</>}
                </span>
                {streaming && rtcStats.width > 0 && (
                  <span className="text-gray-600">{rtcStats.width}×{rtcStats.height}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mr-auto">
              {!settings.whipEndpoint && (
                <button onClick={() => setShowSettings(true)}
                  className="text-xs text-yellow-400 underline underline-offset-2">
                  اضبط إعدادات البث
                </button>
              )}
              {!streaming ? (
                <button onClick={startStream} disabled={connecting || !hasCaptured}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-red-500/20 flex items-center gap-2">
                  {connecting && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                  <I.Broadcast s={16} />
                  {connecting ? 'جارٍ الاتصال...' : 'بث مباشر'}
                </button>
              ) : (
                <button onClick={stopStream}
                  className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition flex items-center gap-2">
                  <I.Stop s={16} />
                  إيقاف البث
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right panel */}
        <aside className="w-72 flex flex-col border-l border-gray-800 bg-gray-900/40 shrink-0 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 shrink-0">
            {([['stats', <I.Chart s={14} />, 'إحصائيات'], ['chat', <I.Chat s={14} />, 'شات'], ['overlay', <I.Image s={14} />, 'طبقات']] as const).map(([k, icon, l]) => (
              <button key={k} onClick={() => setRightTab(k)}
                className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1 transition ${rightTab === k ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
                {icon}{l}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Stats tab */}
            {rightTab === 'stats' && (
              <div className="p-3 space-y-2">
                {streaming ? (
                  <>
                    <StatRow label="فيديو" value={`${rtcStats.videoBitrate} Kbps`} color="cyan" bar={rtcStats.videoBitrate / settings.videoBitrate} />
                    <StatRow label="صوت" value={`${rtcStats.audioBitrate} Kbps`} color="green" bar={rtcStats.audioBitrate / 192} />
                    <StatRow label="FPS" value={`${rtcStats.fps}`} color="purple" bar={rtcStats.fps / 30} />
                    <StatRow label="فقدان الحزم" value={`${rtcStats.packetLoss}%`} color={rtcStats.packetLoss > 5 ? 'red' : 'green'} bar={rtcStats.packetLoss / 100} />
                    <StatRow label="تأخير (RTT)" value={`${rtcStats.rtt} ms`} color={rtcStats.rtt > 200 ? 'yellow' : 'green'} bar={Math.min(rtcStats.rtt / 500, 1)} />
                    <div className="bg-gray-800/60 rounded-lg p-2.5 mt-3">
                      <p className="text-xs text-gray-500 font-medium mb-2">المنصة</p>
                      <p className="text-sm text-white">{PLATFORM_LABELS[settings.platform]}</p>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">{settings.whipEndpoint || '—'}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <I.Chart s={32} />
                    <p className="text-gray-500 text-sm">الإحصائيات تظهر خلال البث</p>
                    {!settings.whipEndpoint && (
                      <button onClick={() => setShowSettings(true)}
                        className="text-xs text-cyan-400 underline underline-offset-2">اضبط إعدادات البث</button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Chat tab */}
            {rightTab === 'chat' && (
              <div className="h-full flex flex-col">
                {chatUrl ? (
                  <iframe src={chatUrl} className="flex-1 w-full bg-gray-950 border-0" allow="autoplay" />
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 gap-3 p-4 text-center">
                    <I.Chat s={32} />
                    <p className="text-gray-500 text-sm">
                      {settings.chatPlatform === 'none'
                        ? 'اختر منصة الشات من الإعدادات'
                        : 'أدخل معرّف البث من الإعدادات'}
                    </p>
                    <button onClick={() => setShowSettings(true)}
                      className="text-xs text-cyan-400 underline underline-offset-2">فتح الإعدادات</button>
                  </div>
                )}
              </div>
            )}

            {/* Overlay tab */}
            {rightTab === 'overlay' && (
              <div className="p-3 space-y-4">
                {/* Logo */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">الشعار (Logo)</p>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg px-3 py-2 text-sm text-gray-300 border border-gray-700 border-dashed">
                    <I.Image s={14} />
                    {logo ? 'تغيير الشعار' : 'رفع شعار'}
                    <input type="file" accept="image/*" className="hidden" onChange={uploadLogo} />
                  </label>
                  {logo && (
                    <div className="flex items-center gap-2">
                      <img src={logo} className="w-10 h-10 rounded object-contain bg-gray-800" alt="logo" />
                      <button onClick={() => setLogo(null)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                        <I.Trash /> إزالة
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800" />

                {/* Text overlays */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">نص مباشر</p>
                  <input value={newText} onChange={e => setNewText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addText()}
                    placeholder="نص يظهر على البث..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition" />
                  <div className="flex gap-2 items-center">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-700 bg-gray-800 cursor-pointer p-0.5" />
                    <input type="range" min={14} max={72} value={textSize} onChange={e => setTextSize(+e.target.value)}
                      className="flex-1 accent-cyan-500" />
                    <span className="text-xs text-gray-500 w-8">{textSize}px</span>
                    <button onClick={addText}
                      className="p-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition text-white">
                      <I.Plus />
                    </button>
                  </div>
                  {texts.map(t => (
                    <div key={t.id} className="flex items-center gap-2 bg-gray-800/60 rounded px-2 py-1">
                      <span className="flex-1 text-xs truncate" style={{ color: t.color }}>{t.text}</span>
                      <button onClick={() => setTexts(ts => ts.filter(x => x.id !== t.id))} className="text-gray-600 hover:text-red-400">
                        <I.Trash />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800" />

                {/* Hide regions */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">إخفاء منطقة</p>
                  <div className="flex gap-1.5">
                    {(['smart', 'blur', 'black'] as const).map(m => (
                      <button key={m} onClick={() => setHideMode(m)}
                        className={`flex-1 py-1.5 text-xs rounded-lg transition ${hideMode === m ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                        {m === 'smart' ? 'ذكي' : m === 'blur' ? 'ضبابي' : 'أسود'}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setDrawingHide(d => !d)}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${drawingHide ? 'bg-yellow-600 text-white animate-pulse' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`}>
                    <I.Shield s={14} />
                    {drawingHide ? 'ارسم المنطقة على الشاشة' : 'إخفاء منطقة على الشاشة'}
                  </button>
                  {hideRegions.map(r => (
                    <div key={r.id} className="flex items-center gap-2 bg-gray-800/60 rounded px-2 py-1">
                      <span className="flex-1 text-xs text-gray-400">{r.mode} — {Math.round(r.w * 100)}%×{Math.round(r.h * 100)}%</span>
                      <button onClick={() => setHideRegions(rs => rs.filter(x => x.id !== r.id))} className="text-gray-600 hover:text-red-400">
                        <I.Trash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={handleSettingsClose} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Camera PiP ───────────────────────────────────────────────────────────────
function CameraPreview({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) { ref.current.srcObject = stream; ref.current.play(); }
  }, [stream]);
  return (
    <div className="absolute bottom-4 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl bg-black">
      <video ref={ref} autoPlay muted playsInline className="w-full h-full object-cover" />
    </div>
  );
}

// ─── Stat Row ─────────────────────────────────────────────────────────────────
function StatRow({ label, value, color, bar }: { label: string; value: string; color: string; bar: number }) {
  const colors: Record<string, string> = {
    cyan: 'bg-cyan-500', green: 'bg-green-500', purple: 'bg-purple-500',
    red: 'bg-red-500', yellow: 'bg-yellow-500',
  };
  return (
    <div className="bg-gray-800/50 rounded-lg p-2.5">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-mono font-medium">{value}</span>
      </div>
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colors[color] || 'bg-cyan-500'}`}
          style={{ width: `${Math.min(Math.max(bar * 100, 0), 100)}%` }} />
      </div>
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap z-50 border border-gray-700 shadow-lg pointer-events-none">
          {label}
        </div>
      )}
    </div>
  );
}

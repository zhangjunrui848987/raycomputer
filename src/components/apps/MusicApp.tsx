import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Music, 
  Disc, 
  ListMusic, 
  Heart,
  Radio
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  color: string;
}

const PLAYLIST: Track[] = [
  { id: '1', title: 'Midnight in Cupertino', artist: 'macOS Ambient Studio', album: 'Silicon Horizons', duration: 184, color: 'from-blue-600 to-indigo-800' },
  { id: '2', title: 'Infinite Loop Synth', artist: 'One Apple Park Way', album: 'Retina Dreams', duration: 210, color: 'from-purple-600 to-pink-700' },
  { id: '3', title: 'Sonoma Golden Fog', artist: 'Pacific Coast Beats', album: 'California Mist', duration: 165, color: 'from-amber-500 to-rose-600' },
  { id: '4', title: 'Terminal Hack Vibes', artist: 'zsh Core', album: 'Kernel Beats', duration: 198, color: 'from-emerald-600 to-teal-800' },
];

export const MusicApp: React.FC = () => {
  const { volume } = useOS();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);

  const track = PLAYLIST[currentTrackIndex];

  // Synthesize pleasant ambient lo-fi music on play
  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Play soft chords periodically
      const chords = [
        [261.63, 329.63, 392.0, 523.25], // C maj
        [220.0, 261.63, 329.63, 440.0],  // A min
        [174.61, 220.0, 261.63, 349.23], // F maj
        [196.0, 246.94, 293.66, 392.0],  // G maj
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (!audioCtxRef.current || !isPlaying) return;
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * (1 + idx * 0.001), now);

          const volFactor = (volume / 100) * 0.04;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volFactor, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 3.1);
        });
      };

      playChord();
      synthIntervalRef.current = setInterval(playChord, 3200);
    } else {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    }

    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, [isPlaying, volume]);

  // Timer progression
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            setCurrentTrackIndex((i) => (i + 1) % PLAYLIST.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, track.duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex h-full select-none text-slate-800 dark:text-slate-100 text-xs">
      {/* Sidebar */}
      <div className="w-48 bg-slate-100/70 dark:bg-slate-800/60 border-r border-black/10 dark:border-white/10 p-3 flex flex-col gap-4 shrink-0">
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            Apple Music
          </div>
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left bg-rose-600 text-white font-medium">
              <Radio size={14} />
              <span>現在聆聽</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5">
              <Disc size={14} className="text-rose-500" />
              <span>瀏覽音樂</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            資料庫
          </div>
          <div className="space-y-0.5 text-slate-700 dark:text-slate-300">
            <div className="px-2.5 py-1 hover:text-slate-900 dark:hover:text-white cursor-pointer">最近加入</div>
            <div className="px-2.5 py-1 hover:text-slate-900 dark:hover:text-white cursor-pointer">藝人與專輯</div>
            <div className="px-2.5 py-1 hover:text-slate-900 dark:hover:text-white cursor-pointer">沉浸聲空間</div>
          </div>
        </div>
      </div>

      {/* Main Content Player */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
          {/* Animated Vinyl Album Art */}
          <div className="relative mb-6">
            <div
              className={`w-44 h-44 rounded-2xl bg-gradient-to-br ${track.color} shadow-2xl flex items-center justify-center text-white relative overflow-hidden transition-transform duration-500 ${
                isPlaying ? 'scale-105 shadow-rose-500/20' : 'scale-100'
              }`}
            >
              <Disc
                size={80}
                className={`opacity-40 text-white ${isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '6s' }}
              />
              <Music size={40} className="absolute text-white drop-shadow-md" />
            </div>

            {/* Audio waveform visualizer bars when playing */}
            {isPlaying && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-1 h-6 bg-black/60 px-2 py-1 rounded-full backdrop-blur-xs">
                <span className="w-1 bg-rose-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 bg-rose-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.3s' }} />
                <span className="w-1 bg-rose-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 bg-rose-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.4s' }} />
                <span className="w-1 bg-rose-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.15s' }} />
              </div>
            )}
          </div>

          {/* Track details */}
          <div className="space-y-1 mb-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {track.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {track.artist} · {track.album}
            </p>
          </div>

          {/* Scrubber & Duration */}
          <div className="w-full max-w-md space-y-1">
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${(progress / track.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{formatSeconds(progress)}</span>
              <span>-{formatSeconds(track.duration - progress)}</span>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            </button>

            <button
              onClick={handlePrev}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause size={22} className="fill-current" /> : <Play size={22} className="fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
            >
              <SkipForward size={20} />
            </button>

            <button className="p-2 rounded-full text-slate-400 hover:text-slate-600">
              <Repeat size={18} />
            </button>
          </div>
        </div>

        {/* Playlist Drawer Footer */}
        <div className="h-14 border-t border-black/10 dark:border-white/10 px-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <ListMusic size={15} className="text-slate-400" />
            <span className="font-semibold text-xs">播放清單 (4 首曲目)</span>
          </div>
          <div className="flex items-center gap-2">
            {PLAYLIST.map((t, i) => (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentTrackIndex(i);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`px-2 py-1 rounded text-[11px] truncate max-w-[120px] transition-colors ${
                  i === currentTrackIndex
                    ? 'bg-rose-600 text-white font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

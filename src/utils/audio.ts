// Web Audio API ambient noise & gentle cheerful relaxation music generator

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentMode: 'none' | 'rain' | 'waves' | 'bell' = 'none';
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;

  // Separate scheduler state for breathing exercise gentle cheerful music
  private musicIntervalId: number | null = null;
  private musicMasterGain: GainNode | null = null;
  private musicStep = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMode(): string {
    return this.currentMode;
  }

  public stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop?.();
        this.noiseNode.disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    this.currentMode = 'none';
  }

  public playRain() {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentMode = 'rain';

    // Pink noise buffer for soothing rain
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  public playWaves() {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentMode = 'waves';

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime);

    let wavePhase = 0;
    this.intervalId = window.setInterval(() => {
      if (!this.ctx || !this.gainNode) return;
      wavePhase += 0.05;
      const waveGain = (Math.sin(wavePhase) * 0.5 + 0.5) * 0.12 + 0.01;
      this.gainNode.gain.setTargetAtTime(waveGain, this.ctx.currentTime, 0.2);
    }, 100);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  public playCalmBell() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.9);
  }

  /**
   * Gentle, cheerful & soothing kalimba/music-box melody for breathing exercises
   */
  public startBreathingMusic() {
    this.stopBreathingMusic();
    this.initContext();
    if (!this.ctx) return;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.85, this.ctx.currentTime + 0.8);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2200, this.ctx.currentTime);

    lowpass.connect(masterGain);
    masterGain.connect(this.ctx.destination);
    this.musicMasterGain = masterGain;

    // Bright, uplifting, gentle C-major / F-major pentatonic melody (Hz)
    // Progression: Cmaj7 -> Fmaj7 -> Am7 -> G6
    const melodyPattern = [
      523.25, 659.25, 783.99, 987.77, 783.99, 659.25, // C5 E5 G5 B5 G5 E5
      698.46, 880.00, 1046.50, 880.00, 698.46, 659.25, // F5 A5 C6 A5 F5 E5
      440.00, 523.25, 659.25, 783.99, 659.25, 523.25, // A4 C5 E5 G5 E5 C5
      392.00, 493.88, 587.33, 783.99, 659.25, 587.33  // G4 B4 D5 G5 E5 D5
    ];

    // Warm root pad bass notes aligned every 6 steps
    const bassPattern = [
      261.63, // C4
      174.61, // F3
      220.00, // A3
      196.00  // G3
    ];

    this.musicStep = 0;

    const playNote = () => {
      if (!this.ctx || !this.musicMasterGain) return;
      const now = this.ctx.currentTime;
      const idx = this.musicStep % melodyPattern.length;
      const freq = melodyPattern[idx];

      // Soft warm kalimba/celesta tone
      const osc = this.ctx.createOscillator();
      const harmonic = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 2, now);

      const harmonicGain = this.ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.18, now);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.065, now + 0.035);
      noteGain.gain.exponentialRampToValueAtTime(0.0008, now + 1.5);

      osc.connect(noteGain);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(noteGain);
      noteGain.connect(lowpass);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + 1.55);
      harmonic.stop(now + 1.55);

      // Gentle warm bass chord swell at the start of each bar (every 6 notes)
      if (idx % 6 === 0) {
        const bassFreq = bassPattern[Math.floor(idx / 6) % bassPattern.length];
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();

        padOsc.type = 'sine';
        padOsc.frequency.setValueAtTime(bassFreq, now);

        padGain.gain.setValueAtTime(0.0001, now);
        padGain.gain.linearRampToValueAtTime(0.045, now + 0.5);
        padGain.gain.exponentialRampToValueAtTime(0.0008, now + 3.2);

        padOsc.connect(padGain);
        padGain.connect(lowpass);

        padOsc.start(now);
        padOsc.stop(now + 3.3);
      }

      this.musicStep += 1;
    };

    // Play first note immediately then every 580ms (gentle, cheerful ~103 BPM eighth-feel)
    playNote();
    this.musicIntervalId = window.setInterval(playNote, 580);
  }

  public stopBreathingMusic() {
    if (this.musicIntervalId) {
      window.clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    if (this.musicMasterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.musicMasterGain.gain.cancelScheduledValues(now);
        this.musicMasterGain.gain.setTargetAtTime(0.0001, now, 0.15);
        const oldGain = this.musicMasterGain;
        setTimeout(() => {
          try {
            oldGain.disconnect();
          } catch {
            // ignore
          }
        }, 400);
      } catch {
        // ignore
      }
      this.musicMasterGain = null;
    }
  }

  /**
   * Soft harmonic cue for breathing phase transitions
   */
  public playSoftPhaseCue(phase: 'inhale' | 'hold' | 'exhale' | 'pause') {
    this.initContext();
    if (!this.ctx) return;

    const freqMap = {
      inhale: 523.25, // C5
      hold: 659.25,   // E5
      exhale: 587.33, // D5
      pause: 440.00   // A4
    };

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqMap[phase], now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.15);
  }

  /**
   * Bright, cheerful celebration chime when completing 1 full breathing cycle
   */
  public playCelebrationChime() {
    this.initContext();
    if (!this.ctx) return;

    // Uplifting major celebratory arpeggio: C5 -> E5 -> G5 -> C6 -> E6
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = now + idx * 0.085;
      const duration = idx === notes.length - 1 ? 1.8 : 0.75;

      const osc = this.ctx.createOscillator();
      const sparkle = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const sparkleGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      sparkle.type = 'triangle';
      sparkle.frequency.setValueAtTime(freq * 2, startTime);

      sparkleGain.gain.setValueAtTime(0.03, startTime);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration * 0.6);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(idx === notes.length - 1 ? 0.14 : 0.10, startTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

      osc.connect(gain);
      sparkle.connect(sparkleGain);
      sparkleGain.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      sparkle.start(startTime);
      osc.stop(startTime + duration + 0.05);
      sparkle.stop(startTime + duration + 0.05);
    });
  }
}

export const soundEngine = new AmbientSoundEngine();

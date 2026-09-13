import { SoundType, AmbientSoundType } from '../types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private alarmInterval: number | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNodes: GainNode[] = [];
  private isRinging: boolean = false;

  // Ambient sound nodes
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientInterval: number | null = null;
  private currentAmbient: AmbientSoundType = 'none';

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays a single bell chime based on sound type
   */
  public playSingleChime(type: SoundType = 'classic-bell', volume: number = 80): void {
    try {
      const ctx = this.getContext();
      const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
      const now = ctx.currentTime;

      if (type === 'classic-bell') {
        this.synthesizeClassicBell(ctx, now, normalizedVolume);
      } else if (type === 'school-bell') {
        this.synthesizeSchoolBell(ctx, now, normalizedVolume);
      } else if (type === 'zen-bowl') {
        this.synthesizeZenBowl(ctx, now, normalizedVolume);
      } else if (type === 'crystal-chime') {
        this.synthesizeCrystalChime(ctx, now, normalizedVolume);
      } else if (type === 'digital-alarm') {
        this.synthesizeDigitalAlarm(ctx, now, normalizedVolume);
      } else {
        this.synthesizeClassicBell(ctx, now, normalizedVolume);
      }
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  /**
   * Classic brass bell / desk bell strike
   */
  private synthesizeClassicBell(ctx: AudioContext, startTime: number, volume: number): void {
    const harmonics = [
      { freq: 880, gain: 0.6, decay: 2.2 },   // Fundamental (A5)
      { freq: 1760, gain: 0.35, decay: 1.8 }, // 1st overtone
      { freq: 2640, gain: 0.2, decay: 1.2 },  // 2nd overtone
      { freq: 3520, gain: 0.15, decay: 0.8 }, // Sparkle overtone
      { freq: 4400, gain: 0.08, decay: 0.5 }, // Metallic strike
    ];

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(h.freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(h.gain * volume, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + h.decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + h.decay + 0.1);

      this.activeOscillators.push(osc);
      this.activeGainNodes.push(gain);
    });

    const strikeOsc = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strikeOsc.type = 'triangle';
    strikeOsc.frequency.setValueAtTime(1320, startTime);
    strikeGain.gain.setValueAtTime(0.2 * volume, startTime);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);
    strikeOsc.connect(strikeGain);
    strikeGain.connect(ctx.destination);
    strikeOsc.start(startTime);
    strikeOsc.stop(startTime + 0.2);

    this.activeOscillators.push(strikeOsc);
    this.activeGainNodes.push(strikeGain);
  }

  /**
   * Electric School Bell with rapid hammer clapper vibrations (ringing trill)
   */
  private synthesizeSchoolBell(ctx: AudioContext, startTime: number, volume: number): void {
    const strikesCount = 18;
    const strikeInterval = 0.065; // ~15 strikes per second

    for (let i = 0; i < strikesCount; i++) {
      const t = startTime + i * strikeInterval;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1240, t); // High metallic ring
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(2480, t); // Overtones

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.35 * volume, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
      osc2.start(t);
      osc2.stop(t + 0.15);

      this.activeOscillators.push(osc, osc2);
      this.activeGainNodes.push(gain);
    }
  }

  /**
   * Tibetan singing bowl / Zen temple bell
   */
  private synthesizeZenBowl(ctx: AudioContext, startTime: number, volume: number): void {
    const fundamental = 432;
    const partials = [
      { ratio: 1.0, gain: 0.7, decay: 3.5 },
      { ratio: 2.76, gain: 0.35, decay: 3.0 },
      { ratio: 5.4, gain: 0.18, decay: 2.2 },
      { ratio: 8.9, gain: 0.08, decay: 1.5 },
    ];

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * p.ratio, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(p.gain * volume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + p.decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + p.decay + 0.1);

      this.activeOscillators.push(osc);
      this.activeGainNodes.push(gain);
    });
  }

  /**
   * Cascading crystal chime
   */
  private synthesizeCrystalChime(ctx: AudioContext, startTime: number, volume: number): void {
    const notes = [1046.5, 1318.5, 1567.98, 2093.0];
    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.4 * volume, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 2.1);

      this.activeOscillators.push(osc);
      this.activeGainNodes.push(gain);
    });
  }

  /**
   * Digital alert beeps
   */
  private synthesizeDigitalAlarm(ctx: AudioContext, startTime: number, volume: number): void {
    const beeps = [0, 0.15, 0.3, 0.45];
    beeps.forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1046, startTime + delay);

      gain.gain.setValueAtTime(0.25 * volume, startTime + delay);
      gain.gain.setValueAtTime(0, startTime + delay + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + delay);
      osc.stop(startTime + delay + 0.09);

      this.activeOscillators.push(osc);
      this.activeGainNodes.push(gain);
    });
  }

  /**
   * Ambient sound generator (Rain, Wind, Campfire, White Noise, Birds)
   */
  public updateAmbientSound(type: AmbientSoundType, volume: number = 50): void {
    if (this.currentAmbient === type && this.ambientGain) {
      // Just update volume smoothly
      const normVol = Math.max(0, Math.min(1, volume / 100)) * 0.3;
      this.ambientGain.gain.linearRampToValueAtTime(normVol, this.getContext().currentTime + 0.2);
      return;
    }

    this.stopAmbientSound();
    if (type === 'none') {
      this.currentAmbient = 'none';
      return;
    }

    try {
      const ctx = this.getContext();
      this.currentAmbient = type;
      const normVol = Math.max(0, Math.min(1, volume / 100)) * 0.3;

      // Generate 5-second seamless noise buffer
      const bufferSize = ctx.sampleRate * 5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain' || type === 'wind') {
          // Pink/brown filtered noise
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else if (type === 'campfire') {
          // Crackle spikes
          const crackle = Math.random() > 0.997 ? (Math.random() * 1.5) : 0;
          lastOut = (lastOut + 0.04 * white) / 1.04;
          data[i] = lastOut * 2.0 + crackle;
        } else {
          data[i] = white * 0.4;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
      } else if (type === 'wind') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
      } else if (type === 'campfire') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(normVol, ctx.currentTime + 0.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      this.ambientSource = source;
      this.ambientFilter = filter;
      this.ambientGain = gain;

      // If birds, also schedule occasional sweet chirps
      if (type === 'birds') {
        this.ambientInterval = window.setInterval(() => {
          if (this.currentAmbient !== 'birds') return;
          this.playBirdChirp(ctx, normVol);
        }, 3200);
      }
    } catch (e) {
      console.warn('Error starting ambient sound:', e);
    }
  }

  private playBirdChirp(ctx: AudioContext, vol: number): void {
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 2400 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol * 0.6, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  public stopAmbientSound(): void {
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
        setTimeout(() => {
          if (this.ambientSource) {
            try {
              this.ambientSource.stop();
              this.ambientSource.disconnect();
            } catch {
              // ignore
            }
            this.ambientSource = null;
          }
          if (this.ambientGain) {
            this.ambientGain.disconnect();
            this.ambientGain = null;
          }
        }, 350);
      } catch {
        // ignore
      }
    }
    this.currentAmbient = 'none';
  }

  /**
   * Plays a soft clock tick
   */
  public playTickSound(volume: number = 20): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

      const normalizedVol = Math.max(0, Math.min(1, volume / 100)) * 0.15;
      gain.gain.setValueAtTime(normalizedVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // ignore
    }
  }

  /**
   * Starts repeating alarm sound until stopped manually
   */
  public startAlarm(
    type: SoundType,
    volume: number,
    continuous: boolean = true,
    onRingingChange?: (ringing: boolean) => void,
    intervalMs: number = 2600
  ): void {
    this.stopAlarm();
    this.isRinging = true;
    if (onRingingChange) onRingingChange(true);

    this.playSingleChime(type, volume);

    if (continuous) {
      const interval = Math.max(1500, intervalMs);
      this.alarmInterval = window.setInterval(() => {
        if (!this.isRinging) return;
        this.playSingleChime(type, volume);
      }, interval);
    }
  }

  /**
   * Stops the alarm sound immediately and clears repeating loops
   */
  public stopAlarm(onRingingChange?: (ringing: boolean) => void): void {
    this.isRinging = false;
    if (onRingingChange) onRingingChange(false);

    if (this.alarmInterval !== null) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }

    try {
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.activeGainNodes.forEach(gain => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
        } catch {
          // ignore
        }
      });

      setTimeout(() => {
        this.activeOscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // already stopped
          }
        });
        this.activeGainNodes.forEach(g => {
          try {
            g.disconnect();
          } catch {
            // ignore
          }
        });
        this.activeOscillators = [];
        this.activeGainNodes = [];
      }, 60);
    } catch (e) {
      console.warn('Error stopping sound:', e);
    }
  }

  public getIsRinging(): boolean {
    return this.isRinging;
  }
}

export const soundSynthesizer = new SoundSynthesizer();

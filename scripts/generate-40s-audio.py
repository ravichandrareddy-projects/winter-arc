#!/usr/bin/env python3
"""Generate a 40-second punchy, modern cinematic background track for the Winter Arc 40s ad.

Designed for Gen-Z audience energy:
- 0s-8s: Atmospheric, introspective, building tension
- 8s-18s: Modern synth pulse enters with sub-bass on reveal
- 18s-24s: Data section with ticking telemetry rhythms
- 24s-29s: System climax with bright sonic accent
- 29s-35s: Triumphant resolution during progress graphs
- 35s-40s: Clean punchy CTA and epic final resolve
"""
from __future__ import annotations

import math
from pathlib import Path
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "video-assets"
RATE = 44_100
DURATION = 40.0  # Exactly 40 seconds (1200 frames @ 30 FPS)

# Scene timing (seconds) matching the 40s ad exactly
HOOK_START     = 0.0     # 0.0s – 4.0s
PROBLEM_START  = 4.0     # 4.0s – 8.0s
INTRO_START    = 8.0     # 8.0s – 13.33s
TRACKING_START = 13.33   # 13.33s – 18.0s
DATA_START     = 18.0    # 18.0s – 24.0s
SYSTEM_START   = 24.0    # 24.0s – 28.67s
PROGRESS_START = 28.67   # 28.67s – 34.67s
CTA_START      = 34.67   # 34.67s – 37.5s
FINAL_START    = 37.5    # 37.5s – 40.0s


def sine(freq: float, t: np.ndarray, phase: float = 0.0) -> np.ndarray:
    return np.sin(2 * math.pi * freq * t + phase)


def generate_music() -> np.ndarray:
    total_samples = int(DURATION * RATE)
    t = np.arange(total_samples, dtype=np.float64) / RATE
    audio = np.zeros(total_samples, dtype=np.float64)

    # ── 1. ATMOSPHERIC PAD LAYER (evolves dynamically across 40s) ──────────────
    # 10 chord steps across 40s = 4.0s per chord
    chords = [
        [220.00, 261.63, 329.63],   # 0-4s:   Am (Hook - dark, quiet)
        [174.61, 220.00, 261.63],   # 4-8s:   F  (Problem - tension building)
        [261.63, 329.63, 392.00],   # 8-12s:  C  (Intro reveal - open)
        [196.00, 246.94, 293.66],   # 12-16s: G  (Tracking - drive)
        [146.83, 220.00, 261.63],   # 16-20s: Dm (Tracking/Data - focus)
        [174.61, 220.00, 261.63],   # 20-24s: F  (Data graphs - rising power)
        [196.00, 246.94, 293.66],   # 24-28s: G  (System - climax energy)
        [261.63, 329.63, 392.00],   # 28-32s: C  (Progress graphs - payoff)
        [174.61, 220.00, 261.63],   # 32-36s: F  (Progress/CTA - warmth)
        [220.00, 261.63, 329.63],   # 36-40s: Am (Final resolve)
    ]
    chord_dur = DURATION / len(chords)  # 4.0s

    for i, chord_freqs in enumerate(chords):
        t_start = i * chord_dur
        t_end   = min(DURATION, (i + 1) * chord_dur)
        s = int(t_start * RATE)
        e = int(t_end   * RATE)
        seg_len = e - s
        if seg_len <= 0:
            continue
        lt = np.arange(seg_len, dtype=np.float64) / RATE

        # Soft ADSR envelope
        attack  = int(min(0.6 * RATE, seg_len * 0.15))
        release = int(min(0.8 * RATE, seg_len * 0.20))
        env = np.ones(seg_len, dtype=np.float64)
        if attack > 0:
            env[:attack]   = np.linspace(0.0, 1.0, attack)
        if release > 0:
            env[-release:] = np.linspace(1.0, 0.0, release)

        # Dynamic volume curve
        if t_start < PROBLEM_START:
            dyn = 0.06  # Hook
        elif t_start < INTRO_START:
            dyn = 0.09  # Problem
        elif t_start < TRACKING_START:
            dyn = 0.13  # Intro reveal
        elif t_start < DATA_START:
            dyn = 0.15  # Tracking
        elif t_start < SYSTEM_START:
            dyn = 0.16  # Data
        elif t_start < PROGRESS_START:
            dyn = 0.19  # System peak
        elif t_start < CTA_START:
            dyn = 0.17  # Progress payoff
        else:
            dyn = 0.14  # CTA & Final

        pad = np.zeros(seg_len, dtype=np.float64)
        for freq in chord_freqs:
            pad += sine(freq,         lt) * 0.40
            pad += sine(freq * 1.003, lt) * 0.22
            pad += sine(freq * 0.997, lt) * 0.22
            pad += sine(freq * 0.5,   lt) * 0.18
            pad += sine(freq * 2.0,   lt) * 0.06

        audio[s:e] += pad * env * dyn

    # ── 2. SUB BASS (starts at INTRO @ 8s) ────────────────────────────────────
    bass_roots = [220.0, 174.6, 261.6, 196.0, 146.8, 174.6, 196.0, 261.6, 174.6, 220.0]
    for i, bfreq in enumerate(bass_roots):
        t_start = i * chord_dur
        if t_start < INTRO_START:
            continue
        t_end = min(DURATION, t_start + chord_dur)
        s = int(t_start * RATE)
        e = int(t_end   * RATE)
        seg_len = e - s
        if seg_len <= 0:
            continue
        lt = np.arange(seg_len, dtype=np.float64) / RATE

        attack  = int(min(0.2 * RATE, seg_len // 4))
        release = int(min(0.3 * RATE, seg_len // 4))
        env = np.ones(seg_len, dtype=np.float64)
        env[:attack]   = np.linspace(0.0, 1.0, attack)
        env[-release:] = np.linspace(1.0, 0.0, release)

        bass_vol = 0.11 if t_start < SYSTEM_START else 0.15
        bass = sine(bfreq / 2, lt) + 0.45 * sine(bfreq, lt)
        audio[s:e] += bass * env * bass_vol

    # ── 3. RHYTHMIC DRIVING PULSE (starts at TRACKING @ 13.3s) ─────────────────
    BPM = 100
    beat_interval = 60.0 / BPM  # 0.60s per beat
    click_len = int(0.060 * RATE)

    num_beats = int(DURATION / beat_interval)
    for b in range(num_beats):
        beat_time = b * beat_interval
        if beat_time < TRACKING_START:
            continue
        if beat_time > FINAL_START + 2.0:
            continue

        s = int(beat_time * RATE)
        e = min(total_samples, s + click_len)
        l = e - s
        if l <= 0:
            continue
        bt = np.arange(l, dtype=np.float64) / RATE

        # Deep kick on downbeats
        if b % 2 == 0:
            kick_vol = 0.19 if beat_time >= SYSTEM_START else 0.13
            kick_freq = 55.0 * np.exp(-bt * 32.0) + 40.0
            kick = np.sin(2 * math.pi * kick_freq * bt) * np.exp(-bt * 20.0) * kick_vol
            audio[s:e] += kick

        # Modern crisp hi-hat tick on every beat
        hat_vol = 0.045 if beat_time < SYSTEM_START else 0.065
        tick = np.sin(2 * math.pi * 4400 * bt) * np.exp(-bt * 90.0) * hat_vol
        audio[s:e] += tick

        # Snare/clap on every 4th beat
        if b % 4 == 2:
            snare_vol = 0.065 if beat_time >= DATA_START else 0.035
            noise = np.random.randn(l).astype(np.float64)
            snare_env = np.exp(-bt * 38.0)
            snare = noise * snare_env * snare_vol
            audio[s:e] += snare

    # ── 4. IMPACT SWOOSH TRANSITIONS ──────────────────────────────────────────
    transition_moments = [
        (PROBLEM_START  - 0.2, 0.06),
        (INTRO_START    - 0.2, 0.08),
        (TRACKING_START - 0.2, 0.09),
        (DATA_START     - 0.2, 0.11),
        (SYSTEM_START   - 0.2, 0.13),
        (PROGRESS_START - 0.2, 0.13),
        (CTA_START      - 0.2, 0.10),
        (FINAL_START    - 0.2, 0.09),
    ]
    swoosh_len = int(0.40 * RATE)
    for (ts, vol) in transition_moments:
        s = max(0, int((ts - 0.1) * RATE))
        e = min(total_samples, s + swoosh_len)
        sl = e - s
        if sl <= 0:
            continue
        st = np.arange(sl, dtype=np.float64) / RATE
        sweep_freq = 280.0 * np.exp(-st * 7.0) + 55.0
        swoosh = np.sin(2 * math.pi * sweep_freq * st) * np.exp(-st * 10.0) * vol
        audio[s:e] += swoosh

    # ── 5. CLIMAX STING AT SYSTEM (24s) ───────────────────────────────────────
    sting_start = int(SYSTEM_START * RATE)
    sting_len = int(0.30 * RATE)
    sting_e = min(total_samples, sting_start + sting_len)
    sl = sting_e - sting_start
    if sl > 0:
        st = np.arange(sl, dtype=np.float64) / RATE
        sting = (
            np.sin(2 * math.pi * 880.0 * st) * 0.15 +
            np.sin(2 * math.pi * 1320.0 * st) * 0.09 +
            np.sin(2 * math.pi * 1760.0 * st) * 0.05
        ) * np.exp(-st * 22.0)
        audio[sting_start:sting_e] += sting

    # ── 6. MASTER DYNAMICS & FADES ────────────────────────────────────────────
    # Fade in: 0 → 1.2s
    fi = int(1.2 * RATE)
    audio[:fi] *= np.linspace(0.0, 1.0, fi)

    # Fade out: last 2.0s
    fo = int(2.0 * RATE)
    audio[-fo:] *= np.linspace(1.0, 0.0, fo)

    # Punchy warm analog limiter
    audio = np.tanh(audio * 2.1) * 0.83

    return audio


def main() -> None:
    np.random.seed(42)
    OUT.mkdir(parents=True, exist_ok=True)
    audio = generate_music()
    stereo = np.column_stack([audio, audio]).reshape(-1)

    target = OUT / "winter-arc-40s-audio.wav"
    with wave.open(str(target), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes((stereo * 32767).astype(np.int16).tobytes())

    print(f"✓ Generated 40s background music → {target}  ({DURATION}s)")


if __name__ == "__main__":
    main()

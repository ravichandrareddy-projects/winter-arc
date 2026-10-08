#!/usr/bin/env python3
"""Generate a 30-second punchy, modern cinematic background track for the Winter Arc 30s ad.

Designed to match the Gen-Z audience energy: starts dark/atmospheric, builds up fast,
hits hard on the System section, then lands clean on the CTA.
"""
from __future__ import annotations

import math
from pathlib import Path
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "video-assets"
RATE = 44_100
DURATION = 30  # Exactly 30 seconds

# Scene timing (seconds) matching the ad exactly
HOOK_START     = 0.0    # 0s-3s  – dark, mysterious
PROBLEM_START  = 3.0    # 3s-6s  – chaos builds
INTRO_START    = 6.0    # 6s-10s – dramatic reveal
TRACKING_START = 10.0   # 10s-14s – fast energy
DATA_START     = 14.0   # 14s-18s – building tension
SYSTEM_START   = 18.0   # 18s-22s – peak impact
PROGRESS_START = 22.0   # 22s-25s – emotional resolution
CTA_START      = 25.0   # 25s-27s – clean
FINAL_START    = 27.0   # 27s-30s – epic close

def sine(freq: float, t: np.ndarray, phase: float = 0.0) -> np.ndarray:
    return np.sin(2 * math.pi * freq * t + phase)

def generate_music() -> np.ndarray:
    total_samples = int(DURATION * RATE)
    t = np.arange(total_samples, dtype=np.float64) / RATE
    audio = np.zeros(total_samples, dtype=np.float64)

    # ── 1. ATMOSPHERIC PAD LAYER (full 30s, evolves dynamically) ──────────────
    # A-minor feel: dark, introspective, winter
    # Chord sequence: Am → F → C → G → Am → F → Em → Am
    chords = [
        [220.00, 261.63, 329.63],   # Am (A3 C4 E4)
        [174.61, 220.00, 261.63],   # F  (F3 A3 C4)
        [261.63, 329.63, 392.00],   # C  (C4 E4 G4)
        [196.00, 246.94, 293.66],   # G  (G3 B3 D4)
        [220.00, 261.63, 329.63],   # Am
        [174.61, 220.00, 261.63],   # F
        [164.81, 220.00, 246.94],   # Em (E3 A3 B3)
        [220.00, 261.63, 329.63],   # Am
    ]
    chord_dur = DURATION / len(chords)  # ~3.75s per chord

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
        attack  = int(min(0.5 * RATE, seg_len * 0.15))
        release = int(min(0.6 * RATE, seg_len * 0.2))
        env = np.ones(seg_len, dtype=np.float64)
        if attack > 0:
            env[:attack]   = np.linspace(0.0, 1.0, attack)
        if release > 0:
            env[-release:] = np.linspace(1.0, 0.0, release)

        # Scene-based dynamic volume: quiet at hook, crescendo through system, resolves at progress
        progress = t_start / DURATION
        if t_start < HOOK_START + 3:
            dyn = 0.06  # very quiet hook
        elif t_start < INTRO_START:
            dyn = 0.09  # chaos builds
        elif t_start < TRACKING_START:
            dyn = 0.12  # intro reveal
        elif t_start < DATA_START:
            dyn = 0.14  # tracking section
        elif t_start < SYSTEM_START:
            dyn = 0.16  # building tension
        elif t_start < PROGRESS_START:
            dyn = 0.18  # system = peak
        else:
            dyn = 0.14  # resolution and cta

        pad = np.zeros(seg_len, dtype=np.float64)
        for freq in chord_freqs:
            # Main tone + slight detune layers for warmth
            pad += sine(freq,         lt) * 0.40
            pad += sine(freq * 1.003, lt) * 0.22
            pad += sine(freq * 0.997, lt) * 0.22
            # Octave below (sub warmth)
            pad += sine(freq * 0.5,   lt) * 0.18
            # Soft 2nd harmonic shimmer
            pad += sine(freq * 2.0,   lt) * 0.06

        audio[s:e] += pad * env * dyn

    # ── 2. SUB BASS (starts at INTRO, drives energy) ───────────────────────────
    bass_pattern = [220.0, 174.6, 261.6, 196.0, 220.0, 174.6, 164.8, 220.0]
    for i, bfreq in enumerate(bass_pattern):
        t_start = i * chord_dur
        if t_start < INTRO_START:
            continue  # no bass during hook/problem
        t_end = min(DURATION, t_start + chord_dur)
        s = int(t_start * RATE)
        e = int(t_end   * RATE)
        seg_len = e - s
        if seg_len <= 0:
            continue
        lt = np.arange(seg_len, dtype=np.float64) / RATE

        attack  = int(min(0.15 * RATE, seg_len // 4))
        release = int(min(0.25 * RATE, seg_len // 4))
        env = np.ones(seg_len, dtype=np.float64)
        env[:attack]   = np.linspace(0.0, 1.0, attack)
        env[-release:] = np.linspace(1.0, 0.0, release)

        bass_vol = 0.10 if t_start < SYSTEM_START else 0.14
        bass = sine(bfreq / 2, lt) + 0.4 * sine(bfreq, lt)
        audio[s:e] += bass * env * bass_vol

    # ── 3. RHYTHMIC PULSE (starts at TRACKING, drives forward momentum) ────────
    # 100 BPM = 0.6s per beat
    BPM = 100
    beat_interval = 60.0 / BPM
    click_len = int(0.055 * RATE)

    num_beats = int(DURATION / beat_interval)
    for b in range(num_beats):
        beat_time = b * beat_interval
        if beat_time < TRACKING_START:
            continue  # only after tracking section starts
        if beat_time > FINAL_START + 2.5:
            continue  # stop before very end

        s = int(beat_time * RATE)
        e = min(total_samples, s + click_len)
        l = e - s
        if l <= 0:
            continue
        bt = np.arange(l, dtype=np.float64) / RATE

        # Soft kick on every downbeat (every 2 beats)
        if b % 2 == 0:
            kick_vol = 0.18 if beat_time >= SYSTEM_START else 0.12
            kick_freq = 55.0 * np.exp(-bt * 35.0) + 40.0
            kick = np.sin(2 * math.pi * kick_freq * bt) * np.exp(-bt * 22.0) * kick_vol
            audio[s:e] += kick

        # Hi-hat tick (offbeat — every beat)
        hat_vol = 0.04 if beat_time < SYSTEM_START else 0.06
        tick = np.sin(2 * math.pi * 4200 * bt) * np.exp(-bt * 100.0) * hat_vol
        audio[s:e] += tick

        # Snare-like accent on every 4th beat
        if b % 4 == 2:
            snare_vol = 0.06 if beat_time >= DATA_START else 0.03
            noise = np.random.randn(l).astype(np.float64)
            snare_env = np.exp(-bt * 40.0)
            snare = noise * snare_env * snare_vol
            audio[s:e] += snare

    # ── 4. IMPACT SWOOSHES at scene transitions ────────────────────────────────
    transition_moments = [
        (HOOK_START     + 2.8, 0.06),  # just before problem starts
        (PROBLEM_START  + 2.8, 0.08),  # into intro
        (INTRO_START    + 3.8, 0.08),  # into tracking
        (TRACKING_START + 3.8, 0.10), # into data
        (DATA_START     + 3.8, 0.12), # into system
        (SYSTEM_START   + 3.8, 0.12), # into progress
        (PROGRESS_START + 2.8, 0.10), # into cta
        (CTA_START      + 1.8, 0.10), # into final
    ]
    swoosh_len = int(0.35 * RATE)
    for (ts, vol) in transition_moments:
        s = max(0, int((ts - 0.1) * RATE))
        e = min(total_samples, s + swoosh_len)
        sl = e - s
        if sl <= 0:
            continue
        st = np.arange(sl, dtype=np.float64) / RATE
        # Frequency sweeping down (bass impact)
        sweep_freq = 300.0 * np.exp(-st * 8.0) + 60.0
        swoosh = np.sin(2 * math.pi * sweep_freq * st) * np.exp(-st * 12.0) * vol
        audio[s:e] += swoosh

    # ── 5. CLIMAX STING at SYSTEM section (18s) ──────────────────────────────
    # A bright rising synth sting to punctuate "LOG → SEE → UNDERSTAND → IMPROVE"
    sting_start = int(SYSTEM_START * RATE)
    sting_len = int(0.25 * RATE)
    sting_e = min(total_samples, sting_start + sting_len)
    sl = sting_e - sting_start
    if sl > 0:
        st = np.arange(sl, dtype=np.float64) / RATE
        # Bright high synth hit
        sting = (
            np.sin(2 * math.pi * 880.0 * st) * 0.15 +
            np.sin(2 * math.pi * 1320.0 * st) * 0.08
        ) * np.exp(-st * 25.0)
        audio[sting_start:sting_e] += sting

    # ── 6. MASTER DYNAMICS ────────────────────────────────────────────────────
    # Fade in: 0 → 1.0s
    fi = int(1.0 * RATE)
    audio[:fi] *= np.linspace(0.0, 1.0, fi)

    # Fade out: last 1.5s
    fo = int(1.5 * RATE)
    audio[-fo:] *= np.linspace(1.0, 0.0, fo)

    # Soft saturation limiter (keeps things punchy without clipping)
    audio = np.tanh(audio * 2.2) * 0.82

    # Tiny random seed for reproducibility of noise elements
    return audio


def main() -> None:
    np.random.seed(42)
    OUT.mkdir(parents=True, exist_ok=True)
    audio = generate_music()
    stereo = np.column_stack([audio, audio]).reshape(-1)

    target = OUT / "winter-arc-30s-audio.wav"
    with wave.open(str(target), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes((stereo * 32767).astype(np.int16).tobytes())

    print(f"✓ Generated 30s background music → {target}  ({DURATION}s)")


if __name__ == "__main__":
    main()

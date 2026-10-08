#!/usr/bin/env python3
"""Generate a pure, plain, warm ambient background music bed for Winter Arc.

Characteristics:
- Completely plain, serene, and unobtrusive (NO drums, NO kicks, NO snares, NO clicks, NO swooshes).
- Warm, soft, low-pass filtered analog chord swells (Cmaj9, Am9, Fmaj7, Gsus4).
- Soft stereo detuning for wide, cinematic studio depth.
- Smooth, continuous, peaceful texture that lets the voiceover shine 100%.
"""
from __future__ import annotations

import math
from pathlib import Path
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "audio"
RATE = 44_100
DURATION = 42.0  # Full 42s coverage for 39s video

def generate_plain_ambient() -> tuple[np.ndarray, np.ndarray]:
    total_samples = int(DURATION * RATE)
    t = np.arange(total_samples, dtype=np.float64) / RATE

    # Serene, contemplative chord progression (6 chords across 42s = 7s per chord)
    # Frequencies in Hz:
    # 1. Cmaj7 (C3, G3, B3, E4)
    # 2. Am7   (A2, E3, G3, C4)
    # 3. Fmaj7 (F2, C3, E3, A3)
    # 4. Gsus4 (G2, D3, G3, C4)
    # 5. Cmaj9 (C3, G3, D4, E4)
    # 6. Cmaj  (C3, E3, G3, C4)
    chords = [
        [130.81, 196.00, 246.94, 329.63],  # Cmaj7
        [110.00, 164.81, 196.00, 261.63],  # Am7
        [87.31,  130.81, 164.81, 220.00],  # Fmaj7
        [98.00,  146.83, 196.00, 261.63],  # Gsus4
        [130.81, 196.00, 293.66, 329.63],  # Cmaj9
        [130.81, 164.81, 196.00, 261.63],  # Cmaj resolve
    ]
    chord_len = DURATION / len(chords)  # 7.0s per chord

    left = np.zeros(total_samples, dtype=np.float64)
    right = np.zeros(total_samples, dtype=np.float64)

    for i, chord in enumerate(chords):
        t_start = i * chord_len
        t_end = min(DURATION, (i + 1) * chord_len + 2.5)  # 2.5s smooth overlap/crossfade
        s = int(t_start * RATE)
        e = min(total_samples, int(t_end * RATE))
        seg_samples = e - s
        if seg_samples <= 0:
            continue

        lt = np.arange(seg_samples, dtype=np.float64) / RATE

        # Very smooth, breathing envelope (2s attack, 2.5s release)
        attack_len = int(min(2.0 * RATE, seg_samples * 0.35))
        release_len = int(min(2.5 * RATE, seg_samples * 0.40))
        env = np.ones(seg_samples, dtype=np.float64)
        if attack_len > 0:
            env[:attack_len] = 0.5 * (1 - np.cos(np.linspace(0, math.pi, attack_len)))
        if release_len > 0:
            env[-release_len:] = 0.5 * (1 + np.cos(np.linspace(0, math.pi, release_len)))

        # Build lush, warm, gentle harmonics for each note
        chord_l = np.zeros(seg_samples, dtype=np.float64)
        chord_r = np.zeros(seg_samples, dtype=np.float64)

        for freq in chord:
            # Fundamental sine
            f_l = freq * 0.999
            f_r = freq * 1.001
            # Gentle octave under for subtle body
            sub = np.sin(2 * math.pi * (freq * 0.5) * lt) * 0.22
            # Warm fundamental
            tone_l = np.sin(2 * math.pi * f_l * lt) * 0.55 + sub
            tone_r = np.sin(2 * math.pi * f_r * lt) * 0.55 + sub
            # Soft 2nd harmonic (warmth)
            tone_l += np.sin(2 * math.pi * (f_l * 2) * lt) * 0.12
            tone_r += np.sin(2 * math.pi * (f_r * 2) * lt) * 0.12
            # Soft 3rd harmonic (subtle shimmer)
            tone_l += np.sin(2 * math.pi * (f_l * 3) * lt) * 0.04
            tone_r += np.sin(2 * math.pi * (f_r * 3) * lt) * 0.04

            chord_l += tone_l
            chord_r += tone_r

        # Gentle breathing LFO (slow subtle swell)
        lfo = 1.0 + 0.08 * np.sin(2 * math.pi * 0.15 * lt)
        chord_l *= env * lfo * 0.22
        chord_r *= env * lfo * 0.22

        left[s:e] += chord_l
        right[s:e] += chord_r

    # Overall smooth master fade-in and fade-out
    fi = int(1.5 * RATE)
    left[:fi] *= np.linspace(0.0, 1.0, fi)
    right[:fi] *= np.linspace(0.0, 1.0, fi)

    fo = int(2.5 * RATE)
    left[-fo:] *= np.linspace(1.0, 0.0, fo)
    right[-fo:] *= np.linspace(1.0, 0.0, fo)

    # Soft analog warmth limiter
    left = np.tanh(left * 1.4) * 0.70
    right = np.tanh(right * 1.4) * 0.70

    return left, right

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    l, r = generate_plain_ambient()

    stereo = np.empty((len(l) * 2,), dtype=np.int16)
    stereo[0::2] = (l * 32767).astype(np.int16)
    stereo[1::2] = (r * 32767).astype(np.int16)

    target = OUT / "music.wav"
    with wave.open(str(target), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes(stereo.tobytes())

    print(f"✓ Created plain ambient music track → {target} ({DURATION}s)")

if __name__ == "__main__":
    main()

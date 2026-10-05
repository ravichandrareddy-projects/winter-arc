#!/usr/bin/env python3
"""Generate a clean, motivational synth ambient background music track for the Winter Arc ad.

No voiceover — pure, cinematic ambient music with warm pads, driving rhythm, and deep bass.
"""

from __future__ import annotations

import math
from pathlib import Path
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "video-assets"
RATE = 44_100
DURATION = 60  # Exactly 60 seconds


def generate_music() -> np.ndarray:
    total_samples = int(DURATION * RATE)
    t = np.arange(total_samples, dtype=np.float32) / RATE
    audio = np.zeros(total_samples, dtype=np.float32)

    # 1. Warm Analog Synth Chord Progression (Atmospheric, inspiring)
    # Chord progression: Dm (D3, F3, A3) -> Bb (Bb2, D3, F3) -> F (F2, A2, C3) -> C (C3, E3, G3)
    chord_progression = [
        [146.83, 174.61, 220.00],   # Dm
        [116.54, 146.83, 174.61],   # Bb
        [87.31, 110.00, 130.81],    # F
        [130.81, 164.81, 196.00],   # C
    ]
    chord_duration = 3.75  # seconds per chord (15 seconds per 4-chord cycle)
    num_cycles = int(math.ceil(DURATION / (chord_duration * 4)))

    for cycle in range(num_cycles):
        for chord_idx, chord in enumerate(chord_progression):
            start_sec = (cycle * 4 + chord_idx) * chord_duration
            if start_sec >= DURATION:
                break
            end_sec = min(DURATION, start_sec + chord_duration)
            start_idx = int(start_sec * RATE)
            end_idx = int(end_sec * RATE)
            seg_len = end_idx - start_idx
            if seg_len <= 0:
                continue

            local_t = np.arange(seg_len, dtype=np.float32) / RATE

            # Soft attack and release envelope
            attack = int(0.6 * RATE)
            release = int(0.8 * RATE)
            env = np.ones(seg_len, dtype=np.float32)
            if seg_len > attack:
                env[:attack] = np.linspace(0, 1, attack)
            if seg_len > release:
                env[-release:] = np.linspace(1, 0, release)

            # Sum of chord frequencies with slight detune for warmth
            pad_wave = np.zeros(seg_len, dtype=np.float32)
            for freq in chord:
                pad_wave += np.sin(2 * math.pi * freq * local_t) * 0.4
                pad_wave += np.sin(2 * math.pi * (freq * 1.004) * local_t) * 0.25
                pad_wave += np.sin(2 * math.pi * (freq * 0.996) * local_t) * 0.25
                # Subtle sub octave
                pad_wave += np.sin(2 * math.pi * (freq * 0.5) * local_t) * 0.2

            audio[start_idx:end_idx] += pad_wave * env * 0.12

    # 2. Deep Sub Bass (Drives the determination feeling)
    bass_notes = [73.42, 58.27, 43.65, 65.41]  # Root notes an octave lower
    for cycle in range(num_cycles):
        for chord_idx, bass_freq in enumerate(bass_notes):
            start_sec = (cycle * 4 + chord_idx) * chord_duration
            if start_sec >= DURATION:
                break
            end_sec = min(DURATION, start_sec + chord_duration)
            start_idx = int(start_sec * RATE)
            end_idx = int(end_sec * RATE)
            seg_len = end_idx - start_idx
            if seg_len <= 0:
                continue

            local_t = np.arange(seg_len, dtype=np.float32) / RATE
            bass_wave = np.sin(2 * math.pi * bass_freq * local_t)
            bass_wave += 0.3 * np.sin(2 * math.pi * (bass_freq * 2) * local_t)
            audio[start_idx:end_idx] += bass_wave * 0.14

    # 3. Subtle Modern Rhythmic Pulse (Tempo = 80 BPM, 0.75s per beat)
    beat_interval = 60.0 / 80.0
    num_beats = int(DURATION / beat_interval)
    click_len = int(0.06 * RATE)

    for b in range(num_beats):
        beat_time = b * beat_interval
        # Start rhythm gently after 3 seconds, drop slightly before outro
        if beat_time < 3.0 or beat_time > 56.5:
            continue
        start_idx = int(beat_time * RATE)
        end_idx = min(total_samples, start_idx + click_len)
        l = end_idx - start_idx
        if l <= 0:
            continue

        bt = np.arange(l, dtype=np.float32) / RATE

        # Soft kick pulse on downbeat (every 2 beats)
        if b % 2 == 0:
            kick_freq = 60.0 * np.exp(-bt * 30.0) + 40.0
            kick = np.sin(2 * math.pi * kick_freq * bt) * np.exp(-bt * 18.0) * 0.16
            audio[start_idx:end_idx] += kick

        # Subtle hi-hat tick on offbeats
        tick = np.sin(2 * math.pi * 3200 * bt) * np.exp(-bt * 80.0) * 0.035
        audio[start_idx:end_idx] += tick

    # 4. Cinematic Swells / Transitions every 8-9 seconds
    transition_times = [4.5, 14.0, 23.0, 32.0, 41.0, 50.0]
    for trans in transition_times:
        if trans >= DURATION - 2:
            continue
        swell_len = int(1.2 * RATE)
        s_idx = max(0, int((trans - 0.8) * RATE))
        e_idx = min(total_samples, s_idx + swell_len)
        sl = e_idx - s_idx
        if sl <= 0:
            continue
        st = np.arange(sl, dtype=np.float32) / RATE
        swell = np.sin(2 * math.pi * (240 + 360 * (st / 1.2)) * st) * (st / 1.2) * 0.04
        audio[s_idx:e_idx] += swell

    # 5. Master compression & master fade
    # Overall fade in at start (0 to 1.5s) and fade out at end (56.5 to 60s)
    fade_in = int(1.5 * RATE)
    fade_out = int(3.5 * RATE)
    audio[:fade_in] *= np.linspace(0, 1, fade_in)
    audio[-fade_out:] *= np.linspace(1, 0, fade_out)

    # Soft limiter / saturation
    master = np.tanh(audio * 1.8) * 0.88
    return master


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    audio = generate_music()
    stereo = np.column_stack([audio, audio]).reshape(-1)

    target_path = OUT / "winter-arc-audio.wav"
    with wave.open(str(target_path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes((stereo * 32767).astype(np.int16).tobytes())

    print(f"Generated clean pure background music: {target_path} ({len(audio)/RATE:.1f}s)")


if __name__ == "__main__":
    main()

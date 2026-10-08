#!/usr/bin/env python3
"""Generate a high-energy, motivational, dark-electronic / gym-phonk hybrid track

Structure (124 BPM, 40.0s):
- 0s - 8s:   Dark atmospheric build, pulsing sub-heartbeat, ticking clock, rising tension sweep
- 8s - 18s:  DROP 1: Punchy kick drum, crisp snare, aggressive distorted saw bass, driving 16th hi-hats
- 18s - 24s: Relentless rhythm with fast 16th-note arpeggiator lead dancing over the chords
- 24s - 28s: Massive cinematic brass "BRAAAM" stabs + build-up snare roll (SYSTEM section)
- 28s - 35s: PEAK CLIMAX: Full driving beats, triumphant synth leads, heavy sidechained 808 bass
- 35s - 40s: Punchy halftime outro + heavy sub boom and clean fade
"""
from __future__ import annotations

import math
from pathlib import Path
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "video-assets"
RATE = 44_100
DURATION = 40.0
BPM = 124.0
BEAT_LEN = 60.0 / BPM          # ~0.48387s
SIXTEENTH = BEAT_LEN / 4.0     # ~0.12097s


def saw(freq: float, t: np.ndarray) -> np.ndarray:
    """Band-limited-like sawtooth wave."""
    phase = (freq * t) % 1.0
    return 2.0 * phase - 1.0


def square(freq: float, t: np.ndarray) -> np.ndarray:
    return np.where((freq * t) % 1.0 < 0.5, 1.0, -1.0)


def sine(freq: float, t: np.ndarray, phase: float = 0.0) -> np.ndarray:
    return np.sin(2.0 * math.pi * freq * t + phase)


def make_kick(length_s: float = 0.35) -> np.ndarray:
    """Punchy modern motivational kick with click transient and sub thump."""
    samples = int(length_s * RATE)
    t = np.arange(samples, dtype=np.float64) / RATE
    # Rapid pitch envelope: 180 Hz -> 48 Hz
    freq = 46.0 + 135.0 * np.exp(-t * 38.0)
    phase = 2.0 * math.pi * np.cumsum(freq) / RATE
    body = np.sin(phase) * np.exp(-t * 14.0)

    # Click transient
    click = np.sin(2.0 * math.pi * 950.0 * t) * np.exp(-t * 180.0)
    noise_click = np.random.randn(samples) * np.exp(-t * 220.0) * 0.4

    kick = body + click * 0.5 + noise_click * 0.3
    # Soft saturation for thickness
    return np.tanh(kick * 1.8) * 0.85


def make_snare(length_s: float = 0.28) -> tuple[np.ndarray, np.ndarray]:
    """Crisp modern snare/clap layer in stereo."""
    samples = int(length_s * RATE)
    t = np.arange(samples, dtype=np.float64) / RATE

    # Tonal body
    body_freq = 175.0 * np.exp(-t * 28.0) + 120.0
    body = np.sin(2.0 * math.pi * body_freq * t) * np.exp(-t * 22.0) * 0.5

    # White noise snap
    noise_l = np.random.randn(samples) * np.exp(-t * 16.0)
    noise_r = np.random.randn(samples) * np.exp(-t * 16.0)

    # High frequency crack
    crack = np.sin(2.0 * math.pi * 3200.0 * t) * np.exp(-t * 70.0) * 0.35

    left = (body * 0.6 + noise_l * 0.65 + crack) * 0.75
    right = (body * 0.6 + noise_r * 0.65 + crack) * 0.75
    return np.tanh(left * 1.5) * 0.8, np.tanh(right * 1.5) * 0.8


def make_hihat(length_s: float = 0.065, accent: bool = True) -> tuple[np.ndarray, np.ndarray]:
    """Crisp 16th-note metallic hi-hat."""
    samples = int(length_s * RATE)
    t = np.arange(samples, dtype=np.float64) / RATE

    decay = 75.0 if accent else 110.0
    env = np.exp(-t * decay)
    vol = 0.35 if accent else 0.20

    # High pitched metallic resonance
    metal = (
        sine(6200, t) * 0.3 +
        sine(8400, t) * 0.3 +
        sine(11200, t) * 0.25 +
        np.random.randn(samples) * 0.7
    ) * env * vol
    return metal, metal * 0.95


def make_braam(length_s: float = 1.4, freq: float = 55.0) -> tuple[np.ndarray, np.ndarray]:
    """Massive Hans Zimmer style distorted brass/braam hit."""
    samples = int(length_s * RATE)
    t = np.arange(samples, dtype=np.float64) / RATE

    env = np.exp(-t * 2.2)
    # Layered detuned saws + fifth
    s1 = saw(freq, t)
    s2 = saw(freq * 1.008, t)
    s3 = saw(freq * 0.992, t)
    s_fifth = saw(freq * 1.498, t) * 0.6
    sub = sine(freq / 2.0, t) * 0.8

    raw = (s1 + s2 + s3 + s_fifth + sub) * env
    # Heavy warm overdrive
    distorted_l = np.tanh(raw * 3.2) * 0.65
    distorted_r = np.tanh((s1 * 1.05 + s3 + sub) * env * 3.2) * 0.65
    return distorted_l, distorted_r


def make_riser(length_s: float = 2.0) -> tuple[np.ndarray, np.ndarray]:
    """White noise + pitch sweep riser."""
    samples = int(length_s * RATE)
    t = np.arange(samples, dtype=np.float64) / RATE
    env = (t / length_s) ** 2.2

    sweep_freq = 200.0 * np.exp(t * 1.4)
    sweep = sine(sweep_freq, t) * 0.3
    noise_l = np.random.randn(samples) * 0.6
    noise_r = np.random.randn(samples) * 0.6

    l = (sweep + noise_l) * env * 0.45
    r = (sweep + noise_r) * env * 0.45
    return l, r


def generate_motivational_track() -> tuple[np.ndarray, np.ndarray]:
    total_samples = int(DURATION * RATE)
    left = np.zeros(total_samples, dtype=np.float64)
    right = np.zeros(total_samples, dtype=np.float64)

    total_beats = int(DURATION / BEAT_LEN)
    t_axis = np.arange(total_samples, dtype=np.float64) / RATE

    # ── ROOT PROGRESSION (A Minor Heroic / Motivational) ─────────────────────
    # Am (A2: 110Hz) -> F (F2: 87.3Hz) -> C (C2: 65.4Hz / C3: 130.8Hz) -> G (G2: 98Hz)
    chord_roots = [
        (0.0, 8.0, 110.00),    # 0s-8s:   Am (dark buildup)
        (8.0, 14.0, 110.00),   # 8s-14s:  Am (Drop 1 starts)
        (14.0, 18.0, 87.31),   # 14s-18s: F
        (18.0, 21.0, 65.41),   # 18s-21s: C
        (21.0, 24.0, 98.00),   # 21s-24s: G
        (24.0, 28.5, 110.00),  # 24s-28.5s: Am (System Braams)
        (28.5, 31.5, 87.31),   # 28.5s-31.5s: F (Peak Climax)
        (31.5, 34.5, 130.81),  # 31.5s-34.5s: C
        (34.5, 37.5, 98.00),   # 34.5s-37.5s: G
        (37.5, 40.0, 110.00),  # 37.5s-40s: Am (Final resolve)
    ]

    def get_root_at(time_s: float) -> float:
        for start_t, end_t, root in chord_roots:
            if start_t <= time_s < end_t:
                return root
        return 110.0

    # ── 1. DRUMS & PERCUSSION (PUNCHY, DRIVING, HARD-HITTING) ───────────────
    kick_sample = make_kick(0.32)
    kick_len = len(kick_sample)

    snare_l, snare_r = make_snare(0.26)
    snare_len = len(snare_l)

    hat_acc_l, hat_acc_r = make_hihat(0.065, accent=True)
    hat_soft_l, hat_soft_r = make_hihat(0.050, accent=False)

    for b in range(total_beats):
        beat_t = b * BEAT_LEN
        beat_sample = int(beat_t * RATE)

        # Kick drum pattern:
        # 0s - 8s: Soft heartbeat kick on downbeat every 2 beats
        # 8s - 37.5s: Driving 4-on-the-floor + syncopated kicks!
        is_build = beat_t < 8.0
        is_outro = beat_t >= 37.5

        kick_hits = []
        if is_build:
            if b % 2 == 0:
                kick_hits.append(0.0)
        elif not is_outro:
            # Driving gym pulse: beat 0, beat 1, beat 2, beat 3
            # with syncopated double-kicks before snare hits
            kick_hits.append(0.0)
            if b % 4 == 1 or b % 4 == 3:
                kick_hits.append(BEAT_LEN * 0.5)  # syncopated punch
        elif is_outro:
            if b % 2 == 0:
                kick_hits.append(0.0)

        for offset in kick_hits:
            hit_s = int((beat_t + offset) * RATE)
            if hit_s + kick_len < total_samples:
                vol = 0.55 if is_build else (0.95 if beat_t >= 28.0 else 0.85)
                left[hit_s : hit_s + kick_len] += kick_sample * vol
                right[hit_s : hit_s + kick_len] += kick_sample * vol

        # Snare / Clap pattern:
        # On beats 2 and 4 (starting at Drop @ 8.0s)
        if not is_build and not is_outro and (b % 2 == 1):
            if beat_sample + snare_len < total_samples:
                vol = 1.0 if beat_t >= 28.0 else 0.85
                left[beat_sample : beat_sample + snare_len] += snare_l * vol
                right[beat_sample : beat_sample + snare_len] += snare_r * vol

        # Build-up snare roll right before System (22.5s - 24.0s)
        if 22.0 <= beat_t < 24.0:
            for sixteenth_idx in range(4):
                roll_s = int((beat_t + sixteenth_idx * SIXTEENTH) * RATE)
                if roll_s + snare_len < total_samples:
                    roll_vol = 0.35 + 0.5 * ((beat_t - 22.0) / 2.0)
                    left[roll_s : roll_s + snare_len] += snare_l * roll_vol
                    right[roll_s : roll_s + snare_len] += snare_r * roll_vol

        # 16th-note Hi-Hats (drives energy from 8.0s to 37.5s)
        if 8.0 <= beat_t < 37.5:
            for s_idx in range(4):
                hat_t = beat_t + s_idx * SIXTEENTH
                hat_s = int(hat_t * RATE)
                acc = (s_idx == 0 or s_idx == 2)
                hl = hat_acc_l if acc else hat_soft_l
                hr = hat_acc_r if acc else hat_soft_r
                hlen = len(hl)
                if hat_s + hlen < total_samples:
                    left[hat_s : hat_s + hlen] += hl
                    right[hat_s : hat_s + hlen] += hr

    # ── 2. AGGRESSIVE DISTORTED BASSLINE (PHONK / MOTIVATIONAL SAW) ─────────
    # Plays energetic 8th-note or 16th-note galloping bassline
    bass_left = np.zeros(total_samples, dtype=np.float64)
    bass_right = np.zeros(total_samples, dtype=np.float64)

    num_eighths = int(DURATION / (BEAT_LEN / 2.0))
    for e_idx in range(num_eighths):
        e_time = e_idx * (BEAT_LEN / 2.0)
        if e_time < 8.0 or e_time >= 37.5:
            continue

        s = int(e_time * RATE)
        note_len = int((BEAT_LEN / 2.0) * 0.92 * RATE)
        if s + note_len >= total_samples:
            continue

        lt = np.arange(note_len, dtype=np.float64) / RATE
        root_f = get_root_at(e_time)

        # Alternating octave jumps on offbeats for bouncy motivation drive!
        is_offbeat = (e_idx % 2 == 1)
        freq = root_f * 2.0 if is_offbeat and (e_idx % 4 == 3) else root_f

        # Plucky punch envelope with sustain
        env = np.exp(-lt * 9.0) * 0.6 + 0.4 * np.exp(-lt * 2.5)

        # Gritty stereo sawtooths + sub sine
        saw1 = saw(freq, lt)
        saw2 = saw(freq * 1.006, lt)
        saw3 = saw(freq * 0.994, lt)
        sub = sine(root_f / 2.0, lt) * 0.9

        b_l = np.tanh((saw1 * 0.7 + saw2 * 0.5 + sub) * 2.8) * env * 0.55
        b_r = np.tanh((saw1 * 0.7 + saw3 * 0.5 + sub) * 2.8) * env * 0.55

        bass_left[s : s + note_len] += b_l
        bass_right[s : s + note_len] += b_r

    # Sidechain pumping on bassline: dips when kick hits
    sidechain = np.ones(total_samples, dtype=np.float64)
    for b in range(total_beats):
        beat_t = b * BEAT_LEN
        if 8.0 <= beat_t < 37.5:
            kick_s = int(beat_t * RATE)
            duck_len = int(0.24 * RATE)
            if kick_s + duck_len < total_samples:
                duck_env = 0.22 + 0.78 * (np.arange(duck_len) / duck_len) ** 1.8
                sidechain[kick_s : kick_s + duck_len] = np.minimum(
                    sidechain[kick_s : kick_s + duck_len], duck_env
                )

    left += bass_left * sidechain
    right += bass_right * sidechain

    # ── 3. 16TH-NOTE DRIVING ARPEGGIATOR LEAD (ENTERS AT 13s, PEAKS AT DATA/PROGRESS) ──
    # High-octane synth arpeggio bouncing through minor scales
    arp_scale = [1.0, 1.2, 1.5, 1.78, 2.0, 2.4, 2.0, 1.5]  # minor pentatonic/blues
    num_sixteenths = int(DURATION / SIXTEENTH)

    arp_left = np.zeros(total_samples, dtype=np.float64)
    arp_right = np.zeros(total_samples, dtype=np.float64)

    for step in range(num_sixteenths):
        step_t = step * SIXTEENTH
        if step_t < 13.0 or step_t >= 36.5:
            continue

        s = int(step_t * RATE)
        note_samples = int(SIXTEENTH * 0.88 * RATE)
        if s + note_samples >= total_samples:
            continue

        lt = np.arange(note_samples, dtype=np.float64) / RATE
        root_f = get_root_at(step_t)
        scale_mult = arp_scale[step % len(arp_scale)]
        note_freq = root_f * 2.0 * scale_mult

        # Quick snappy pluck
        env = np.exp(-lt * 28.0)

        # Square + saw digital lead with detune
        lead_tone = (square(note_freq, lt) * 0.5 + saw(note_freq * 1.004, lt) * 0.5) * env
        lead_tone_r = (square(note_freq * 0.996, lt) * 0.5 + saw(note_freq, lt) * 0.5) * env

        # Energy ramp: louder at Data (18s+) and maximum at Progress (28s+)
        volume_mult = 0.22
        if step_t >= 18.0:
            volume_mult = 0.32
        if step_t >= 28.0:
            volume_mult = 0.42

        arp_left[s : s + note_samples] += lead_tone * volume_mult
        arp_right[s : s + note_samples] += lead_tone_r * volume_mult

    # Stereo ping-pong delay on arpeggio
    delay_samples = int(SIXTEENTH * 1.5 * RATE)
    if delay_samples < total_samples:
        arp_left[delay_samples:] += arp_right[:-delay_samples] * 0.35
        arp_right[delay_samples:] += arp_left[:-delay_samples] * 0.35

    left += arp_left
    right += arp_right

    # ── 4. CINEMATIC BRASS / BRAAM HITS (AT MAJOR MILESTONES) ───────────────
    # Hits at:
    # 8.0s:  "MEET WINTER ARC"
    # 24.0s: "LOG -> SEE -> UNDERSTAND -> IMPROVE"
    # 28.5s: "YOUR PROGRESS SHOULD BE VISIBLE"
    braam_moments = [8.0, 24.0, 28.5]
    for bm in braam_moments:
        s = int(bm * RATE)
        bl, br = make_braam(1.5, freq=55.0)
        blen = len(bl)
        if s + blen < total_samples:
            left[s : s + blen] += bl * 0.75
            right[s : s + blen] += br * 0.75

    # ── 5. TENSION RISERS BEFORE KEY TRANSITIONS ────────────────────────────
    # 6.0s -> 8.0s (into Drop 1)
    # 22.0s -> 24.0s (into System Climax)
    # 26.8s -> 28.5s (into Progress Climax)
    riser_moments = [
        (6.0, 2.0),
        (22.0, 2.0),
        (26.8, 1.7),
    ]
    for r_start, r_dur in riser_moments:
        s = int(r_start * RATE)
        rl, rr = make_riser(r_dur)
        rlen = len(rl)
        if s + rlen < total_samples:
            left[s : s + rlen] += rl
            right[s : s + rlen] += rr

    # ── 6. ATMOSPHERIC INTRO PADS & SUB PULSE (0s - 8s) ─────────────────────
    intro_samples = int(8.2 * RATE)
    it = np.arange(intro_samples, dtype=np.float64) / RATE
    intro_pad = (
        sine(110.0, it) * 0.25 +
        saw(110.0 * 1.003, it) * 0.15 +
        sine(55.0, it) * 0.35 +
        saw(220.0, it) * 0.08
    ) * np.linspace(0.2, 0.9, intro_samples)

    left[:intro_samples] += intro_pad * 0.5
    right[:intro_samples] += intro_pad * 0.5

    # ── 7. MASTER LIMITING & ANALOG SATURATION ──────────────────────────────
    # Fade in over first 0.6s
    fi = int(0.6 * RATE)
    left[:fi] *= np.linspace(0.0, 1.0, fi)
    right[:fi] *= np.linspace(0.0, 1.0, fi)

    # Fade out over final 1.8s
    fo = int(1.8 * RATE)
    left[-fo:] *= np.linspace(1.0, 0.0, fo)
    right[-fo:] *= np.linspace(1.0, 0.0, fo)

    # Hard-hitting gym saturation limiter: punchy, upfront, loud
    left = np.tanh(left * 1.6) * 0.88
    right = np.tanh(right * 1.6) * 0.88

    return left, right


def main() -> None:
    np.random.seed(42)
    OUT.mkdir(parents=True, exist_ok=True)
    print("Generating motivational high-energy track...")
    left, right = generate_motivational_track()
    stereo = np.column_stack([left, right]).reshape(-1)

    target_40s = OUT / "winter-arc-40s-audio.wav"
    with wave.open(str(target_40s), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes((stereo * 32767).astype(np.int16).tobytes())

    print(f"✓ Generated 40s motivational music → {target_40s}")

    # Also update 30s version just in case
    # Crop to 30s with 1.5s fadeout
    samples_30s = int(30.0 * RATE)
    l_30s = left[:samples_30s].copy()
    r_30s = right[:samples_30s].copy()
    fo30 = int(1.5 * RATE)
    l_30s[-fo30:] *= np.linspace(1.0, 0.0, fo30)
    r_30s[-fo30:] *= np.linspace(1.0, 0.0, fo30)
    stereo_30s = np.column_stack([l_30s, r_30s]).reshape(-1)

    target_30s = OUT / "winter-arc-30s-audio.wav"
    with wave.open(str(target_30s), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes((stereo_30s * 32767).astype(np.int16).tobytes())

    print(f"✓ Generated 30s motivational music → {target_30s}")


if __name__ == "__main__":
    main()

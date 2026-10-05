#!/usr/bin/env python3
"""Fast production renderer for the Winter Arc campaign masters.

The editable visual master lives in video/WinterArcAd.tsx. This renderer uses
the same timings and assets while avoiding a browser launch for every frame in
CI/dev environments where a full Remotion render is impractical.
"""

from __future__ import annotations

import math
import subprocess
import tempfile
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "video-assets"
FPS = 30
DURATION = 60
BLUE = (255, 155, 46)
WHITE = (252, 248, 244)
MUTED = (200, 183, 168)
FONT = cv2.FONT_HERSHEY_SIMPLEX
FONT_BOLD = cv2.FONT_HERSHEY_DUPLEX

SCENES = [
    (0, 4, "intro"),
    (4, 6, "home"),
    (10, 6, "sleep"),
    (16, 7, "fitness"),
    (23, 6, "food"),
    (29, 7, "progress"),
    (36, 5, "transformation"),
    (41, 4, "cta"),
]

PRODUCTS = {
    "home": ("home.png", "YOUR 90-DAY ARC", "Everything that moves you forward, in one calm place.", BLUE, (0.77, 0.32)),
    "sleep": ("sleep.png", "BUILD YOUR RHYTHM", "See the pattern. Protect the routine.", (255, 131, 159), (0.84, 0.69)),
    "fitness": ("fitness.png", "MAKE EFFORT VISIBLE", "Track the work that compounds.", (255, 200, 34), (0.89, 0.58)),
    "food": ("food.png", "FUEL THE ARC", "Small choices become a stronger baseline.", (61, 154, 255), (0.82, 0.33)),
    "progress": ("progress.png", "WATCH CONSISTENCY GROW", "Progress is not a feeling. It is a trail.", (156, 223, 72), (0.75, 0.38)),
    "transformation": ("transformation.png", "KEEP THE PROMISE", "Your future self is built in ordinary days.", BLUE, (0.80, 0.32)),
}


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def fade_in_out(local_frame: int, total_frames: int, length: int = 18) -> float:
    return min(1.0, local_frame / length, (total_frames - local_frame) / length)


def fit_image(source: np.ndarray, width: int, height: int, vertical: bool) -> np.ndarray:
    app = source[150:, :, :]
    if vertical:
        scale = height / app.shape[0]
        resized = cv2.resize(app, (round(app.shape[1] * scale), height), interpolation=cv2.INTER_AREA)
        left = max(0, (resized.shape[1] - width) // 2)
        result = resized[:, left : left + width]
        if result.shape[1] < width:
            result = cv2.copyMakeBorder(result, 0, 0, 0, width - result.shape[1], cv2.BORDER_REPLICATE)
        return result
    scale = width / app.shape[1]
    resized = cv2.resize(app, (width, round(app.shape[0] * scale)), interpolation=cv2.INTER_AREA)
    return resized[:height, :]


def background(bg: np.ndarray, width: int, height: int) -> np.ndarray:
    canvas = cv2.resize(bg, (width, height), interpolation=cv2.INTER_AREA).copy()
    darkness = np.zeros_like(canvas)
    for x in range(width):
        amount = 0.78 + 0.16 * (x / max(1, width - 1))
        darkness[:, x] = np.array([11, 17, 23], dtype=np.uint8)
        canvas[:, x] = cv2.addWeighted(canvas[:, x], 1 - amount, darkness[:, x], amount, 0)
    # thin technical grid gives the campaign a subtle product-film texture
    for x in range(0, width, 72):
        cv2.line(canvas, (x, 0), (x, height), (35, 63, 83), 1, cv2.LINE_AA)
    for y in range(0, height, 72):
        cv2.line(canvas, (0, y), (width, y), (35, 63, 83), 1, cv2.LINE_AA)
    return canvas


def text(canvas: np.ndarray, value: str, origin: tuple[int, int], size: float, color=WHITE, bold=False, thickness: int = 1) -> None:
    cv2.putText(canvas, value, origin, FONT_BOLD if bold else FONT, size, color, thickness, cv2.LINE_AA)


def logo(canvas: np.ndarray, x: int, y: int, scale: float = 1.0, compact: bool = False) -> None:
    pts = np.array([[x, y + round(28 * scale)], [x + round(14 * scale), y], [x + round(22 * scale), y + round(13 * scale)], [x + round(28 * scale), y + round(6 * scale)], [x + round(45 * scale), y + round(28 * scale)]], dtype=np.int32)
    cv2.polylines(canvas, [pts], True, BLUE, max(1, round(2 * scale)), cv2.LINE_AA)
    cv2.line(canvas, (x - round(2 * scale), y + round(28 * scale)), (x + round(47 * scale), y + round(28 * scale)), BLUE, max(1, round(2 * scale)), cv2.LINE_AA)
    text(canvas, "WINTER", (x + round(57 * scale), y + round(15 * scale)), 0.62 * scale, WHITE, True, max(1, round(scale)))
    text(canvas, "ARC", (x + round(57 * scale) + round(104 * scale), y + round(15 * scale)), 0.62 * scale, BLUE, True, max(1, round(scale)))
    if not compact:
        text(canvas, "DISCIPLINE BUILDS FREEDOM", (x + round(57 * scale), y + round(31 * scale)), 0.26 * scale, MUTED, True, 1)


def draw_cursor(canvas: np.ndarray, x: int, y: int, scale: float = 1.0) -> None:
    points = np.array([[x, y], [x + round(18 * scale), y + round(46 * scale)], [x + round(24 * scale), y + round(34 * scale)], [x + round(38 * scale), y + round(46 * scale)], [x + round(45 * scale), y + round(39 * scale)], [x + round(30 * scale), y + round(28 * scale)], [x + round(43 * scale), y + round(25 * scale)]], dtype=np.int32)
    cv2.fillPoly(canvas, [points], WHITE)
    cv2.polylines(canvas, [points], True, (22, 35, 48), 2, cv2.LINE_AA)


def draw_product(canvas: np.ndarray, scene: str, local: int, vertical: bool, sources: dict[str, np.ndarray]) -> None:
    width, height = canvas.shape[1], canvas.shape[0]
    asset, title, caption, accent, cursor = PRODUCTS[scene]
    total_frames = next(duration for start, duration, kind in SCENES if kind == scene) * FPS
    fade = fade_in_out(local, total_frames)
    intro = clamp(local / 24, 0, 1)
    if vertical:
        frame_w, frame_h, left, top = min(width - 110, 930), 760, 55, 570
        title_y = 175
        caption_y = height - 180
        scale = 0.91 + 0.09 * intro
    else:
        frame_w, frame_h, left, top = min(width - 260, 1660), 760, 130, 210
        title_y = 133
        caption_y = height - 112
        scale = 0.93 + 0.07 * intro
    frame_w = round(frame_w * scale)
    frame_h = round(frame_h * scale)
    body_h = frame_h - 60
    left = (width - frame_w) // 2
    top = top + round((1 - intro) * 45)
    text(canvas, title, ((width - cv2.getTextSize(title, FONT_BOLD, 0.62 if not vertical else 0.7, 2)[0][0]) // 2, title_y), 0.62 if not vertical else 0.7, accent, True, 2)
    cv2.rectangle(canvas, (left, top), (left + frame_w, top + frame_h), (10, 20, 31), -1)
    cv2.rectangle(canvas, (left, top), (left + frame_w, top + frame_h), (100, 145, 174), 1)
    for i, color in enumerate([(100, 107, 255), (97, 209, 255), (110, 220, 132)]):
        cv2.circle(canvas, (left + 25 + i * 22, top + 27), 5, color, -1, cv2.LINE_AA)
    text(canvas, "winterarc.app / " + title.lower().replace(" ", "-"), (left + 105, top + 32), 0.36 if not vertical else 0.42, (137, 156, 174), False, 1)
    text(canvas, "LIVE DEMO", (left + frame_w - 115, top + 32), 0.32, accent, True, 1)
    body = fit_image(sources[scene], frame_w - 2, body_h - 2, vertical)
    roi = canvas[top + 60 : top + frame_h - 1, left + 1 : left + frame_w - 1]
    roi[: body.shape[0], : body.shape[1]] = body
    ring_x = left + round(frame_w * cursor[0])
    ring_y = top + 60 + round((body_h - 12) * cursor[1])
    cv2.rectangle(canvas, (ring_x, ring_y), (ring_x + 96, ring_y + 46), accent, 2, cv2.LINE_AA)
    pulse = 0.45 + 0.4 * (0.5 + 0.5 * math.sin(local / 4))
    cv2.circle(canvas, (ring_x + 48, ring_y + 23), round(52 * pulse), accent, 1, cv2.LINE_AA)
    draw_cursor(canvas, ring_x + 44, ring_y + 19, 0.63 if not vertical else 0.7)
    (w, h), _ = cv2.getTextSize(caption, FONT_BOLD, 0.7 if vertical else 0.61, 2)
    cv2.rectangle(canvas, ((width - w) // 2 - 22, caption_y - h - 19), ((width + w) // 2 + 22, caption_y + 13), (4, 11, 19), -1)
    text(canvas, caption, ((width - w) // 2, caption_y), 0.7 if vertical else 0.61, WHITE, True, 2)


def render(format_name: str, width: int, height: int, output: Path) -> None:
    bg = cv2.imread(str(ROOT / "public" / "bg-mountains.png"))
    sources = {name: cv2.imread(str(ASSET_DIR / filename)) for name, (filename, *_rest) in PRODUCTS.items()}
    temp = tempfile.NamedTemporaryFile(prefix=f"winter-arc-{format_name}-", suffix=".mp4", delete=False)
    temp.close()
    writer = cv2.VideoWriter(temp.name, cv2.VideoWriter_fourcc(*"mp4v"), FPS, (width, height))
    if not writer.isOpened():
        raise RuntimeError("OpenCV could not open its MP4 writer")
    for frame_no in range(DURATION * FPS):
        second = frame_no / FPS
        canvas = background(bg, width, height)
        logo(canvas, 46 if width < height else 58, 42 if width > height else 54, 0.65 if width < height else 0.62, True)
        text(canvas, "90 DAY CHALLENGE", (width - (205 if width > height else 225), 67 if width > height else 76), 0.42 if width > height else 0.46, (168, 190, 207), True, 1)
        kind = SCENES[-1][2]
        local = frame_no
        for start, duration, candidate in SCENES:
            if start <= second < start + duration:
                kind = candidate
                local = frame_no - start * FPS
                break
        if kind == "intro":
            rise = clamp(local / 22, 0, 1)
            logo(canvas, width // 2 - 170, height // 2 - (190 if width > height else 320), 1.7 if width > height else 1.45)
            text(canvas, "Add once.", (width // 2 - (230 if width > height else 210), height // 2 - (15 if width > height else 110)), 1.7 if width > height else 1.8, WHITE, True, 3)
            text(canvas, "Log daily.", (width // 2 - (230 if width > height else 210), height // 2 + (70 if width > height else -25)), 1.7 if width > height else 1.8, WHITE, True, 3)
            text(canvas, "See the trend.", (width // 2 - (230 if width > height else 210), height // 2 + (155 if width > height else 60)), 1.7 if width > height else 1.8, BLUE, True, 3)
            text(canvas, "A calmer system for becoming who you said you would.", (width // 2 - (305 if width > height else 300), height // 2 + (230 if width > height else 150)), 0.63 if width > height else 0.7, MUTED, False, 1)
            line_y = height - (185 if width > height else 280)
            cv2.line(canvas, (width // 4, line_y), (width * 3 // 4, line_y), BLUE, 2, cv2.LINE_AA)
        elif kind == "cta":
            logo(canvas, width // 2 - 170, height // 2 - (220 if width > height else 430), 1.7 if width > height else 1.45)
            text(canvas, "Start your", (width // 2 - (220 if width > height else 190), height // 2 - (40 if width > height else 160)), 1.75 if width > height else 1.9, WHITE, True, 3)
            text(canvas, "Winter Arc.", (width // 2 - (220 if width > height else 190), height // 2 + (55 if width > height else -55)), 1.75 if width > height else 1.9, BLUE, True, 3)
            text(canvas, "One arc. One day at a time.", (width // 2 - 168, height // 2 + (125 if width > height else 35)), 0.68, MUTED, False, 1)
            cv2.rectangle(canvas, (width // 2 - 205, height // 2 + (190 if width > height else 110)), (width // 2 + 205, height // 2 + (250 if width > height else 170)), BLUE, -1)
            text(canvas, "DISCIPLINE BUILDS FREEDOM", (width // 2 - 166, height // 2 + (228 if width > height else 148)), 0.55, WHITE, True, 1)
        else:
            draw_product(canvas, kind, local, width < height, sources)
        writer.write(canvas)
        if frame_no % 150 == 0:
            print(f"{format_name}: frame {frame_no}/{DURATION * FPS}")
    writer.release()
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    audio = ASSET_DIR / "winter-arc-audio.wav"
    subprocess.run([ffmpeg, "-y", "-i", temp.name, "-i", str(audio), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(output)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    Path(temp.name).unlink(missing_ok=True)
    print(f"wrote {output}")


if __name__ == "__main__":
    render("landscape", 1920, 1080, ROOT / "public" / "winter-arc-ad.mp4")
    render("vertical", 1080, 1920, ROOT / "public" / "winter-arc-ad-vertical.mp4")

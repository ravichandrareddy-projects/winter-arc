#!/usr/bin/env python3
"""Render the Winter Arc ad following the exact user storyboard."""

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
DURATION = 60  # seconds
BLUE = (255, 155, 46)      # Winter Arc blue in BGR
WHITE = (252, 248, 244)
MINT = (76, 223, 156)      # Mint green for sleep/wake
FONT = cv2.FONT_HERSHEY_SIMPLEX
FONT_BOLD = cv2.FONT_HERSHEY_DUPLEX

# Scene definitions: (start_time, duration, kind)
SCENES = [
    (0, 5, "hook"),           # 0-5s: HOOK
    (5, 6, "winterArcEnters"), # 5-11s: WINTER ARC ENTERS
    (11, 7, "homeTracking"),   # 11-18s: HOME/DAILY TRACKING
    (18, 7, "sleep"),          # 18-25s: SLEEP
    (25, 6, "wakeUp"),         # 25-31s: WAKE UP
    (31, 8, "fitnessTransformation"), # 31-39s: FITNESS/TRANSFORMATION
    (39, 6, "food"),           # 39-45s: FOOD
    (45, 8, "progress"),       # 45-53s: PROGRESS
    (53, 4, "completeSystem"), # 53-57s: COMPLETE SYSTEM
    (57, 3, "finalHero"),      # 57-60s: FINAL HERO
]

# Text overlays for each scene (shown at the bottom)
SCENE_TEXTS = {
    "hook": [
        "You do not need a perfect day.",
        "You need a system you can return to."
    ],
    "winterArcEnters": [
        "Set your ninety day goal.",
        "Track the habits that move you forward."
    ],
    "homeTracking": [
        "Turn every small action into visible progress."
    ],
    "sleep": [
        "Build your rhythm."
    ],
    "wakeUp": [
        "Rise with intention."
    ],
    "fitnessTransformation": [
        "Track the work that compounds."
    ],
    "food": [
        "Fuel your arc."
    ],
    "progress": [
        "Watch your consistency grow."
    ],
    "completeSystem": [
        "One system. Everything connected."
    ],
    "finalHero": [
        "Start your Winter Arc.",
        "One arc. One day at a time."
    ]
}

# Background images for each scene
SCENE_BACKGROUNDS = {
    "hook": "bg-mountains.png",
    "winterArcEnters": "bg-mountains.png",
    "homeTracking": "home.png",
    "sleep": "sleep.png",
    "wakeUp": "wake-up.png",
    "fitnessTransformation": "fitness.png",
    "food": "food.png",
    "progress": "progress.png",
    "completeSystem": "bg-mountains.png",  # Will show four quadrants
    "finalHero": "bg-mountains.png"
}

# Accent colors for each scene (BGR)
SCENE_ACCENTS = {
    "hook": BLUE,
    "winterArcEnters": BLUE,
    "homeTracking": WHITE,
    "sleep": MINT,
    "wakeUp": MINT,
    "fitnessTransformation": BLUE,
    "food": (61, 154, 255),  # Blue from food.png
    "progress": (156, 223, 72),  # Green from progress.png
    "completeSystem": WHITE,
    "finalHero": BLUE
}

def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))

def ease_in_out(t: float) -> float:
    """Smooth easing function."""
    return t < 0.5 and 2 * t * t or -1 + (4 - 2 * t) * t

def fit_image(source: np.ndarray, width: int, height: int, vertical: bool = False) -> np.ndarray:
    """Fit image to frame, preserving aspect ratio."""
    # Remove top padding (status bar area) from screenshots
    app = source[150:, :, :] if source.shape[0] > 150 else source
    if vertical:
        scale = height / app.shape[0]
        resized = cv2.resize(app, (int(app.shape[1] * scale), height), interpolation=cv2.INTER_AREA)
        left = max(0, (resized.shape[1] - width) // 2)
        result = resized[:, left:left + width]
        if result.shape[1] < width:
            result = cv2.copyMakeBorder(result, 0, 0, 0, width - result.shape[1], cv2.BORDER_REPLICATE)
        return result
    scale = width / app.shape[1]
    resized = cv2.resize(app, (width, int(app.shape[0] * scale)), interpolation=cv2.INTER_AREA)
    return resized[:height, :]

def background(bg: np.ndarray, width: int, height: int) -> np.ndarray:
    """Apply darkened background with technical grid."""
    canvas = cv2.resize(bg, (width, height), interpolation=cv2.INTER_AREA).copy()
    darkness = np.zeros_like(canvas)
    for x in range(width):
        amount = 0.78 + 0.16 * (x / max(1, width - 1))
        darkness[:, x] = np.array([11, 17, 23], dtype=np.uint8)
        canvas[:, x] = cv2.addWeighted(canvas[:, x], 1 - amount, darkness[:, x], amount, 0)
    # Thin technical grid
    for x in range(0, width, 72):
        cv2.line(canvas, (x, 0), (x, height), (35, 63, 83), 1, cv2.LINE_AA)
    for y in range(0, height, 72):
        cv2.line(canvas, (0, y), (width, y), (35, 63, 83), 1, cv2.LINE_AA)
    return canvas

def text(canvas: np.ndarray, value: str, origin: tuple[int, int], size: float, color=WHITE, bold=False, thickness: int = 1) -> None:
    """Draw text on canvas."""
    cv2.putText(canvas, value, (int(origin[0]), int(origin[1])), FONT_BOLD if bold else FONT, size, color, thickness, cv2.LINE_AA)

def logo(canvas: np.ndarray, x: int, y: int, scale: float = 1.0, compact: bool = False) -> None:
    """Draw Winter Arc logo."""
    pts = np.array([[x, y + int(28 * scale)], [x + int(14 * scale), y], [x + int(22 * scale), y + int(13 * scale)], [x + int(28 * scale), y + int(6 * scale)], [x + int(45 * scale), y + int(28 * scale)]], dtype=np.int32)
    cv2.polylines(canvas, [pts], True, BLUE, max(1, int(2 * scale)), cv2.LINE_AA)
    cv2.line(canvas, (x - int(2 * scale), y + int(28 * scale)), (x + int(47 * scale), y + int(28 * scale)), BLUE, max(1, int(2 * scale)), cv2.LINE_AA)
    text(canvas, "WINTER", (x + int(57 * scale), y + int(15 * scale)), 0.62 * scale, WHITE, True, max(1, int(scale)))
    text(canvas, "ARC", (x + int(57 * scale) + int(104 * scale), y + int(15 * scale)), 0.62 * scale, BLUE, True, max(1, int(scale)))
    if not compact:
        text(canvas, "DISCIPLINE BUILDS FREEDOM", (x + int(57 * scale), y + int(31 * scale)), 0.26 * scale, MUTED, True, 1)

def draw_cursor(canvas: np.ndarray, x: int, y: int, scale: float = 1.0, color=WHITE) -> None:
    """Draw a cursor pointer."""
    points = np.array([[x, y], [x + int(18 * scale), y + int(46 * scale)], [x + int(24 * scale), y + int(34 * scale)], [x + int(38 * scale), y + int(46 * scale)], [x + int(45 * scale), y + int(39 * scale)], [x + int(30 * scale), y + int(28 * scale)], [x + int(43 * scale), y + int(25 * scale)]], dtype=np.int32)
    cv2.fillPoly(canvas, [points], color)
    cv2.polylines(canvas, [points], True, (22, 35, 48), 2, cv2.LINE_AA)

def render_quadrants(canvas: np.ndarray, width: int, height: int, sources: dict[str, np.ndarray], progress: float) -> None:
    """Render four quadrants with UI screenshots."""
    quadrant_width = width * 0.45
    quadrant_height = height * 0.4
    margin = width * 0.05

    # Home (top-left)
    home_roi = fit_image(sources["home"], int(quadrant_width - 2), int(quadrant_height - 2))
    canvas[int(height * 0.1):int(height * 0.1) + home_roi.shape[0], int(margin):int(margin) + home_roi.shape[1]] = home_roi

    # Sleep (top-right)
    sleep_roi = fit_image(sources["sleep"], int(quadrant_width - 2), int(quadrant_height - 2), vertical=True)
    canvas[int(height * 0.1):int(height * 0.1) + sleep_roi.shape[0], int(width * 0.5):int(width * 0.5) + sleep_roi.shape[1]] = sleep_roi

    # Fitness (bottom-left)
    fitness_roi = fit_image(sources["fitness"], int(quadrant_width - 2), int(quadrant_height - 2))
    canvas[int(height * 0.55):int(height * 0.55) + fitness_roi.shape[0], int(margin):int(margin) + fitness_roi.shape[1]] = fitness_roi

    # Food (bottom-right)
    food_roi = fit_image(sources["food"], int(quadrant_width - 2), int(quadrant_height - 2), vertical=True)
    canvas[int(height * 0.55):int(height * 0.55) + food_roi.shape[0], int(width * 0.5):int(width * 0.5) + food_roi.shape[1]] = food_roi

    # Add subtle borders to quadrants
    if progress > 0.5:
        alpha = clamp((progress - 0.5) * 2, 0, 1)
        overlay = canvas.copy()
        cv2.rectangle(overlay, (int(margin), int(height * 0.1)), (int(margin + quadrant_width), int(height * 0.1 + quadrant_height)), (20, 30, 40), -1)
        cv2.addWeighted(overlay, alpha * 0.3, canvas, 1 - alpha * 0.3, 0, canvas)
        cv2.rectangle(overlay, (int(width * 0.5), int(height * 0.1)), (int(width * 0.5 + quadrant_width), int(height * 0.1 + quadrant_height)), (20, 30, 40), -1)
        cv2.addWeighted(overlay, alpha * 0.3, canvas, 1 - alpha * 0.3, 0, canvas)
        cv2.rectangle(overlay, (int(margin), int(height * 0.55)), (int(margin + quadrant_width), int(height * 0.55 + quadrant_height)), (20, 30, 40), -1)
        cv2.addWeighted(overlay, alpha * 0.3, canvas, 1 - alpha * 0.3, 0, canvas)
        cv2.rectangle(overlay, (int(width * 0.5), int(height * 0.55)), (int(width * 0.5 + quadrant_width), int(height * 0.55 + quadrant_height)), (20, 30, 40), -1)
        cv2.addWeighted(overlay, alpha * 0.3, canvas, 1 - alpha * 0.3, 0, canvas)

def render_frame(frame_no: int, width: int, height: int, sources: dict[str, np.ndarray]) -> np.ndarray:
    """Render a single frame."""
    second = frame_no / FPS
    bg = cv2.imread(str(ROOT / "public" / "bg-mountains.png"))
    canvas = background(bg, width, height)

    # Find current scene
    progress = 0.0
    kind = "hook"
    local_frame = frame_no

    for start, duration, scene_kind in SCENES:
        if start <= second < start + duration:
            kind = scene_kind
            local_frame = frame_no - start * FPS
            progress = local_frame / (duration * FPS)
            break

    # Apply scene-specific rendering
    if kind == "hook":
        # Background: mountain view with advancing opacity
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        opacity = 0.7 + 0.3 * ease_in_out(progress * 2)  # Faster ramp-up
        canvas = cv2.addWeighted(canvas, 1 - opacity, bg_resized, opacity, 0)

        # Text overlays with staggered appearance
        if progress > 0.2:
            text_progress = ease_in_out((progress - 0.2) * 1.25)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 300, int(height * 0.4)), 1.8, WHITE, True, 3)
        if progress > 0.4:
            text_progress = ease_in_out((progress - 0.4) * 1.25)
            text(canvas, SCENE_TEXTS[kind][1], (width // 2 - 300, int(height * 0.5)), 1.8, WHITE, True, 3)

    elif kind == "winterArcEnters":
        # Background: sliding in from left
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        x_offset = int(-width * (1 - ease_in_out(progress)))
        canvas[x_offset:x_offset + width, 0:height] = bg_resized[max(0, -x_offset):min(width, width - x_offset), 0:height]

        # Logo sliding in from left
        logo_x = int(width * (0.1 - 0.3 * (1 - ease_in_out(progress))))
        logo_y = int(height * 0.15)
        logo(canvas, logo_x, logo_y, 0.6 + 0.4 * ease_in_out(progress), False)

        # Text overlays
        if progress > 0.5:
            text_progress = ease_in_out((progress - 0.5) * 2)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 250, int(height * 0.4)), 1.4, WHITE, True, 2)
        if progress > 0.6:
            text_progress = ease_in_out((progress - 0.6) * 2.5)
            text(canvas, SCENE_TEXTS[kind][1], (width // 2 - 250, int(height * 0.5)), 1.4, WHITE, True, 2)

    elif kind == "homeTracking":
        # Background: home screen
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        opacity = 0.8 + 0.2 * ease_in_out(progress)
        canvas = cv2.addWeighted(canvas, 1 - opacity, bg_resized, opacity, 0)

        # Cursor interactions
        if progress > 0.2:
            cursor_x = width * 0.5 - 100
            cursor_y = height * 0.4 + math.sin(progress * 10) * 5
            cursor_size = 0.8 + 0.2 * math.sin(progress * 20)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, WHITE)
        if progress > 0.4:
            cursor_x = width * 0.5
            cursor_y = height * 0.45 + math.sin(progress * 10) * 5
            cursor_size = 0.8 + 0.2 * math.sin(progress * 20)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, WHITE)
        if progress > 0.6:
            cursor_x = width * 0.5 + 100
            cursor_y = height * 0.4 + math.sin(progress * 10) * 5
            cursor_size = 0.8 + 0.2 * math.sin(progress * 20)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, WHITE)

        # Text overlay
        if progress > 0.7:
            text_progress = ease_in_out((progress - 0.7) * 1.5)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 280, int(height * 0.75)), 1.2, WHITE, True, 2)

    elif kind == "sleep":
        # Background: sleep screen
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        opacity = 0.8 + 0.2 * ease_in_out(progress)
        canvas = cv2.addWeighted(canvas, 1 - opacity, bg_resized, opacity, 0)

        # Cursor dragging sleep time
        if progress > 0.3:
            cursor_x = width * 0.4 + (progress - 0.3) * 200
            cursor_y = height * 0.5
            draw_cursor(canvas, int(cursor_x), int(cursor_y), 0.8, MINT)

        # Text overlay
        if progress > 0.6:
            text_progress = ease_in_out((progress - 0.6) * 1.5)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 180, int(height * 0.75)), 1.2, WHITE, True, 2)

    elif kind == "wakeUp":
        # Background: wake up screen
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        opacity = 0.8 + 0.2 * ease_in_out(progress)
        canvas = cv2.addWeighted(canvas, 1 - opacity, bg_resized, opacity, 0)

        # Cursor toggling wake time
        if progress > 0.4:
            cursor_x = width * 0.5
            cursor_y = height * 0.4 + (progress - 0.4) * 100
            draw_cursor(canvas, int(cursor_x), int(cursor_y), 0.8, MINT)

        # Text overlay
        if progress > 0.7:
            text_progress = ease_in_out((progress - 0.7) * 1.5)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 180, int(height * 0.75)), 1.2, WHITE, True, 2)

    elif kind == "fitnessTransformation":
        # Background: fitness screen
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        opacity = 0.8 + 0.2 * ease_in_out(progress)
        canvas = cv2.addWeighted(canvas, 1 - opacity, bg_resized, opacity, 0)

        # Cursor interactions
        if progress > 0.2:
            cursor_x = width * 0.8
            cursor_y = height * 0.2
            cursor_size = 0.8 + 0.2 * math.sin(progress * 30)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, BLUE)
        if progress > 0.4:
            cursor_x = width * 0.3
            cursor_y = height * 0.5
            cursor_size = 0.8 + 0.2 * math.sin(progress * 30)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, BLUE)
        if progress > 0.6:
            cursor_x = width * 0.7
            cursor_y = height * 0.6
            cursor_size = 0.8 + 0.2 * math.sin(progress * 30)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, BLUE)

        # Text overlay
        if progress > 0.7:
            text_progress = ease_in_out((progress - 0.7) * 1.5)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 220, int(height * 0.75)), 1.2, WHITE, True, 2)

    elif kind == "food":
        # Background: food screen
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        opacity = 0.8 + 0.2 * ease_in_out(progress)
        canvas = cv2.addWeighted(canvas, 1 - opacity, bg_resized, opacity, 0)

        # Cursor interactions
        if progress > 0.3:
            cursor_x = width * 0.5
            cursor_y = height * 0.5
            cursor_size = 0.8 + 0.2 * math.sin(progress * 20)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, BLUE)
        if progress > 0.5:
            cursor_x = width * 0.8
            cursor_y = height * 0.8
            cursor_size = 0.8 + 0.2 * math.sin(progress * 20)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, BLUE)

        # Text overlay
        if progress > 0.6:
            text_progress = ease_in_out((progress - 0.6) * 1.5)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 120, int(height * 0.75)), 1.2, WHITE, True, 2)

    elif kind == "progress":
        # Background: progress screen
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        opacity = 0.8 + 0.2 * ease_in_out(progress)
        canvas = cv2.addWeighted(canvas, 1 - opacity, bg_resized, opacity, 0)

        # Cursor interactions
        if progress > 0.3:
            cursor_x = width * 0.3
            cursor_y = height * 0.4
            cursor_size = 0.8 + 0.2 * math.sin(progress * 20)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, MINT)
        if progress > 0.5:
            cursor_x = width * 0.7
            cursor_y = height * 0.6
            cursor_size = 0.8 + 0.2 * math.sin(progress * 20)
            draw_cursor(canvas, int(cursor_x), int(cursor_y), cursor_size, MINT)

        # Text overlay
        if progress > 0.6:
            text_progress = ease_in_out((progress - 0.6) * 1.5)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 220, int(height * 0.75)), 1.2, WHITE, True, 2)

    elif kind == "completeSystem":
        # Background: mountain base
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        canvas = cv2.addWeighted(canvas, 0.2, bg_resized, 0.8, 0)

        # Four quadrants with UI
        if progress > 0.0:  # Show quadrants immediately
            render_quadrants(canvas, width, height, sources, progress)

        # Text overlay
        if progress > 0.5:
            text_progress = ease_in_out((progress - 0.5) * 2)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 220, int(height * 0.8)), 1.4, WHITE, True, 2)

    elif kind == "finalHero":
        # Background: mountain view
        bg_img = cv2.imread(str(ROOT / "public" / SCENE_BACKGROUNDS[kind]))
        bg_resized = cv2.resize(bg_img, (width, height))
        canvas = cv2.addWeighted(canvas, 0.1, bg_resized, 0.9, 0)

        # Logo centered
        logo_x = width // 2 - 33
        logo_y = int(height * 0.4)
        logo(canvas, logo_x, logo_y, 0.6 + 0.4 * ease_in_out(progress), False)

        # Text overlays
        if progress > 0.3:
            text_progress = ease_in_out((progress - 0.3) * 1.5)
            text(canvas, SCENE_TEXTS[kind][0], (width // 2 - 200, int(height * 0.65)), 1.8, WHITE, True, 3)
        if progress > 0.5:
            text_progress = ease_in_out((progress - 0.5) * 2)
            text(canvas, SCENE_TEXTS[kind][1], (width // 2 - 150, int(height * 0.8)), 1.0, WHITE, True, 2)

    return canvas

def render(format_name: str, width: int, height: int, output: Path) -> None:
    """Render the full video."""
    # Load source images
    sources = {}
    for scene_key in set([scene[2] for scene in SCENES]):
        if scene_key in ["hook", "winterArcEnters", "completeSystem", "finalHero"]:
            # These use the mountain background
            continue
        # Map scene keys to actual asset filenames
        asset_map = {
            "homeTracking": "home",
            "sleep": "sleep",
            "wakeUp": "wake-up",
            "fitnessTransformation": "fitness",
            "food": "food",
            "progress": "progress"
        }
        asset_key = asset_map.get(scene_key, scene_key)
        img_path = ASSET_DIR / f"{asset_key}.png"
        if img_path.exists():
            sources[scene_key] = cv2.imread(str(img_path))
        else:
            print(f"Warning: Missing asset {img_path}")
            sources[scene_key] = np.zeros((height, width, 3), dtype=np.uint8)

    # Special handling for completeSystem - need all four
    sources["home"] = cv2.imread(str(ASSET_DIR / "home.png"))
    sources["sleep"] = cv2.imread(str(ASSET_DIR / "sleep.png"))
    sources["fitness"] = cv2.imread(str(ASSET_DIR / "fitness.png"))
    sources["food"] = cv2.imread(str(ASSET_DIR / "food.png"))

    temp = tempfile.NamedTemporaryFile(prefix=f"winter-arc-{format_name}-", suffix=".mp4", delete=False)
    temp.close()

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(temp.name, fourcc, FPS, (width, height))

    if not writer.isOpened():
        raise RuntimeError("OpenCV could not open its MP4 writer")

    total_frames = DURATION * FPS
    for frame_no in range(total_frames):
        canvas = render_frame(frame_no, width, height, sources)
        writer.write(canvas)
        if frame_no % 150 == 0:
            print(f"{format_name}: frame {frame_no}/{total_frames}")

    writer.release()

    # Add audio using FFmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    audio_path = ASSET_DIR / "winter-arc-audio.wav"
    subprocess.run([
        ffmpeg, "-y", "-i", temp.name, "-i", str(audio_path),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(output)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

    Path(temp.name).unlink(missing_ok=True)
    print(f"Generated {output}")

if __name__ == "__main__":
    render("landscape", 1920, 1080, ROOT / "public" / "winter-arc-ad.mp4")
    render("vertical", 1080, 1920, ROOT / "public" / "winter-arc-ad-vertical.mp4")
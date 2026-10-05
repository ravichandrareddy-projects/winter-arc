#!/usr/bin/env python3
"""Create placeholder PNG assets for the Winter Arc video"""

from PIL import Image, ImageDraw, ImageFont
import os

# Create video-assets directory if it doesn't exist
VIDEO_ASSETS_DIR = "/home/valtooy/winterarc/public/video-assets"
os.makedirs(VIDEO_ASSETS_DIR, exist_ok=True)

# Asset definitions with colors and labels
ASSETS = {
    "home.png": {"color": "#2e9bff", "label": "Home"},
    "sleep.png": {"color": "#9f83ff", "label": "Sleep"},
    "wake-up.png": {"color": "#48df9c", "label": "Wake Up"},
    "fitness.png": {"color": "#22c8ff", "label": "Fitness"},
    "food.png": {"color": "#ff9a3d", "label": "Food"},
    "progress.png": {"color": "#48df9c", "label": "Progress"},
    "settings.png": {"color": "#a8b7c8", "label": "Settings"},
    "transformation.png": {"color": "#2e9bff", "label": "Transformation"},
}

def create_placeholder(filename, color, label):
    """Create a simple placeholder image with colored background and label"""
    # Create image with solid color background
    img = Image.new('RGB', (800, 600), color)
    draw = ImageDraw.Draw(img)

    # Try to use a default font, fallback to default if not available
    try:
        # Try to load a larger font
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except IOError:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
        except IOError:
            font = ImageFont.load_default()

    # Calculate text position to center it
    bbox = draw.textbbox((0, 0), label, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    position = ((800 - text_width) // 2, (600 - text_height) // 2)

    # Draw white text
    draw.text(position, label, fill="white", font=font)

    # Save the image
    filepath = os.path.join(VIDEO_ASSETS_DIR, filename)
    img.save(filepath)
    print(f"Created {filepath}")

def main():
    """Create all placeholder assets"""
    for filename, info in ASSETS.items():
        create_placeholder(filename, info["color"], info["label"])

    print(f"All placeholder assets created in {VIDEO_ASSETS_DIR}")

if __name__ == "__main__":
    main()
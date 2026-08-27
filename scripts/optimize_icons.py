from pathlib import Path

from PIL import Image


ASSET_DIR = Path("/home/ubuntu/nourishloop/assets/images")
TARGETS = [
    "icon.png",
    "splash-icon.png",
    "favicon.png",
    "android-icon-foreground.png",
]


def optimize_icon(filename: str) -> None:
    path = ASSET_DIR / filename
    with Image.open(path) as image:
        image = image.convert("RGB")
        image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (1024, 1024), "#FBF8F2")
        offset = ((1024 - image.width) // 2, (1024 - image.height) // 2)
        canvas.paste(image, offset)
        canvas.save(path, format="PNG", optimize=True, compress_level=9)


for target in TARGETS:
    optimize_icon(target)
    print(f"Optimized {target}")

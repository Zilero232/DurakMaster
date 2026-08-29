"""Draws the DurakMaster app icons from the palette in ui-kit/theme/tokens.ts.

The mark is the spade from ui-kit/icons/SuitIcon over the app background, with a
gold card corner behind it. Run it from the repository root:

    python infra/icons/generate.py

It overwrites apps/mobile/assets/*.png, so the icons stay reproducible instead of
living only as binaries nobody can regenerate.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ASSETS = Path("apps/mobile/assets")

BACKGROUND = "#123048"
BACKGROUND_DEEP = "#0C2032"
GOLD = "#D9A441"
GOLD_BRIGHT = "#F0BE5C"
CARD = "#F4F1EC"

SUPERSAMPLE = 4


def _radial_background(size: int) -> Image.Image:
    """A soft vignette so the flat brand colour does not read as a placeholder."""
    image = Image.new("RGB", (size, size), BACKGROUND_DEEP)
    draw = ImageDraw.Draw(image)

    centre = size / 2
    steps = 90

    for step in range(steps, 0, -1):
        ratio = step / steps
        radius = centre * 1.25 * ratio

        blend = 1 - ratio
        colour = tuple(
            round(deep + (base - deep) * blend)
            for deep, base in zip(
                Image.new("RGB", (1, 1), BACKGROUND_DEEP).getpixel((0, 0)),
                Image.new("RGB", (1, 1), BACKGROUND).getpixel((0, 0)),
            )
        )

        draw.ellipse(
            [centre - radius, centre - radius, centre + radius, centre + radius],
            fill=colour,
        )

    return image


def _spade(draw: ImageDraw.ImageDraw, cx: float, cy: float, height: float, fill: str) -> None:
    """The spade silhouette: two lobes, a pointed crown, and a flared stem."""
    lobe = height * 0.30
    crown = cy - height * 0.46

    draw.polygon(
        [(cx, crown), (cx - lobe * 1.42, cy + lobe * 0.30), (cx + lobe * 1.42, cy + lobe * 0.30)],
        fill=fill,
    )

    for side in (-1, 1):
        draw.ellipse(
            [
                cx + side * lobe * 0.42 - lobe,
                cy - lobe * 0.30,
                cx + side * lobe * 0.42 + lobe,
                cy + lobe * 1.70,
            ],
            fill=fill,
        )

    stem_top = cy + lobe * 0.55
    stem_bottom = cy + height * 0.50
    waist = height * 0.055
    flare = height * 0.185

    draw.polygon(
        [
            (cx - waist, stem_top),
            (cx + waist, stem_top),
            (cx + flare, stem_bottom),
            (cx - flare, stem_bottom),
        ],
        fill=fill,
    )


def _card_corner(draw: ImageDraw.ImageDraw, size: int) -> None:
    """A tilted card peeking out behind the spade, so the icon reads as a card game."""
    centre = size / 2
    width = size * 0.40
    height = size * 0.56
    angle = math.radians(-14)

    corners = [
        (-width / 2, -height / 2),
        (width / 2, -height / 2),
        (width / 2, height / 2),
        (-width / 2, height / 2),
    ]

    rotated = [
        (
            centre + x * math.cos(angle) - y * math.sin(angle) + size * 0.055,
            centre + x * math.sin(angle) + y * math.cos(angle) - size * 0.02,
        )
        for x, y in corners
    ]

    draw.polygon(rotated, fill=CARD)


def _mark(size: int, *, with_background: bool, scale: float) -> Image.Image:
    """Renders at 4× and downsamples — Pillow has no antialiased polygon fill."""
    canvas = size * SUPERSAMPLE

    if with_background:
        image = _radial_background(canvas).convert("RGBA")
    else:
        image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))

    draw = ImageDraw.Draw(image)

    _card_corner(draw, canvas)
    _spade(draw, canvas / 2 - canvas * 0.045, canvas / 2, canvas * scale, GOLD)
    _spade(draw, canvas / 2 - canvas * 0.045, canvas / 2 - canvas * 0.012, canvas * scale * 0.92, GOLD_BRIGHT)

    return image.resize((size, size), Image.LANCZOS)


def _monochrome(size: int) -> Image.Image:
    """Android themed icons take a white silhouette on transparency."""
    canvas = size * SUPERSAMPLE
    image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))

    _spade(ImageDraw.Draw(image), canvas / 2, canvas / 2, canvas * 0.52, "#FFFFFF")

    return image.resize((size, size), Image.LANCZOS)


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)

    # Play Store and the launcher: the full mark on its own background.
    _mark(1024, with_background=True, scale=0.50).convert("RGB").save(ASSETS / "icon.png")

    # Adaptive icon: the foreground is masked by the launcher, so the mark sits
    # inside the safe 66% circle — hence the smaller scale.
    _mark(512, with_background=False, scale=0.38).save(ASSETS / "android-icon-foreground.png")
    Image.new("RGB", (512, 512), BACKGROUND).save(ASSETS / "android-icon-background.png")
    _monochrome(512).save(ASSETS / "android-icon-monochrome.png")

    # Splash: Expo scales this to imageWidth, so it only needs the mark.
    _mark(1024, with_background=False, scale=0.46).save(ASSETS / "splash-icon.png")

    _mark(48, with_background=True, scale=0.52).convert("RGB").save(ASSETS / "favicon.png")

    print("wrote icons to", ASSETS)


if __name__ == "__main__":
    main()

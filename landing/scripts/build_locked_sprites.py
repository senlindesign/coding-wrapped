#!/usr/bin/env python3
"""Build transparent sprite sheets from one immutable scene per animation."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


FRAME = 512
SHEET = (FRAME * 3, FRAME * 2)


def cutout(frame: Image.Image) -> Image.Image:
    rgb = np.asarray(frame.convert("RGB"), dtype=np.uint8)
    # The source is deliberately generated on a nearly uniform warm paper
    # field. Match that field by its narrow RGB family; the subject palette is
    # separated by dark outlines and more saturated fills.
    red, green, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    background = (
        (red >= 238)
        & (green >= 220)
        & (green <= 247)
        & (blue >= 210)
        & (blue <= 240)
        & ((red.astype(np.int16) - green) <= 25)
        & ((green.astype(np.int16) - blue) <= 20)
    )
    alpha = np.where(background, 0, 255).astype(np.uint8)
    rgba = np.dstack([rgb, alpha])
    return Image.fromarray(rgba, "RGBA")


def pixel_card(size: tuple[int, int] = (44, 52)) -> Image.Image:
    w, h = size
    image = Image.new("RGBA", size)
    draw = ImageDraw.Draw(image)
    draw.rectangle((3, 3, w - 4, h - 4), fill="#f8e0a8", outline="#4a3024", width=4)
    draw.rectangle((12, 13, w - 13, h - 14), outline="#bd5335", width=4)
    draw.line((16, 21, w - 17, 21), fill="#bd5335", width=3)
    draw.line((16, 29, w - 17, 29), fill="#bd5335", width=3)
    return image


def pixel_block(color: str) -> Image.Image:
    image = Image.new("RGBA", (42, 42))
    draw = ImageDraw.Draw(image)
    draw.polygon(((3, 11), (20, 2), (38, 11), (21, 21)), fill="#ead99b", outline="#4a3024")
    draw.polygon(((3, 11), (21, 21), (21, 39), (3, 29)), fill=color, outline="#4a3024")
    draw.polygon(((21, 21), (38, 11), (38, 29), (21, 39)), fill=color, outline="#4a3024")
    return image


def pixel_gift() -> Image.Image:
    image = Image.new("RGBA", (76, 68))
    draw = ImageDraw.Draw(image)
    draw.rectangle((5, 18, 70, 62), fill="#f7e1ab", outline="#4a3024", width=4)
    draw.rectangle((34, 18, 44, 62), fill="#d6892f")
    draw.rectangle((5, 27, 70, 37), fill="#d6892f")
    draw.rectangle((3, 12, 72, 25), fill="#f7e1ab", outline="#4a3024", width=4)
    draw.polygon(((39, 13), (24, 3), (18, 11), (34, 23)), fill="#d6892f", outline="#4a3024")
    draw.polygon(((39, 13), (54, 3), (60, 11), (44, 23)), fill="#d6892f", outline="#4a3024")
    return image


def blink(image: Image.Image, box: tuple[int, int, int, int]) -> None:
    draw = ImageDraw.Draw(image)
    x1, y1, x2, y2 = box
    draw.rectangle(box, fill="#251d19")
    mid = (y1 + y2) // 2
    draw.rectangle((x1 + 8, mid, x1 + 17, mid + 3), fill="#f4a11e")
    draw.rectangle((x2 - 17, mid, x2 - 8, mid + 3), fill="#f4a11e")


def compose(base: Image.Image, overlays: list[tuple[Image.Image, tuple[int, int]]], blink_box=None) -> Image.Image:
    frame = base.copy()
    if blink_box:
        blink(frame, blink_box)
    for overlay, position in overlays:
        frame.alpha_composite(overlay, position)
    return frame


def build(source: Path, destination: Path, kind: str) -> None:
    source_sheet = Image.open(source).convert("RGB")
    if source_sheet.size != SHEET:
        raise ValueError(f"expected {SHEET}, got {source_sheet.size}")

    if kind == "process":
        index = 1
        blocks = [pixel_block("#508d88"), pixel_block("#8b9449"), pixel_block("#b95b3a")]
        gift = pixel_gift()
        sequences = [
            [],
            [],
            [(blocks[0], (225, 289)), (blocks[1], (266, 289)), (blocks[2], (307, 289))],
            [(blocks[2], (225, 289)), (blocks[0], (266, 278)), (blocks[1], (307, 289))],
            [(gift, (244, 258))],
            [(gift, (252, 220))],
        ]
        blink_frames = {1}
        blink_box = (321, 172, 377, 217)
    else:
        index = 0
        card = pixel_card((42, 50))
        sequences = [
            [],
            [],
            [(card, (415, 245))],
            [(card, (415, 245))],
            [(card, (370, 252))],
            [(card, (324, 257))],
        ]
        blink_frames = {1}
        blink_box = (402, 181, 462, 227)

    x = (index % 3) * FRAME
    y = (index // 3) * FRAME
    base = cutout(source_sheet.crop((x, y, x + FRAME, y + FRAME)))
    output = Image.new("RGBA", SHEET)
    for frame_index, overlays in enumerate(sequences):
        frame = compose(base, overlays, blink_box if frame_index in blink_frames else None)
        output.alpha_composite(frame, ((frame_index % 3) * FRAME, (frame_index // 3) * FRAME))

    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination, "WEBP", lossless=True, method=6)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--kind", choices=("process", "tips"), required=True)
    args = parser.parse_args()
    build(args.source, args.destination, args.kind)


if __name__ == "__main__":
    main()

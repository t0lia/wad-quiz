from __future__ import annotations

import argparse
from pathlib import Path

from render_hw2 import Hw2Renderer


PYDTO_DIR = Path(__file__).resolve().parent
WORLD_DIR = PYDTO_DIR.parent


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Play the Hydroworld2 game in a text console using the DTO-backed content model.")
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Optional random seed for deterministic task selection.",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Print ids for stages, assets, pools, and actions while playing.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    player = Hw2Renderer(WORLD_DIR, seed=args.seed, debug=args.debug)
    player.run()


if __name__ == "__main__":
    main()
from __future__ import annotations

import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


PYDTO_DIR = Path(__file__).resolve().parent
WORLD_DIR = PYDTO_DIR.parent
REPO_ROOT = WORLD_DIR.parents[1]
DEFAULT_OUTPUT_PATH = REPO_ROOT / "sandbox" / "hydroworld2.zip"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Package the full Hydroworld2 directory into a zip archive.")
    parser.add_argument(
        "--output-path",
        type=Path,
        default=DEFAULT_OUTPUT_PATH,
        help="Output zip archive path. Defaults to sandbox/hydroworld2.zip.",
    )
    return parser.parse_args()


def write_bundle(output_path: Path, source_dir: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with ZipFile(output_path, mode="w", compression=ZIP_DEFLATED) as archive:
        for path in sorted(source_dir.rglob("*")):
            if path.is_dir():
                continue
            archive.write(path, arcname=path.relative_to(source_dir.parent))


def main() -> None:
    args = parse_args()
    write_bundle(args.output_path, WORLD_DIR)
    print(f"Created HW2 directory bundle: {args.output_path.resolve()}")


if __name__ == "__main__":
    main()
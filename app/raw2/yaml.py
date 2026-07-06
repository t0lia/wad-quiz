from __future__ import annotations

import json
import shutil
import subprocess
from typing import Any


def safe_load(stream: Any) -> Any:
    """Parse YAML using the repo's Node yaml dependency.

    The repository already ships with a JS toolchain, so this fallback keeps the
    raw2 generator working even when PyYAML is not installed in the Python
    environment.
    """

    if hasattr(stream, "read"):
        text = stream.read()
    else:
        text = stream

    if isinstance(text, bytes):
        text = text.decode("utf-8")
    if not isinstance(text, str):
        text = str(text)

    node = shutil.which("node")
    if not node:
        raise ModuleNotFoundError("No module named 'yaml' and node is unavailable for the fallback parser")

    js = r"""
const fs = require('fs');
const YAML = require('yaml');
const input = fs.readFileSync(0, 'utf8');
const parsed = YAML.parse(input);
process.stdout.write(JSON.stringify(parsed));
""".strip()

    proc = subprocess.run(
        [node, "-e", js],
        input=text,
        text=True,
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        stderr = proc.stderr.strip()
        raise ValueError(f"YAML parse failed: {stderr or 'unknown error'}")
    if not proc.stdout.strip():
        return None
    return json.loads(proc.stdout)

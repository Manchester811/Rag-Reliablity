import os
import tempfile
from pathlib import Path


def _resolve_db_path():
    """Resolve the database path lazily so environment variables and a
    writable fallback are both honored at connection time."""
    env_path = os.getenv("DB_PATH")
    if env_path:
        return Path(env_path)

    base_dir = Path(__file__).resolve().parents[1]
    data_dir = base_dir / "data"
    try:
        data_dir.mkdir(parents=True, exist_ok=True)
        return data_dir / "rag_lab.db"
    except OSError:
        # Project directory is read-only (e.g. Vercel serverless deployments).
        fallback_dir = Path(tempfile.gettempdir()) / "rag_reliability_lab_data"
        fallback_dir.mkdir(parents=True, exist_ok=True)
        return fallback_dir / "rag_lab.db"


DB_PATH = _resolve_db_path()

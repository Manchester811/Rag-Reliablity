import os
import tempfile
from pathlib import Path

# Use an environment variable to override the database location. This lets
# deployments point at a writable path (e.g. /tmp on Vercel) instead of the
# read-only repository filesystem.
DB_PATH = os.getenv("DB_PATH")
if not DB_PATH:
    BASE_DIR = Path(__file__).resolve().parents[1]
    DATA_DIR = BASE_DIR / "data"
    try:
        DATA_DIR.mkdir(exist_ok=True)
        DB_PATH = DATA_DIR / "rag_lab.db"
    except OSError:
        # Fall back to a writable temp directory when the project directory is
        # read-only (e.g. Vercel serverless deployments).
        DATA_DIR = Path(tempfile.gettempdir()) / "rag_reliability_lab_data"
        DATA_DIR.mkdir(exist_ok=True)
        DB_PATH = DATA_DIR / "rag_lab.db"

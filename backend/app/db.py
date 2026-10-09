import sqlite3
from .config import DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS experiments (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 config_json TEXT NOT NULL,
 status TEXT NOT NULL,
 overall_score REAL DEFAULT 0,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS test_cases (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 experiment_id INTEGER NOT NULL,
 question TEXT NOT NULL,
 expected_answer TEXT NOT NULL,
 attack_type TEXT NOT NULL,
 metadata_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS runs (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 experiment_id INTEGER NOT NULL,
 test_case_id INTEGER NOT NULL,
 answer TEXT NOT NULL,
 retrieved_json TEXT NOT NULL,
 metrics_json TEXT NOT NULL,
 passed INTEGER NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS documents (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 file_type TEXT NOT NULL,
 size_bytes INTEGER NOT NULL,
 sha256 TEXT NOT NULL UNIQUE,
 chunk_count INTEGER DEFAULT 0,
 status TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS document_chunks (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 document_id INTEGER NOT NULL,
 chunk_index INTEGER NOT NULL,
 page_number INTEGER,
 text TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS failures (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 run_id INTEGER NOT NULL,
 failure_type TEXT NOT NULL,
 root_cause TEXT NOT NULL,
 confidence REAL NOT NULL,
 recommendation TEXT NOT NULL,
 reproduction_json TEXT NOT NULL,
 created_at TEXT NOT NULL
);
"""

def connect():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    return c

def init_db():
    with connect() as c:
        c.executescript(SCHEMA)

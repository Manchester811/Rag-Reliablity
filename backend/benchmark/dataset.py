"""Deterministic benchmark dataset used by the optimizer and research benchmark.

This module is intentionally dependency-free and reproducible. It mirrors the
inline corpus in app/experiment_engine.py so that the automated optimizer and
the research benchmark share the same evidence base.
"""

DOCUMENTS = [
    ("c1", "Apple revenue 2024: Apple reported total revenue of 391 billion dollars in fiscal 2024.", "annual-report-2024"),
    ("c2", "Apple revenue 2023: Apple reported total revenue of 383 billion dollars in fiscal 2023.", "annual-report-2023"),
    ("c3", "Apple products: iPhone, Mac, iPad, Apple Watch and services are major product categories.", "company-profile"),
    ("c4", "Apple services: Services revenue includes the App Store, cloud services, subscriptions and advertising.", "services-report"),
    ("c5", "Apple history: The company was founded by Steve Jobs, Steve Wozniak and Ronald Wayne in 1976.", "history"),
    ("c6", "Distractor: A 2021 report discusses revenue from an unrelated company and should not answer Apple revenue questions.", "distractor"),
]

BASE_CASES = [
    ("What was Apple's revenue in 2024?", "391 billion dollars", "c1"),
    ("Who founded Apple?", "Steve Jobs, Steve Wozniak and Ronald Wayne", "c5"),
    ("What does Apple Services revenue include?", "App Store, cloud services, subscriptions and advertising", "c4"),
    ("What was Apple's revenue in 2023?", "383 billion dollars", "c2"),
]


def make_cases():
    """Return the full benchmark case list (base cases only for now)."""
    return [
        {
            "question": q,
            "expected_answer": a,
            "attack_type": "normal",
            "evidence_id": eid,
        }
        for q, a, eid in BASE_CASES
    ]

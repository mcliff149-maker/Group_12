"""Entrypoint – run with:  uvicorn main:app --reload"""
from __future__ import annotations

import uvicorn

from app.main import app  # noqa: F401 – re-export for uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

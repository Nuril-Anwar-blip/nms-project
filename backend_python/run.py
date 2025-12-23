"""
File: run.py

Script untuk menjalankan aplikasi FastAPI dalam mode development
Menggunakan uvicorn dengan auto-reload untuk development
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"]
    )


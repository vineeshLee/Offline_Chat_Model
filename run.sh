#!/bin/bash
cd /Users/vineeshkumar/Desktop/OfflineModel
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 3002
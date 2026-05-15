import sqlite3
import json

db_path = 'apps/api/specforge.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get artifacts for project d08789b90cb742248176384406ef5f72
cursor.execute("SELECT id, project_id, type, title, content, content_format, created_at FROM artifacts WHERE project_id='d08789b90cb742248176384406ef5f72'")
rows = cursor.fetchall()
for row in rows:
    print(f"Artifact Type: {row[2]}, Title: {row[3]}, Format: {row[5]}")
    # Print the first 100 characters of the content
    print("Content preview:", repr(row[4][:200]))
    print("---")

conn.close()

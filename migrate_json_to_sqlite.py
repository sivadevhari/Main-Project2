import sqlite3
import json

# Paths
DB_NAME = "users.db"

# Load and insert admins
with open("admins.json") as f:
    admin_data = json.load(f)
    emails = admin_data.get("admin_emails", [])

conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()
for email in emails:
    cursor.execute("INSERT OR IGNORE INTO admins (email) VALUES (?)", (email,))

# Load and insert disease info
with open("disease_info.json") as f:
    disease_data = json.load(f)
for name, info in disease_data.items():
    cursor.execute(
        "INSERT OR IGNORE INTO disease_info (name, description, causes, precautions, image) VALUES (?, ?, ?, ?, ?)",
        (name, info.get("description", ""), info.get("causes", ""), info.get("precautions", ""), info.get("image", ""))
    )

# Load and insert diagnostics (fix: only use 9 columns)
try:
    with open("diagnostics.json") as f:
        diagnostics = json.load(f)
    for diag in diagnostics:
        cursor.execute(
            "INSERT OR IGNORE INTO diagnostics (id, user_id, user_email, user_name, address, symptoms, disease, accuracy, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                diag.get("id"), diag.get("user_id"), diag.get("user_email"), diag.get("user_name"),
                diag.get("address"), diag.get("symptoms"), diag.get("disease"), diag.get("accuracy"), diag.get("timestamp")
            )
        )
except Exception as e:
    print("No diagnostics.json or error loading diagnostics:", e)

conn.commit()
conn.close()
print("Migration complete.")

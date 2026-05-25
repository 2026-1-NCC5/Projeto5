import sqlite3
conn = sqlite3.connect("database.db")
tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print("Tables:", [t[0] for t in tables])
for t in tables:
    try:
        rows = conn.execute(f"SELECT * FROM {t[0]} LIMIT 3").fetchall()
        cols = [d[0] for d in conn.execute(f"PRAGMA table_info({t[0]})").fetchall()]
        print(f"\n{t[0]}: {cols}")
        for r in rows:
            print(" ", r)
    except:
        pass
conn.close()

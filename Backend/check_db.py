import sqlite3

db = sqlite3.connect("outpass.db")

tables = db.execute(
    "SELECT name FROM sqlite_master WHERE type='table'"
).fetchall()

print("Tables in database:")

for table in tables:
    print(table[0])

db.close()

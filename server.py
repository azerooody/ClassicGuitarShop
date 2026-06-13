import http.server
import json
import os
import mimetypes
from datetime import datetime

DATA_FILE = "messages.json"
HOST = "0.0.0.0"
PORT = 8000


# ─── HTTP-обработчик ────────────────────────────────────────
class Handler(http.server.BaseHTTPRequestHandler):

    def do_GET(self):
        path = self.path.split("?")[0]
        if path in ("", "/"):
            path = "/index.html"
        file_path = "." + path

        if not os.path.isfile(file_path):
            self.send_error(404, "File not found")
            return

        mime, _ = mimetypes.guess_type(file_path)
        if mime is None:
            mime = "application/octet-stream"

        with open(file_path, "rb") as f:
            data = f.read()

        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", len(data))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path == "/send-message":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                self.send_error(400, "Invalid JSON")
                return

            record = {
                "name": data.get("name", "").strip(),
                "phone": data.get("phone", "").strip(),
                "email": data.get("email", "").strip(),
                "message": data.get("message", "").strip(),
                "time": datetime.now().isoformat()
            }

            # Сохраняем в JSON
            messages = []
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    try:
                        messages = json.load(f)
                    except Exception:
                        messages = []

            messages.append(record)
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(messages, f, ensure_ascii=False, indent=2)

            print(f"[+] {record['name']} — сохранено")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]} {args[1]} {args[2]}")


# --- Launch ---
if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("=" * 48)
    print(f"  Server: http://localhost:{PORT}")
    print("=" * 48)
    print()

    try:
        srv = http.server.HTTPServer((HOST, PORT), Handler)
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        srv.server_close()

#!/usr/bin/env python3
"""
SIT v11 — Servidor Local
Duplo clique para iniciar. Abre automaticamente no browser.
"""
import http.server
import socketserver
import webbrowser
import threading
import os
import sys

PORT = 8080
DIR  = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIR)

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Log limpo no terminal
        print(f"  {args[0]}  {args[1]}  {self.path}")

def abrir_browser():
    import time
    time.sleep(1.2)
    url = f"http://localhost:{PORT}/index.html"
    print(f"\n  Abrindo: {url}\n")
    webbrowser.open(url)

print("=" * 50)
print("  SIT v11 — CARDINAL PROTOCOL")
print("  Servidor local iniciando...")
print(f"  Porta: {PORT}")
print(f"  Pasta: {DIR}")
print("=" * 50)
print("\n  Acesse: http://localhost:8080/index.html")
print("  Para encerrar: feche esta janela ou Ctrl+C\n")

threading.Thread(target=abrir_browser, daemon=True).start()

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n  Servidor encerrado.")
except OSError as e:
    if "Address already in use" in str(e):
        print(f"\n  PORTA {PORT} JA EM USO!")
        print(f"  Tente: http://localhost:{PORT}/index.html")
        PORT2 = 8081
        print(f"  Tentando porta {PORT2}...")
        with socketserver.TCPServer(("", PORT2), Handler) as httpd:
            webbrowser.open(f"http://localhost:{PORT2}/index.html")
            httpd.serve_forever()

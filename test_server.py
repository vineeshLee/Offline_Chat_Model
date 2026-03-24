#!/usr/bin/env python3
import time
import socket

def check_server(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

# Wait a bit for server to start
time.sleep(3)

if check_server('localhost', 3002):
    print("Server is running on port 3002")
else:
    print("Server is not responding on port 3002")
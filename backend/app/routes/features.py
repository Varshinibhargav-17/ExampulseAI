from flask import Blueprint, request, jsonify, render_template_string
import json

features_bp = Blueprint("features", __name__)

# Store features in memory (in production, save to database)
features_data = []

@features_bp.route("/", methods=["POST"])
def receive_features():
    """
    Receive behavioral features from the frontend
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        
        # Log the features received
        print(f"\n{'='*60}")
        print(f"📊 RECEIVED FEATURES PACKET #{len(features_data) + 1}")
        print(f"{'='*60}")
        print(json.dumps(data, indent=2))
        print(f"{'='*60}\n")
        
        # Store the features
        features_data.append(data)
        
        return jsonify({
            "status": "success",
            "message": "Features received and stored",
            "total_packets": len(features_data)
        }), 200
    
    except Exception as e:
        print(f"❌ Error receiving features: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@features_bp.route("/all", methods=["GET"])
def get_all_features():
    """
    Get all features received so far
    """
    return jsonify({
        "total_packets": len(features_data),
        "features": features_data
    }), 200

@features_bp.route("/dashboard", methods=["GET"])
def dashboard():
    """
    Simple HTML dashboard to view features
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>ExamPulse - Features Dashboard</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }}
            .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }}
            h1 {{ color: #333; }}
            .stats {{ background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }}
            .feature-packet {{ background: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 10px 0; }}
            .feature-packet h3 {{ margin-top: 0; color: #4CAF50; }}
            pre {{ background: #eee; padding: 10px; border-radius: 4px; overflow-x: auto; }}
            button {{ padding: 10px 20px; background: #ff5252; color: white; border: none; border-radius: 4px; cursor: pointer; }}
            button:hover {{ background: #d32f2f; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📊 ExamPulse - Behavioral Features Dashboard</h1>
            
            <div class="stats">
                <h2>Total Packets Received: <span style="color: #4CAF50; font-size: 28px;">{len(features_data)}</span></h2>
                <p>Each packet contains behavioral data captured from the assessment page</p>
                <button onclick="clearData()">Clear All Data</button>
            </div>
            
            <h2>Features Received:</h2>
            {get_html_features()}
        </div>
        
        <script>
            function clearData() {{
                if (confirm('Are you sure you want to clear all data?')) {{
                    fetch('/api/features/clear', {{ method: 'POST' }})
                        .then(() => location.reload());
                }}
            }}
            
            // Auto-refresh every 5 seconds
            setInterval(() => location.reload(), 5000);
        </script>
    </body>
    </html>
    """
    return render_template_string(html)

def get_html_features():
    """
    Format features data as HTML
    """
    if not features_data:
        return "<p style='color: #999;'>No features received yet...</p>"
    
    html = ""
    for i, feature in enumerate(features_data):
        html += f"""
        <div class="feature-packet">
            <h3>Packet #{i + 1} (at {feature.get('timestamp', 'N/A')})</h3>
            <pre>{json.dumps(feature, indent=2)}</pre>
        </div>
        """
    return html

@features_bp.route("/clear", methods=["POST"])
def clear_features():
    """
    Clear stored features
    """
    global features_data
    features_data = []
    print("\n⚠️  ALL FEATURES CLEARED\n")
    return jsonify({"status": "success", "message": "Features cleared"}), 200

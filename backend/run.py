# run.py
"""
Application entry point
Runs the Flask-SocketIO server
"""
from app import create_app, socketio
import os

app = create_app()

if __name__ == '__main__':
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"""
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║          🎓 ExamPulse AI Backend Server          ║
    ║     Behavioral Analytics for Exam Integrity      ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
    
    🚀 Server starting on http://{host}:{port}
    📊 Environment: {'Development' if debug else 'Production'}
    🔌 WebSocket: Enabled
    💾 Database: {'SQLite' if 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI'] else 'PostgreSQL'}
    
    Press CTRL+C to stop
    """)
    
    socketio.run(
        app,
        host=host,
        port=port,
        debug=debug
    )
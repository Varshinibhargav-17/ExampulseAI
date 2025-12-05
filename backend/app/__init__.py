from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Allow the Vite dev origin explicitly
ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]

socketio = SocketIO(cors_allowed_origins=ALLOWED_ORIGINS)
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    
    # Use SQLite for development if DATABASE_URL is not set
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        database_url = "sqlite:///exampulseai.db"
    
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    CORS(app, origins=ALLOWED_ORIGINS)
    socketio.init_app(app)
    db.init_app(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.exams import exams_bp
    from .routes.baselines import baselines_bp
    from .routes.features import features_bp
    
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(exams_bp, url_prefix="/api/exams")
    app.register_blueprint(baselines_bp, url_prefix="/api/baselines")
    app.register_blueprint(features_bp, url_prefix="/api/features")

    # Ensure socket handlers are imported
    from .sockets import handlers  # noqa: F401

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'ExamPulse AI Backend is running'}, 200

    return app


from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# allow the Vite dev origin explicitly
ALLOWED_ORIGINS = ["http://localhost:5174", "http://localhost:3000"]

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

    # initialize extensions
    CORS(app, origins=ALLOWED_ORIGINS)
    socketio.init_app(app)
    db.init_app(app)
    
    

    # register blueprints etc...
    from .routes.baselines import baselines_bp
    from .routes.features import features_bp
    app.register_blueprint(baselines_bp, url_prefix="/api/baselines")
    app.register_blueprint(features_bp, url_prefix="/api/features")

    # ensure socket handlers are imported
    from .sockets import handlers  # noqa: F401

    return app

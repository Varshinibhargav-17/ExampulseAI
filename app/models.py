from . import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    roll_number = db.Column(db.String(100), nullable=True)
    course = db.Column(db.String(200), nullable=True)
    accommodations = db.Column(JSONB, nullable=True)   # e.g. {"needs_extra_time": True}
    metadata = db.Column(JSONB, nullable=True)         # flexible dev-use field
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<User id={self.id} email={self.email} name={self.name}>"

class Baseline(db.Model):
    __tablename__ = "baselines"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True, nullable=False)
    features = db.Column(JSONB, nullable=False)   # e.g. {"wpm_mean": 45, "tab_switch_rate": 0.01}
    sample_count = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Baseline id={self.id} user={self.user_id} samples={self.sample_count}>"

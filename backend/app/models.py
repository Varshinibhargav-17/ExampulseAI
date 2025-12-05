from . import db
from datetime import datetime
from sqlalchemy import Text
import json

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    roll_number = db.Column(db.String(100), nullable=True)
    department = db.Column(db.String(200), nullable=True)
    semester = db.Column(db.String(50), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(20), default='student', nullable=False)  # 'student' or 'proctor'
    accommodations = db.Column(Text, nullable=True)  # JSON string for SQLite compatibility
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    # Relationships
    baselines = db.relationship('Baseline', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    exam_sessions = db.relationship('ExamSession', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'roll_number': self.roll_number,
            'department': self.department,
            'semester': self.semester,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f"<User id={self.id} email={self.email} name={self.name}>"


class Exam(db.Model):
    __tablename__ = "exams"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(Text, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=False)  # Duration in minutes
    total_questions = db.Column(db.Integer, nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    instructions = db.Column(Text, nullable=True)
    monitoring_sensitivity = db.Column(db.String(20), default='medium')  # low, medium, high
    allow_tab_switch = db.Column(db.Boolean, default=False)
    allow_copy_paste = db.Column(db.Boolean, default=False)
    questions = db.Column(Text, nullable=True)  # JSON string of questions
    status = db.Column(db.String(20), default='scheduled')  # scheduled, active, completed
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    # Relationships
    sessions = db.relationship('ExamSession', backref='exam', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'duration_minutes': self.duration_minutes,
            'total_questions': self.total_questions,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'created_by': self.created_by,
            'instructions': self.instructions,
            'monitoring_sensitivity': self.monitoring_sensitivity,
            'allow_tab_switch': self.allow_tab_switch,
            'allow_copy_paste': self.allow_copy_paste,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f"<Exam id={self.id} name={self.name}>"


class ExamSession(db.Model):
    __tablename__ = "exam_sessions"
    
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    started_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    submitted_at = db.Column(db.DateTime, nullable=True)
    time_taken_seconds = db.Column(db.Integer, nullable=True)
    answers = db.Column(Text, nullable=True)  # JSON string of answers
    score = db.Column(db.Float, nullable=True)
    risk_score = db.Column(db.Float, default=0.0)
    integrity_score = db.Column(db.Float, default=1.0)
    status = db.Column(db.String(20), default='in_progress')  # in_progress, submitted, flagged
    flagged_incidents_count = db.Column(db.Integer, default=0)
    
    # Relationships
    events = db.relationship('Event', backref='session', lazy='dynamic', cascade='all, delete-orphan')
    alerts = db.relationship('Alert', backref='session', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'exam_id': self.exam_id,
            'user_id': self.user_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'time_taken_seconds': self.time_taken_seconds,
            'score': self.score,
            'risk_score': self.risk_score,
            'integrity_score': self.integrity_score,
            'status': self.status,
            'flagged_incidents_count': self.flagged_incidents_count
        }
    
    def __repr__(self):
        return f"<ExamSession id={self.id} exam={self.exam_id} user={self.user_id}>"


class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('exam_sessions.id'), nullable=False, index=True)
    event_type = db.Column(db.String(50), nullable=False, index=True)  # tab_switch, copy_paste, window_blur, etc.
    event_data = db.Column(Text, nullable=True)  # JSON string of event details
    timestamp = db.Column(db.DateTime, default=db.func.now(), nullable=False, index=True)
    severity = db.Column(db.String(20), default='low')  # low, medium, high
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'event_type': self.event_type,
            'event_data': json.loads(self.event_data) if self.event_data else {},
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'severity': self.severity
        }
    
    def __repr__(self):
        return f"<Event id={self.id} type={self.event_type}>"


class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('exam_sessions.id'), nullable=False, index=True)
    alert_type = db.Column(db.String(50), nullable=False)
    message = db.Column(Text, nullable=False)
    risk_score = db.Column(db.Float, nullable=False)
    severity = db.Column(db.String(20), nullable=False)  # low, medium, high
    resolved = db.Column(db.Boolean, default=False)
    resolved_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'alert_type': self.alert_type,
            'message': self.message,
            'risk_score': self.risk_score,
            'severity': self.severity,
            'resolved': self.resolved,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f"<Alert id={self.id} type={self.alert_type} severity={self.severity}>"


class Baseline(db.Model):
    __tablename__ = "baselines"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True, nullable=False)
    features = db.Column(Text, nullable=False)  # JSON string of behavioral features
    sample_count = db.Column(db.Integer, default=1, nullable=False)
    typing_speed_wpm = db.Column(db.Float, nullable=True)
    mouse_speed_pxs = db.Column(db.Float, nullable=True)
    avg_question_time_sec = db.Column(db.Float, nullable=True)
    tab_switch_rate = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now(), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'features': json.loads(self.features) if self.features else {},
            'sample_count': self.sample_count,
            'typing_speed_wpm': self.typing_speed_wpm,
            'mouse_speed_pxs': self.mouse_speed_pxs,
            'avg_question_time_sec': self.avg_question_time_sec,
            'tab_switch_rate': self.tab_switch_rate,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f"<Baseline id={self.id} user={self.user_id} samples={self.sample_count}>"

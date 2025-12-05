# app/routes/exams.py
from flask import Blueprint, request, jsonify
from app import db
from app.models import Exam, ExamSession, User, Event, Alert
from datetime import datetime
import json
import jwt
import os

exams_bp = Blueprint('exams', __name__)

SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

def get_user_from_token():
    """Extract user from JWT token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return User.query.get(payload['user_id'])
    except:
        return None


@exams_bp.route('/', methods=['GET'])
def get_exams():
    """Get all exams or filter by status"""
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        
        status = request.args.get('status')
        
        if user.role == 'proctor':
            # Proctors see all exams they created
            query = Exam.query.filter_by(created_by=user.id)
        else:
            # Students see all available exams
            query = Exam.query
        
        if status:
            query = query.filter_by(status=status)
        
        exams = query.order_by(Exam.scheduled_date.desc()).all()
        
        return jsonify({
            'exams': [exam.to_dict() for exam in exams]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@exams_bp.route('/', methods=['POST'])
def create_exam():
    """Create a new exam (proctor only)"""
    try:
        user = get_user_from_token()
        if not user or user.role != 'proctor':
            return jsonify({'error': 'Unauthorized - Proctor access required'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'duration_minutes', 'total_questions']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse scheduled date if provided
        scheduled_date = None
        if data.get('scheduled_date') and data.get('scheduled_time'):
            try:
                date_str = f"{data['scheduled_date']} {data['scheduled_time']}"
                scheduled_date = datetime.strptime(date_str, '%Y-%m-%d %H:%M')
            except:
                pass
        
        # Create exam
        exam = Exam(
            name=data['name'],
            description=data.get('description'),
            duration_minutes=data['duration_minutes'],
            total_questions=data['total_questions'],
            scheduled_date=scheduled_date,
            created_by=user.id,
            instructions=data.get('instructions'),
            monitoring_sensitivity=data.get('monitoring_sensitivity', 'medium'),
            allow_tab_switch=data.get('allow_tab_switch', False),
            allow_copy_paste=data.get('allow_copy_paste', False),
            questions=json.dumps(data.get('questions', [])),
            status='scheduled'
        )
        
        db.session.add(exam)
        db.session.commit()
        
        return jsonify({
            'message': 'Exam created successfully',
            'exam': exam.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@exams_bp.route('/<int:exam_id>', methods=['GET'])
def get_exam(exam_id):
    """Get exam details"""
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        
        exam = Exam.query.get(exam_id)
        if not exam:
            return jsonify({'error': 'Exam not found'}), 404
        
        exam_dict = exam.to_dict()
        
        # Include questions if user is taking the exam
        if exam.questions:
            exam_dict['questions'] = json.loads(exam.questions)
        
        
        exam = Exam.query.get(exam_id)
        if not exam:
            return jsonify({'error': 'Exam not found'}), 404
        
        # Check if user already has an active session
        existing_session = ExamSession.query.filter_by(
            exam_id=exam_id,
            user_id=user.id,
            status='in_progress'
        ).first()
        
        if existing_session:
            return jsonify({
                'message': 'Session already exists',
                'session': existing_session.to_dict()
            }), 200
        
        # Create new session
        session = ExamSession(
            exam_id=exam_id,
            user_id=user.id,
            started_at=datetime.utcnow(),
            status='in_progress'
        )
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify({
            'message': 'Exam session started',
            'session': session.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@exams_bp.route('/<int:exam_id>/submit', methods=['POST'])
def submit_exam(exam_id):
    """Submit exam answers"""
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        
        # Find active session
        session = ExamSession.query.filter_by(
            exam_id=exam_id,
            user_id=user.id,
            status='in_progress'
        ).first()
        
        if not session:
            return jsonify({'error': 'No active exam session found'}), 404
        
        # Update session
        session.submitted_at = datetime.utcnow()
        session.time_taken_seconds = data.get('time_taken_seconds')
        session.answers = json.dumps(data.get('answers', {}))
        session.status = 'submitted'
        
        # Calculate score (simplified - in production, compare with correct answers)
        # For now, just set a mock score
        session.score = 85.0
        
        # Calculate integrity score based on events
        events_count = Event.query.filter_by(session_id=session.id).count()
        high_severity_events = Event.query.filter_by(
            session_id=session.id,
            severity='high'
        ).count()
        
        # Simple integrity calculation
        if events_count == 0:
            session.integrity_score = 1.0
        else:
            session.integrity_score = max(0.5, 1.0 - (high_severity_events * 0.1) - (events_count * 0.02))
        
        session.risk_score = 1.0 - session.integrity_score
        
        db.session.commit()
        
        return jsonify({
            'message': 'Exam submitted successfully',
            'session': session.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@exams_bp.route('/sessions', methods=['GET'])
def get_user_sessions():
    """Get all exam sessions for current user"""
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        
        sessions = ExamSession.query.filter_by(user_id=user.id).order_by(
            ExamSession.started_at.desc()
        ).all()
        
        # Include exam details
        sessions_data = []
        for session in sessions:
            session_dict = session.to_dict()
            if session.exam:
                session_dict['exam'] = session.exam.to_dict()
            sessions_data.append(session_dict)
        
        return jsonify({'sessions': sessions_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@exams_bp.route('/sessions/<int:session_id>', methods=['GET'])
def get_session_details(session_id):
    """Get detailed session information"""
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        
        session = ExamSession.query.get(session_id)
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        # Check authorization
        if user.role != 'proctor' and session.user_id != user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        session_dict = session.to_dict()
        
        # Include exam details
        if session.exam:
            session_dict['exam'] = session.exam.to_dict()
        
        # Include events
        events = Event.query.filter_by(session_id=session_id).order_by(Event.timestamp).all()
        session_dict['events'] = [event.to_dict() for event in events]
        
        # Include alerts
        alerts = Alert.query.filter_by(session_id=session_id).order_by(Alert.created_at).all()
        session_dict['alerts'] = [alert.to_dict() for alert in alerts]
        
        return jsonify({'session': session_dict}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

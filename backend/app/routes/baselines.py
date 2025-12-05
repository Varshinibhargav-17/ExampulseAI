# app/routes/baselines.py
from flask import Blueprint, request, jsonify
from app import db
from app.models import Baseline, User
import json
import jwt
import os
from datetime import datetime

baselines_bp = Blueprint('baselines', __name__)

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


@baselines_bp.route('/', methods=['POST'])
def create_baseline():
    """Create or update user baseline"""
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        
        # Check if baseline exists
        baseline = Baseline.query.filter_by(user_id=user.id).first()
        
        if baseline:
            # Update existing baseline
            baseline.sample_count += 1
            baseline.updated_at = datetime.utcnow()
            
            # Update features (merge with existing)
            existing_features = json.loads(baseline.features) if baseline.features else {}
            new_features = data.get('features', {})
            
            # Average the values
            for key, value in new_features.items():
                if key in existing_features:
                    existing_features[key] = (existing_features[key] + value) / 2
                else:
                    existing_features[key] = value
            
            baseline.features = json.dumps(existing_features)
            
            # Update specific metrics
            if data.get('typing_speed_wpm'):
                baseline.typing_speed_wpm = (baseline.typing_speed_wpm + data['typing_speed_wpm']) / 2 if baseline.typing_speed_wpm else data['typing_speed_wpm']
            if data.get('mouse_speed_pxs'):
                baseline.mouse_speed_pxs = (baseline.mouse_speed_pxs + data['mouse_speed_pxs']) / 2 if baseline.mouse_speed_pxs else data['mouse_speed_pxs']
            if data.get('avg_question_time_sec'):
                baseline.avg_question_time_sec = (baseline.avg_question_time_sec + data['avg_question_time_sec']) / 2 if baseline.avg_question_time_sec else data['avg_question_time_sec']
            if data.get('tab_switch_rate'):
                baseline.tab_switch_rate = (baseline.tab_switch_rate + data['tab_switch_rate']) / 2 if baseline.tab_switch_rate else data['tab_switch_rate']
            
            message = 'Baseline updated successfully'
        else:
            # Create new baseline
            baseline = Baseline(
                user_id=user.id,
                features=json.dumps(data.get('features', {})),
                sample_count=1,
                typing_speed_wpm=data.get('typing_speed_wpm'),
                mouse_speed_pxs=data.get('mouse_speed_pxs'),
                avg_question_time_sec=data.get('avg_question_time_sec'),
                tab_switch_rate=data.get('tab_switch_rate', 0.0)
            )
            db.session.add(baseline)
            message = 'Baseline created successfully'
        
        db.session.commit()
        
        return jsonify({
            'message': message,
            'baseline': baseline.to_dict()
        }), 201 if not baseline.sample_count > 1 else 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@baselines_bp.route('/', methods=['GET'])
def get_baseline():
    """Get user's baseline"""
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        
        baseline = Baseline.query.filter_by(user_id=user.id).first()
        
        if not baseline:
            return jsonify({'error': 'No baseline found'}), 404
        
        return jsonify({'baseline': baseline.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@baselines_bp.route('/<int:user_id>', methods=['GET'])
def get_user_baseline(user_id):
    """Get baseline for specific user (proctor only)"""
    try:
        user = get_user_from_token()
        if not user or user.role != 'proctor':
            return jsonify({'error': 'Unauthorized - Proctor access required'}), 403
        
        baseline = Baseline.query.filter_by(user_id=user_id).first()
        
        if not baseline:
            return jsonify({'error': 'No baseline found for this user'}), 404
        
        return jsonify({'baseline': baseline.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

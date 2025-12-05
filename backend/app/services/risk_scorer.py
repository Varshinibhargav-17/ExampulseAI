# app/services/risk_scorer.py
"""
ML-based Risk Scoring Service
Uses behavioral analytics to calculate real-time risk scores
"""
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json

class RiskScorer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False
    
    def calculate_risk_score(self, current_behavior, baseline, events):
        """
        Calculate risk score based on deviation from baseline
        
        Args:
            current_behavior: dict of current behavioral metrics
            baseline: Baseline model object
            events: list of Event objects
        
        Returns:
            float: risk score between 0 and 1
        """
        try:
            # Parse baseline features
            baseline_features = json.loads(baseline.features) if baseline.features else {}
            
            # Calculate individual component scores
            typing_score = self._calculate_typing_score(
                current_behavior.get('typing_speed_wpm', 0),
                baseline.typing_speed_wpm or 45
            )
            
            tab_switch_score = self._calculate_tab_switch_score(
                events,
                baseline.tab_switch_rate or 0.01
            )
            
            mouse_score = self._calculate_mouse_score(
                current_behavior.get('mouse_speed_pxs', 0),
                baseline.mouse_speed_pxs or 500
            )
            
            answer_speed_score = self._calculate_answer_speed_score(
                current_behavior.get('avg_question_time_sec', 0),
                baseline.avg_question_time_sec or 150
            )
            
            window_focus_score = self._calculate_window_focus_score(events)
            
            # Weighted combination
            risk_score = (
                typing_score * 0.2 +
                tab_switch_score * 0.3 +
                mouse_score * 0.15 +
                answer_speed_score * 0.2 +
                window_focus_score * 0.15
            )
            
            # Clamp between 0 and 1
            return max(0.0, min(1.0, risk_score))
            
        except Exception as e:
            print(f"Error calculating risk score: {e}")
            return 0.0
    
    def _calculate_typing_score(self, current_wpm, baseline_wpm):
        """Calculate typing speed deviation score"""
        if baseline_wpm == 0:
            return 0.0
        
        deviation = abs(current_wpm - baseline_wpm) / baseline_wpm
        
        # High deviation = high risk
        if deviation > 1.0:  # More than 100% deviation
            return 0.9
        elif deviation > 0.5:  # 50-100% deviation
            return 0.6
        elif deviation > 0.3:  # 30-50% deviation
            return 0.3
        else:
            return 0.1
    
    def _calculate_tab_switch_score(self, events, baseline_rate):
        """Calculate tab switching risk score"""
        tab_switches = [e for e in events if e.event_type == 'tab_switch']
        current_rate = len(tab_switches)
        
        if current_rate == 0:
            return 0.0
        
        # More than 5 tab switches is highly suspicious
        if current_rate > 10:
            return 1.0
        elif current_rate > 5:
            return 0.8
        elif current_rate > 2:
            return 0.5
        else:
            return 0.2
    
    def _calculate_mouse_score(self, current_speed, baseline_speed):
        """Calculate mouse movement deviation score"""
        if baseline_speed == 0:
            return 0.0
        
        deviation = abs(current_speed - baseline_speed) / baseline_speed
        
        # Unusually slow mouse movement can indicate cheating
        if current_speed < baseline_speed * 0.3:  # Less than 30% of normal
            return 0.7
        elif deviation > 0.5:
            return 0.4
        else:
            return 0.1
    
    def _calculate_answer_speed_score(self, current_time, baseline_time):
        """Calculate answer speed deviation score"""
        if baseline_time == 0:
            return 0.0
        
        # Too fast = suspicious (copy-paste)
        if current_time < baseline_time * 0.3:
            return 0.8
        # Too slow = might be looking up answers
        elif current_time > baseline_time * 3:
            return 0.6
        else:
            return 0.1
    
    def _calculate_window_focus_score(self, events):
        """Calculate window focus loss score"""
        blur_events = [e for e in events if e.event_type == 'window_blur']
        
        if not blur_events:
            return 0.0
        
        # Calculate total blur time
        total_blur_time = 0
        for event in blur_events:
            event_data = json.loads(event.event_data) if event.event_data else {}
            total_blur_time += event_data.get('duration', 0)
        
        # More than 2 minutes of blur time is suspicious
        if total_blur_time > 120:
            return 0.9
        elif total_blur_time > 60:
            return 0.6
        elif total_blur_time > 30:
            return 0.3
        else:
            return 0.1
    
    def get_risk_level(self, risk_score):
        """Convert risk score to level"""
        if risk_score < 0.3:
            return 'low'
        elif risk_score < 0.7:
            return 'medium'
        else:
            return 'high'
    
    def get_severity(self, risk_score):
        """Get severity label"""
        return self.get_risk_level(risk_score)


# Global instance
risk_scorer = RiskScorer()

"""
Synthetic Data Generator for Behavioral Analytics
Generates realistic exam-taking behavior with normal and cheating patterns
"""

import numpy as np
from typing import Dict, List, Tuple
import json

class BehaviorDataGenerator:
    """
    Generates synthetic behavioral data for training anomaly detection models.
    Simulates mouse movements, keystroke dynamics, and tab-switching patterns.
    """
    
    def __init__(self, seed: int = 42):
        np.random.seed(seed)
        self.exam_duration = 3600  # 1 hour exam in seconds
        
    def generate_mouse_movements(self, user_type: str, duration: int) -> Dict:
        """
        Generate mouse movement data with realistic patterns.
        
        Features simulated:
        - Movement speed (pixels/second)
        - Pause frequency and duration
        - Jitter (micro-movements)
        - Trajectory smoothness
        - Click patterns
        """
        num_events = int(duration / 2)  # Event every 2 seconds on average
        
        if user_type == 'normal':
            # Normal user: smooth movements, regular pauses, human-like jitter
            speeds = np.random.gamma(shape=2, scale=50, size=num_events)  # Human-like speed distribution
            pauses = np.random.exponential(scale=3, size=num_events)  # Natural pause distribution
            jitter = np.random.normal(loc=2, scale=1, size=num_events)  # Small natural jitter
            smoothness = np.random.beta(a=8, b=2, size=num_events)  # Mostly smooth (0.7-0.9)
            
        elif user_type == 'copy_paste_cheater':
            # Sudden bursts of activity, then long pauses (looking up answers)
            speeds = np.concatenate([
                np.random.gamma(shape=1, scale=20, size=num_events//3),  # Slow searching
                np.random.gamma(shape=3, scale=100, size=num_events//3),  # Fast copying
                np.random.gamma(shape=1, scale=30, size=num_events//3)   # Pasting
            ])
            pauses = np.concatenate([
                np.random.exponential(scale=15, size=num_events//2),  # Long pauses
                np.random.exponential(scale=1, size=num_events//2)    # Quick actions
            ])
            np.random.shuffle(pauses)
            jitter = np.random.normal(loc=1, scale=0.5, size=num_events)  # Less jitter (more deliberate)
            smoothness = np.random.beta(a=3, b=5, size=num_events)  # Less smooth movements
            
        elif user_type == 'tab_switcher':
            # Frequent rapid movements to edges (switching tabs)
            speeds = np.random.gamma(shape=4, scale=80, size=num_events)  # Faster movements
            pauses = np.random.exponential(scale=5, size=num_events)  # Medium pauses
            jitter = np.random.normal(loc=3, scale=2, size=num_events)  # More jitter (nervousness)
            smoothness = np.random.beta(a=4, b=4, size=num_events)  # Variable smoothness
            
        elif user_type == 'bot_assisted':
            # Very mechanical, uniform patterns (bot-like)
            speeds = np.random.normal(loc=60, scale=5, size=num_events)  # Consistent speed
            pauses = np.random.normal(loc=4, scale=0.5, size=num_events)  # Uniform pauses
            jitter = np.random.normal(loc=0.5, scale=0.2, size=num_events)  # Minimal jitter
            smoothness = np.random.beta(a=10, b=1, size=num_events)  # Very smooth (0.9+)
            
        else:  # collaborative_cheater
            # Multiple behavior patterns (switching between users)
            speeds = np.concatenate([
                np.random.gamma(shape=2, scale=40, size=num_events//2),
                np.random.gamma(shape=2, scale=70, size=num_events//2)
            ])
            np.random.shuffle(speeds)
            pauses = np.random.exponential(scale=4, size=num_events)
            jitter = np.concatenate([
                np.random.normal(loc=2, scale=1, size=num_events//2),
                np.random.normal(loc=3, scale=1.5, size=num_events//2)
            ])
            np.random.shuffle(jitter)
            smoothness = np.random.beta(a=6, b=3, size=num_events)
        
        return {
            'speeds': speeds.clip(0, 500).tolist(),  # Clip to reasonable bounds
            'pauses': pauses.clip(0, 30).tolist(),
            'jitter': jitter.clip(0, 10).tolist(),
            'smoothness': smoothness.clip(0, 1).tolist(),
            'timestamps': np.cumsum(np.random.exponential(2, num_events)).tolist()
        }
    
    def generate_keystroke_dynamics(self, user_type: str, duration: int) -> Dict:
        """
        Generate keystroke timing data.
        
        Features simulated:
        - Inter-keystroke intervals
        - Typing bursts vs pauses
        - Key hold duration
        - Typing rhythm consistency
        - Backspace frequency
        """
        num_keystrokes = int(duration / 5)  # Keystroke every 5 seconds
        
        if user_type == 'normal':
            # Normal typing: consistent rhythm with natural variation
            intervals = np.random.gamma(shape=3, scale=0.15, size=num_keystrokes)
            hold_times = np.random.gamma(shape=2, scale=0.08, size=num_keystrokes)
            burst_sizes = np.random.poisson(lam=8, size=num_keystrokes//10)  # Words
            backspace_freq = np.random.binomial(1, 0.15, size=num_keystrokes)  # 15% backspace rate
            
        elif user_type == 'copy_paste_cheater':
            # Sudden bursts of typing (pasting), then long gaps
            intervals = np.concatenate([
                np.random.exponential(scale=10, size=num_keystrokes//2),  # Long gaps
                np.random.exponential(scale=0.05, size=num_keystrokes//2)  # Instant (paste)
            ])
            np.random.shuffle(intervals)
            hold_times = np.random.gamma(shape=2, scale=0.08, size=num_keystrokes)
            burst_sizes = np.concatenate([
                np.random.poisson(lam=1, size=num_keystrokes//20),
                np.random.poisson(lam=50, size=num_keystrokes//20)  # Large paste bursts
            ])
            backspace_freq = np.random.binomial(1, 0.05, size=num_keystrokes)  # Low backspace
            
        elif user_type == 'tab_switcher':
            # Interrupted typing patterns
            intervals = np.random.gamma(shape=2, scale=0.2, size=num_keystrokes)
            intervals[::20] *= 5  # Insert long pauses (switching tabs)
            hold_times = np.random.gamma(shape=2, scale=0.08, size=num_keystrokes)
            burst_sizes = np.random.poisson(lam=5, size=num_keystrokes//10)
            backspace_freq = np.random.binomial(1, 0.20, size=num_keystrokes)  # Higher backspace
            
        elif user_type == 'bot_assisted':
            # Very consistent, mechanical timing
            intervals = np.random.normal(loc=0.12, scale=0.02, size=num_keystrokes)
            hold_times = np.random.normal(loc=0.08, scale=0.01, size=num_keystrokes)
            burst_sizes = np.random.poisson(lam=12, size=num_keystrokes//10)  # Consistent bursts
            backspace_freq = np.random.binomial(1, 0.03, size=num_keystrokes)  # Very low backspace
            
        else:  # collaborative_cheater
            # Two distinct typing patterns
            intervals = np.concatenate([
                np.random.gamma(shape=3, scale=0.12, size=num_keystrokes//2),
                np.random.gamma(shape=3, scale=0.20, size=num_keystrokes//2)
            ])
            np.random.shuffle(intervals)
            hold_times = np.random.gamma(shape=2, scale=0.08, size=num_keystrokes)
            burst_sizes = np.random.poisson(lam=8, size=num_keystrokes//10)
            backspace_freq = np.random.binomial(1, 0.15, size=num_keystrokes)
        
        return {
            'intervals': intervals.clip(0, 20).tolist(),
            'hold_times': hold_times.clip(0, 1).tolist(),
            'burst_sizes': burst_sizes.clip(0, 100).tolist(),
            'backspace_freq': backspace_freq.tolist(),
            'timestamps': np.cumsum(intervals).tolist()
        }
    
    def generate_tab_switches(self, user_type: str, duration: int) -> Dict:
        """
        Generate window/tab switching events.
        
        Features simulated:
        - Switch frequency
        - Time spent away
        - Pattern regularity
        - Switch clustering (multiple quick switches)
        """
        if user_type == 'normal':
            # Minimal switching (0-3 times in exam)
            num_switches = np.random.randint(0, 4)
            switch_times = np.sort(np.random.uniform(0, duration, num_switches))
            time_away = np.random.exponential(scale=5, size=num_switches)  # Brief accidental switches
            
        elif user_type == 'copy_paste_cheater':
            # Frequent switches to look up answers
            num_switches = np.random.randint(15, 35)
            switch_times = np.sort(np.random.uniform(0, duration, num_switches))
            time_away = np.random.gamma(shape=2, scale=8, size=num_switches)  # Longer time away
            
        elif user_type == 'tab_switcher':
            # Very frequent switching (primary indicator)
            num_switches = np.random.randint(40, 80)
            switch_times = np.sort(np.random.uniform(0, duration, num_switches))
            time_away = np.random.gamma(shape=2, scale=6, size=num_switches)
            # Add clusters of quick switches
            for i in range(0, min(10, num_switches-3), 10):
                switch_times[i:i+3] = switch_times[i] + np.random.uniform(0, 2, 3)
            
        elif user_type == 'bot_assisted':
            # Periodic, regular switches (bot checking)
            num_switches = np.random.randint(8, 15)
            switch_times = np.linspace(100, duration-100, num_switches)  # Evenly spaced
            switch_times += np.random.normal(0, 20, num_switches)  # Small variation
            time_away = np.random.normal(loc=10, scale=2, size=num_switches)  # Consistent time
            
        else:  # collaborative_cheater
            # Moderate switching with communication pattern
            num_switches = np.random.randint(10, 25)
            switch_times = np.sort(np.random.uniform(0, duration, num_switches))
            time_away = np.random.gamma(shape=2, scale=7, size=num_switches)
        
        return {
            'num_switches': int(num_switches),
            'switch_times': switch_times.clip(0, duration).tolist(),
            'time_away': time_away.clip(0, 60).tolist(),
            'total_time_away': float(np.sum(time_away))
        }
    
    def generate_answer_patterns(self, user_type: str, num_questions: int = 50) -> Dict:
        """
        Generate answer submission patterns.
        
        Features simulated:
        - Time per question
        - Answer change frequency
        - Confidence (immediate vs hesitant answers)
        """
        if user_type == 'normal':
            time_per_q = np.random.gamma(shape=3, scale=40, size=num_questions)
            changes = np.random.binomial(1, 0.20, size=num_questions)  # 20% change answers
            
        elif user_type in ['copy_paste_cheater', 'tab_switcher']:
            # Varied time (long for looking up, quick for known)
            time_per_q = np.concatenate([
                np.random.gamma(shape=2, scale=80, size=num_questions//2),
                np.random.gamma(shape=2, scale=20, size=num_questions//2)
            ])
            np.random.shuffle(time_per_q)
            changes = np.random.binomial(1, 0.10, size=num_questions)  # Low changes (confident after cheating)
            
        elif user_type == 'bot_assisted':
            # Very consistent timing
            time_per_q = np.random.normal(loc=45, scale=5, size=num_questions)
            changes = np.random.binomial(1, 0.05, size=num_questions)  # Very few changes
            
        else:  # collaborative_cheater
            time_per_q = np.random.gamma(shape=3, scale=50, size=num_questions)
            changes = np.random.binomial(1, 0.15, size=num_questions)
        
        return {
            'time_per_question': time_per_q.clip(5, 300).tolist(),
            'answer_changes': changes.tolist(),
            'total_changes': int(np.sum(changes))
        }
    
    def generate_user_session(self, user_type: str = 'normal') -> Dict:
        """Generate a complete user session with all behavioral data."""
        duration = self.exam_duration + np.random.randint(-300, 300)  # ±5 min variation
        
        session = {
            'user_type': user_type,
            'duration': duration,
            'mouse': self.generate_mouse_movements(user_type, duration),
            'keyboard': self.generate_keystroke_dynamics(user_type, duration),
            'tabs': self.generate_tab_switches(user_type, duration),
            'answers': self.generate_answer_patterns(user_type)
        }
        
        return session
    
    def generate_dataset(self, 
                        n_normal: int = 1200,
                        n_copy_paste: int = 80,
                        n_tab_switch: int = 80,
                        n_bot: int = 70,
                        n_collab: int = 70) -> List[Dict]:
        """
        Generate complete dataset with various user types.
        
        Returns:
            List of user sessions with labels
        """
        print(f"Generating synthetic dataset...")
        print(f"  - Normal users: {n_normal}")
        print(f"  - Copy-paste cheaters: {n_copy_paste}")
        print(f"  - Tab-switchers: {n_tab_switch}")
        print(f"  - Bot-assisted: {n_bot}")
        print(f"  - Collaborative cheaters: {n_collab}")
        
        dataset = []
        
        # Generate normal users
        for i in range(n_normal):
            session = self.generate_user_session('normal')
            session['label'] = 0  # Normal
            session['user_id'] = f"normal_{i}"
            dataset.append(session)
        
        # Generate cheating patterns
        cheating_types = [
            ('copy_paste_cheater', n_copy_paste),
            ('tab_switcher', n_tab_switch),
            ('bot_assisted', n_bot),
            ('collaborative_cheater', n_collab)
        ]
        
        for cheat_type, count in cheating_types:
            for i in range(count):
                session = self.generate_user_session(cheat_type)
                session['label'] = 1  # Anomaly
                session['user_id'] = f"{cheat_type}_{i}"
                dataset.append(session)
        
        print(f"✓ Generated {len(dataset)} total sessions")
        return dataset
    
    def save_dataset(self, dataset: List[Dict], filepath: str):
        """Save dataset to JSON file."""
        with open(filepath, 'w') as f:
            json.dump(dataset, f, indent=2)
        print(f"✓ Dataset saved to {filepath}")


if __name__ == "__main__":
    # Generate dataset
    generator = BehaviorDataGenerator(seed=42)
    dataset = generator.generate_dataset()
    
    # Save to file
    generator.save_dataset(dataset, 'synthetic_exam_data.json')
    
    # Print statistics
    normal_count = sum(1 for s in dataset if s['label'] == 0)
    anomaly_count = sum(1 for s in dataset if s['label'] == 1)
    
    print(f"\n{'='*50}")
    print(f"Dataset Statistics:")
    print(f"  Total sessions: {len(dataset)}")
    print(f"  Normal: {normal_count} ({normal_count/len(dataset)*100:.1f}%)")
    print(f"  Anomalous: {anomaly_count} ({anomaly_count/len(dataset)*100:.1f}%)")
    print(f"{'='*50}")
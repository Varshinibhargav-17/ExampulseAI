"""
Main Execution Script
Runs the complete behavioral analytics pipeline
"""

import os
import sys
import time


def print_banner():
    """Print startup banner"""
    banner = """
    ╔══════════════════════════════════════════════════════════════════╗
    ║                                                                  ║
    ║   BEHAVIORAL ANALYTICS FOR ONLINE ASSESSMENT INTEGRITY          ║
    ║   Privacy-First Cheating Detection System                       ║
    ║                                                                  ║
    ║   Hackathon Project - Full Pipeline Execution                   ║
    ║                                                                  ║
    ╚══════════════════════════════════════════════════════════════════╝
    """
    print(banner)


def print_phase(phase_num, phase_name, description):
    """Print phase header"""
    print("\n" + "="*70)
    print(f"PHASE {phase_num}: {phase_name}")
    print("="*70)
    print(f"→ {description}\n")


def run_pipeline(skip_data_gen=False, skip_training=False):
    """
    Run the complete pipeline
    
    Args:
        skip_data_gen: Skip data generation if data already exists
        skip_training: Skip training if model already exists
    """
    start_time = time.time()
    
    print_banner()
    
    # Phase 1: Data Generation
    if not skip_data_gen or not os.path.exists('synthetic_exam_data.npy'):
        print_phase(1, "SYNTHETIC DATA GENERATION", 
                   "Creating realistic behavioral data with normal and cheating patterns")
        
        from synthetic_data_generator import BehavioralDataGenerator
        
        generator = BehavioralDataGenerator(seed=42)
        sessions = generator.generate_dataset(n_normal=1200, n_cheating_per_type=60)
        generator.save_dataset(sessions, 'synthetic_exam_data.npy')
        
        print(f"\n✓ Phase 1 complete: Generated {len(sessions)} sessions")
    else:
        print_phase(1, "SYNTHETIC DATA GENERATION", "SKIPPED - Data already exists")
    
    # Phase 2: Feature Extraction
    if not skip_data_gen or not os.path.exists('features_X.npy'):
        print_phase(2, "FEATURE EXTRACTION",
                   "Extracting 40+ behavioral features from raw data")
        
        import numpy as np
        from feature_extractor import BehavioralFeatureExtractor
        
        sessions = np.load('synthetic_exam_data.npy', allow_pickle=True)
        extractor = BehavioralFeatureExtractor()
        
        X = extractor.extract_features_batch(sessions)
        y = np.array([s['label'] for s in sessions])
        
        np.save('features_X.npy', X)
        np.save('labels_y.npy', y)
        
        print(f"\n✓ Phase 2 complete: Extracted {X.shape[1]} features from {X.shape[0]} sessions")
    else:
        print_phase(2, "FEATURE EXTRACTION", "SKIPPED - Features already exist")
    
    # Phase 3: Model Training
    if not skip_training or not os.path.exists('anomaly_detection_model.joblib'):
        print_phase(3, "MODEL TRAINING",
                   "Training Isolation Forest for global anomaly detection")
        
        import numpy as np
        from model_trainer import AnomalyDetectionModel
        from feature_extractor import BehavioralFeatureExtractor
        
        X = np.load('features_X.npy')
        y = np.load('labels_y.npy')
        
        sessions = np.load('synthetic_exam_data.npy', allow_pickle=True)
        extractor = BehavioralFeatureExtractor()
        _ = extractor.extract_all_features(sessions[0])
        feature_names = extractor.get_feature_names()
        
        model = AnomalyDetectionModel(contamination=0.2, random_state=42)
        X_train, X_test, y_train, y_test = model.prepare_data(X, y, test_size=0.2)
        model.train(X_train, feature_names)
        
        metrics, predictions, scores = model.evaluate(X_test, y_test)
        model.plot_score_distribution(scores, y_test)
        model.plot_roc_curve(y_test, scores)
        
        print("\n→ Computing feature importance...")
        importances, top_features = model.get_feature_importance(X_test, y_test, n_top=10)
        
        model.save_model('anomaly_detection_model.joblib')
        
        print(f"\n✓ Phase 3 complete: Model trained with {metrics['roc_auc']:.3f} ROC AUC")
    else:
        print_phase(3, "MODEL TRAINING", "SKIPPED - Model already exists")
    
    # Phase 4: Baseline Profiling Demo
    print_phase(4, "BASELINE PROFILING & RISK SCORING",
               "Demonstrating personalized anomaly detection")
    
    from baseline_profiler import UserBaselineProfiler, HybridRiskScorer
    from feature_extractor import BehavioralFeatureExtractor
    from synthetic_data_generator import BehavioralDataGenerator
    import numpy as np
    
    generator = BehavioralDataGenerator(seed=42)
    extractor = BehavioralFeatureExtractor()
    
    # Generate sample sessions
    mock_test = generator.generate_session(duration_seconds=120, session_type='normal')
    normal_exam = generator.generate_session(duration_seconds=3600, session_type='normal')
    cheating_exam = generator.generate_session(duration_seconds=3600, session_type='cheating_copy_paste')
    
    # Create baseline
    profiler = UserBaselineProfiler()
    baseline = profiler.create_baseline_profile(mock_test, extractor)
    profiler.save_baseline(baseline, 'demo_user_baseline.joblib')
    
    # Initialize scorer and evaluate
    scorer = HybridRiskScorer('anomaly_detection_model.joblib')
    
    print("\n→ Evaluating normal exam session:")
    normal_risk = scorer.compute_risk_score(normal_exam, baseline, extractor)
    print(f"   Risk Score: {normal_risk['hybrid_risk_score']:.3f} [{normal_risk['risk_level']}]")
    
    print("\n→ Evaluating cheating exam session:")
    cheating_risk = scorer.compute_risk_score(cheating_exam, baseline, extractor)
    print(f"   Risk Score: {cheating_risk['hybrid_risk_score']:.3f} [{cheating_risk['risk_level']}]")
    
    print(f"\n✓ Phase 4 complete: Baseline profiling demonstrated")
    
    # Phase 5: Integration Demo
    print_phase(5, "INTEGRATION & API DEMO",
               "Running integration examples for teammates")
    
    print("\n→ Running integration examples...")
    print("   (See integration_demo.py for detailed examples)")
    
    from integration_demo import BehavioralAnalyticsAPI
    
    api = BehavioralAnalyticsAPI('anomaly_detection_model.joblib')
    
    # Create a quick demo baseline
    mock_data = {
        'mouse': {
            'timestamps': np.linspace(0, 120, 1200),
            'x': np.cumsum(np.random.randn(1200) * 10),
            'y': np.cumsum(np.random.randn(1200) * 10),
            'velocities': np.abs(np.random.randn(1200) * 50),
            'clicks': np.random.randint(0, 2, 1200)
        },
        'keystroke': {
            'timestamps': np.sort(np.random.uniform(0, 120, 200)),
            'intervals': np.random.gamma(2, 100, 200),
            'backspace_indices': np.random.choice(200, 10, replace=False),
            'paste_timestamps': np.array([20, 60]),
            'n_keystrokes': 200,
            'n_paste': 2
        },
        'tab_switch': {
            'switch_times': np.array([30, 90]),
            'away_durations': np.array([2, 3]),
            'n_switches': 2,
            'total_time_away': 5
        },
        'duration': 120
    }
    
    baseline = api.create_user_baseline(mock_data, user_id='demo_user')
    api.save_user_baseline(baseline, 'api_demo_baseline.joblib')
    
    print("   ✓ API examples ready")
    print(f"\n✓ Phase 5 complete: Integration demonstrated")
    
    # Summary
    elapsed_time = time.time() - start_time
    minutes = int(elapsed_time // 60)
    seconds = int(elapsed_time % 60)
    
    print("\n" + "="*70)
    print("PIPELINE EXECUTION COMPLETE")
    print("="*70)
    print(f"\n⏱️  Total execution time: {minutes}m {seconds}s\n")
    
    print("📦 Generated Files:")
    files = [
        ('synthetic_exam_data.npy', 'Raw synthetic behavioral data'),
        ('features_X.npy', 'Extracted feature matrix'),
        ('labels_y.npy', 'Labels (0=normal, 1=cheating)'),
        ('anomaly_detection_model.joblib', 'Trained Isolation Forest model'),
        ('score_distribution.png', 'Visualization of anomaly scores'),
        ('roc_curve.png', 'ROC curve for model performance'),
        ('demo_user_baseline.joblib', 'Example user baseline profile'),
        ('api_demo_baseline.joblib', 'API demo baseline')
    ]
    
    for filename, description in files:
        if os.path.exists(filename):
            print(f"   ✓ {filename:<35} - {description}")
    
    print("\n🚀 Next Steps:")
    print("   1. Review model performance in score_distribution.png and roc_curve.png")
    print("   2. Run integration_demo.py for detailed usage examples")
    print("   3. Share these files with your teammates:")
    print("      • anomaly_detection_model.joblib")
    print("      • feature_extractor.py")
    print("      • baseline_profiler.py")
    print("      • integration_demo.py")
    print("   4. Your teammates can use BehavioralAnalyticsAPI for integration")
    
    print("\n📖 Documentation:")
    print("   • README.md - Complete project documentation")
    print("   • integration_demo.py - Integration guide with examples")
    
    print("\n" + "="*70)
    print("✅ ALL SYSTEMS READY FOR HACKATHON DEMO!")
    print("="*70 + "\n")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Run behavioral analytics pipeline')
    parser.add_argument('--skip-data', action='store_true',
                       help='Skip data generation if data exists')
    parser.add_argument('--skip-training', action='store_true',
                       help='Skip model training if model exists')
    parser.add_argument('--quick', action='store_true',
                       help='Skip both data generation and training if files exist')
    
    args = parser.parse_args()
    
    skip_data = args.skip_data or args.quick
    skip_training = args.skip_training or args.quick
    
    try:
        run_pipeline(skip_data_gen=skip_data, skip_training=skip_training)
    except KeyboardInterrupt:
        print("\n\n⚠️  Pipeline interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error during execution: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
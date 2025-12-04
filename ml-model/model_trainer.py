"""
Model Trainer for Behavioral Anomaly Detection
Trains Isolation Forest on synthetic data and provides evaluation metrics
"""

import numpy as np
import json
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, 
    confusion_matrix, 
    roc_auc_score,
    precision_recall_curve,
    auc
)
from typing import Dict, Tuple
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt

from synthetic_data_generator import BehaviorDataGenerator
from feature_extractor import BehaviorFeatureExtractor


class AnomalyDetectionTrainer:
    """
    Trains and evaluates an Isolation Forest model for detecting cheating behavior.
    """
    
    def __init__(self, contamination: float = 0.15, random_state: int = 42):
        """
        Args:
            contamination: Expected proportion of anomalies in dataset
            random_state: Random seed for reproducibility
        """
        self.contamination = contamination
        self.random_state = random_state
        
        self.scaler = StandardScaler()
        self.model = IsolationForest(
            contamination=contamination,
            random_state=random_state,
            n_estimators=150,
            max_samples='auto',
            max_features=1.0,
            bootstrap=False,
            n_jobs=-1,
            verbose=0
        )
        
        self.feature_extractor = BehaviorFeatureExtractor()
        self.feature_names = []
        
    def prepare_data(self, dataset: list) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Extract features and labels from dataset.
        
        Returns:
            X: Feature matrix
            y: Labels (0=normal, 1=anomaly)
            user_ids: User identifiers
        """
        print("\n" + "="*60)
        print("DATA PREPARATION")
        print("="*60)
        
        # Extract features
        X = self.feature_extractor.extract_features_from_dataset(dataset)
        self.feature_names = self.feature_extractor.get_feature_names()
        
        # Extract labels
        y = np.array([session['label'] for session in dataset])
        user_ids = np.array([session['user_id'] for session in dataset])
        
        print(f"\n✓ Prepared data: {X.shape[0]} samples, {X.shape[1]} features")
        print(f"  - Normal samples: {np.sum(y == 0)}")
        print(f"  - Anomalous samples: {np.sum(y == 1)}")
        
        return X, y, user_ids
    
    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> Dict:
        """
        Train the Isolation Forest model.
        
        Returns:
            Training metrics
        """
        print("\n" + "="*60)
        print("MODEL TRAINING")
        print("="*60)
        
        # Standardize features
        print("Standardizing features...")
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train model
        print(f"Training Isolation Forest (n_estimators=150, contamination={self.contamination})...")
        self.model.fit(X_train_scaled)
        
        # Get predictions on training set
        y_pred_train = self.model.predict(X_train_scaled)
        y_pred_train = np.where(y_pred_train == -1, 1, 0)  # Convert -1/1 to 1/0
        
        # Get anomaly scores
        scores_train = -self.model.score_samples(X_train_scaled)  # Higher = more anomalous
        
        # Calculate metrics
        train_metrics = self._calculate_metrics(y_train, y_pred_train, scores_train)
        
        print(f"\n✓ Training completed")
        print(f"  - Training Accuracy: {train_metrics['accuracy']:.3f}")
        print(f"  - Training Precision: {train_metrics['precision']:.3f}")
        print(f"  - Training Recall: {train_metrics['recall']:.3f}")
        print(f"  - Training F1: {train_metrics['f1']:.3f}")
        
        return train_metrics
    
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray) -> Dict:
        """
        Evaluate model on test set.
        
        Returns:
            Test metrics
        """
        print("\n" + "="*60)
        print("MODEL EVALUATION")
        print("="*60)
        
        # Standardize features
        X_test_scaled = self.scaler.transform(X_test)
        
        # Get predictions
        y_pred = self.model.predict(X_test_scaled)
        y_pred = np.where(y_pred == -1, 1, 0)
        
        # Get anomaly scores
        scores = -self.model.score_samples(X_test_scaled)
        
        # Calculate metrics
        test_metrics = self._calculate_metrics(y_test, y_pred, scores)
        
        # Print results
        print("\nTest Set Performance:")
        print(f"  - Accuracy: {test_metrics['accuracy']:.3f}")
        print(f"  - Precision: {test_metrics['precision']:.3f}")
        print(f"  - Recall: {test_metrics['recall']:.3f}")
        print(f"  - F1 Score: {test_metrics['f1']:.3f}")
        print(f"  - ROC-AUC: {test_metrics['roc_auc']:.3f}")
        print(f"  - PR-AUC: {test_metrics['pr_auc']:.3f}")
        
        print("\nConfusion Matrix:")
        print("                Predicted")
        print("              Normal  Anomaly")
        print(f"Actual Normal   {test_metrics['tn']:6d}  {test_metrics['fp']:6d}")
        print(f"       Anomaly  {test_metrics['fn']:6d}  {test_metrics['tp']:6d}")
        
        print("\nClassification Report:")
        print(test_metrics['classification_report'])
        
        return test_metrics
    
    def _calculate_metrics(self, y_true: np.ndarray, y_pred: np.ndarray, 
                          scores: np.ndarray) -> Dict:
        """Calculate comprehensive evaluation metrics."""
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        
        metrics = {
            'accuracy': float((tp + tn) / (tp + tn + fp + fn)),
            'precision': float(tp / (tp + fp)) if (tp + fp) > 0 else 0.0,
            'recall': float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0,
            'f1': float(2 * tp / (2 * tp + fp + fn)) if (2 * tp + fp + fn) > 0 else 0.0,
            'tp': int(tp),
            'tn': int(tn),
            'fp': int(fp),
            'fn': int(fn),
            'roc_auc': float(roc_auc_score(y_true, scores)),
            'classification_report': classification_report(y_true, y_pred, 
                                                          target_names=['Normal', 'Anomaly'])
        }
        
        # Calculate PR-AUC
        precision, recall, _ = precision_recall_curve(y_true, scores)
        metrics['pr_auc'] = float(auc(recall, precision))
        
        return metrics
    
    def get_feature_importance(self, X: np.ndarray, y: np.ndarray, 
                              top_n: int = 15) -> Dict:
        """
        Calculate feature importance using permutation method.
        
        Returns:
            Dictionary of feature names and importance scores
        """
        print("\nCalculating feature importance...")
        
        X_scaled = self.scaler.transform(X)
        base_score = -self.model.score_samples(X_scaled)
        base_auc = roc_auc_score(y, base_score)
        
        importances = []
        
        for i, feature_name in enumerate(self.feature_names):
            # Permute feature
            X_permuted = X_scaled.copy()
            np.random.shuffle(X_permuted[:, i])
            
            # Calculate score with permuted feature
            permuted_score = -self.model.score_samples(X_permuted)
            permuted_auc = roc_auc_score(y, permuted_score)
            
            # Importance = drop in performance
            importance = base_auc - permuted_auc
            importances.append((feature_name, importance))
        
        # Sort by importance
        importances.sort(key=lambda x: x[1], reverse=True)
        
        print(f"\nTop {top_n} Most Important Features:")
        for i, (name, imp) in enumerate(importances[:top_n], 1):
            print(f"  {i:2d}. {name:30s}: {imp:.4f}")
        
        return dict(importances)
    
    def save_model(self, model_path: str = 'anomaly_detector.joblib',
                   scaler_path: str = 'feature_scaler.joblib',
                   metadata_path: str = 'model_metadata.json'):
        """Save trained model, scaler, and metadata."""
        print("\n" + "="*60)
        print("SAVING MODEL")
        print("="*60)
        
        # Save model
        joblib.dump(self.model, model_path)
        print(f"✓ Model saved to {model_path}")
        
        # Save scaler
        joblib.dump(self.scaler, scaler_path)
        print(f"✓ Scaler saved to {scaler_path}")
        
        # Save metadata
        metadata = {
            'feature_names': self.feature_names,
            'contamination': self.contamination,
            'n_features': len(self.feature_names),
            'model_type': 'IsolationForest',
            'n_estimators': self.model.n_estimators
        }
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"✓ Metadata saved to {metadata_path}")
        
    def load_model(self, model_path: str = 'anomaly_detector.joblib',
                   scaler_path: str = 'feature_scaler.joblib',
                   metadata_path: str = 'model_metadata.json'):
        """Load trained model, scaler, and metadata."""
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        self.feature_names = metadata['feature_names']
        
        print(f"✓ Model loaded from {model_path}")
        print(f"  - Features: {metadata['n_features']}")
        print(f"  - Model: {metadata['model_type']}")


def train_complete_model():
    """Complete training pipeline."""
    print("\n" + "="*60)
    print("BEHAVIORAL ANOMALY DETECTION - TRAINING PIPELINE")
    print("="*60)
    
    # Step 1: Generate synthetic data
    print("\nStep 1: Generating synthetic data...")
    generator = BehaviorDataGenerator(seed=42)
    dataset = generator.generate_dataset(
        n_normal=1200,
        n_copy_paste=80,
        n_tab_switch=80,
        n_bot=70,
        n_collab=70
    )
    
    # Save dataset
    generator.save_dataset(dataset, 'synthetic_exam_data.json')
    
    # Step 2: Prepare data
    trainer = AnomalyDetectionTrainer(contamination=0.15)
    X, y, user_ids = trainer.prepare_data(dataset)
    
    # Step 3: Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\nData split:")
    print(f"  - Training: {X_train.shape[0]} samples")
    print(f"  - Testing: {X_test.shape[0]} samples")
    
    # Step 4: Train model
    train_metrics = trainer.train(X_train, y_train)
    
    # Step 5: Evaluate model
    test_metrics = trainer.evaluate(X_test, y_test)
    
    # Step 6: Feature importance
    importance = trainer.get_feature_importance(X_test, y_test, top_n=15)
    
    # Step 7: Save model
    trainer.save_model()
    
    # Step 8: Save results
    results = {
        'train_metrics': train_metrics,
        'test_metrics': test_metrics,
        'feature_importance': importance
    }
    
    with open('training_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "="*60)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("="*60)
    print("\nFiles generated:")
    print("  1. synthetic_exam_data.json - Training dataset")
    print("  2. anomaly_detector.joblib - Trained model")
    print("  3. feature_scaler.joblib - Feature scaler")
    print("  4. model_metadata.json - Model configuration")
    print("  5. training_results.json - Performance metrics")
    print("\n" + "="*60)
    
    return trainer, test_metrics


if __name__ == "__main__":
    trainer, metrics = train_complete_model()
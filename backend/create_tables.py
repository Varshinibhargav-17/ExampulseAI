# create_tables.py
"""
Database initialization script
Creates all tables defined in models
"""
from app import create_app, db
from app.models import User, Exam, ExamSession, Event, Alert, Baseline

def init_db():
    """Initialize database with all tables"""
    app = create_app()
    
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Create a default proctor user for testing
        from werkzeug.security import generate_password_hash
        
        existing_proctor = User.query.filter_by(email='proctor@exampulse.ai').first()
        if not existing_proctor:
            proctor = User(
                name='Dr. Smith',
                email='proctor@exampulse.ai',
                password_hash=generate_password_hash('password123'),
                role='proctor',
                department='Computer Science'
            )
            db.session.add(proctor)
            db.session.commit()
            print("✅ Default proctor created (email: proctor@exampulse.ai, password: password123)")
        
        print("\n📊 Database initialized successfully!")
        print("You can now run the application with: python run.py")

if __name__ == '__main__':
    init_db()

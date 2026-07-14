from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(150), nullable=False)
    is_premium = Column(Boolean, default=False)
    session_version = Column(Integer, default=1, nullable=False)

engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)

db = SessionLocal()
u = User(email="rajdeeppalwork@gmail.com")
db.add(u)
db.commit()

# Simulate login
user = db.query(User).filter(User.email == "rajdeeppalwork@gmail.com").first()
if user.email == "rajdeeppalwork@gmail.com" and not user.is_premium:
    user.is_premium = True
    db.commit()

# Try to access properties after commit
try:
    print("User ID:", user.id)
    print("Session Version:", user.session_version)
except Exception as e:
    print("ERROR:", str(e))

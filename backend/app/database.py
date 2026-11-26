from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import inspect, text
import os
from .config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)
    # Ensure existing SQLite or PostgreSQL databases get newly added columns
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    with engine.connect() as conn:
        if "user" in tables:
            user_cols = [c["name"] for c in inspector.get_columns("user")]
            if "credits" not in user_cols:
                conn.execute(text('ALTER TABLE "user" ADD COLUMN credits INTEGER NOT NULL DEFAULT 10'))

        if "caption_record" in tables:
            cap_cols = [c["name"] for c in inspector.get_columns("caption_record")]
            if "title" not in cap_cols:
                conn.execute(text('ALTER TABLE "caption_record" ADD COLUMN title TEXT'))
            if "language" not in cap_cols:
                conn.execute(text("ALTER TABLE \"caption_record\" ADD COLUMN language TEXT NOT NULL DEFAULT 'English (US)'"))
            if "tone" not in cap_cols:
                conn.execute(text("ALTER TABLE \"caption_record\" ADD COLUMN tone TEXT NOT NULL DEFAULT 'Default'"))
            if "length" not in cap_cols:
                conn.execute(text("ALTER TABLE \"caption_record\" ADD COLUMN length TEXT NOT NULL DEFAULT 'Default'"))
            if "platform_captions" not in cap_cols:
                col_type = "JSONB" if engine.dialect.name == "postgresql" else "JSON"
                conn.execute(text(f'ALTER TABLE "caption_record" ADD COLUMN platform_captions {col_type}'))
        conn.commit()

def get_session():
    with Session(engine) as session:
        yield session

from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
import os
from .config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)
    # Ensure existing SQLite databases get newly added columns
    with engine.connect() as conn:
        user_cols = [row[1] for row in conn.execute(text('PRAGMA table_info("user")')).fetchall()]
        if "credits" not in user_cols:
            conn.execute(text('ALTER TABLE "user" ADD COLUMN credits INTEGER NOT NULL DEFAULT 10'))

        cap_cols = [row[1] for row in conn.execute(text('PRAGMA table_info("caption_record")')).fetchall()]
        if cap_cols:
            if "title" not in cap_cols:
                conn.execute(text('ALTER TABLE "caption_record" ADD COLUMN title TEXT'))
            if "language" not in cap_cols:
                conn.execute(text('ALTER TABLE "caption_record" ADD COLUMN language TEXT NOT NULL DEFAULT \'English (US)\''))
            if "tone" not in cap_cols:
                conn.execute(text('ALTER TABLE "caption_record" ADD COLUMN tone TEXT NOT NULL DEFAULT \'Default\''))
            if "length" not in cap_cols:
                conn.execute(text('ALTER TABLE "caption_record" ADD COLUMN length TEXT NOT NULL DEFAULT \'Default\''))
            if "platform_captions" not in cap_cols:
                conn.execute(text('ALTER TABLE "caption_record" ADD COLUMN platform_captions JSON'))
        conn.commit()

def get_session():
    with Session(engine) as session:
        yield session

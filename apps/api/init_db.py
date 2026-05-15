import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models.base import Base
import app.models  # ensure all models are loaded
from app.config import get_settings

async def init_db():
    settings = get_settings()
    print("Database URL:", settings.database_url)
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())

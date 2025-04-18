import logging

from app.db.init_db import init_db
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main() -> None:
    """
    اسکریپت اولیه‌سازی پایگاه داده
    """
    logger.info("ایجاد پایگاه داده اولیه")
    db = SessionLocal()
    init_db(db)
    logger.info("پایگاه داده اولیه ایجاد شد")

if __name__ == "__main__":
    main() 
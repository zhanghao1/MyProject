
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('oracle://aibatch:aibatch@20.26.11.6:1521/cshp03', echo=True)

DBSession = sessionmaker(bind=engine)
session = DBSession()
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

# from . import crud, models, schemas
# from .database import SessionLocal, engine

from crud import create_question, get_questions, create_response
from models import Base, Question, Choice, Response
from schemas import QuestionCreate, Question, ResponseCreate, Response, Contact
from database import SessionLocal, engine
import models
import schemas
import crud
from email_service import send_contact_email

models.Base.metadata.create_all(bind=engine)


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes
    allow_headers=["*"],  # Permet tous les en-têtes
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/questions/", response_model=schemas.Question)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db=db, question=question)


@app.get("/questions/", response_model=list[schemas.Question])
def read_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    questions = crud.get_questions(db, skip=skip, limit=limit)
    return questions


@app.post("/responses/", response_model=schemas.Response)
def create_response(response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    return crud.create_response(db=db, response=response)


@app.post("/contact/")
async def send_contact(contact: schemas.Contact):
    """
    Send a contact email with automatic reply-to and copy to sender.
    """
    success = await send_contact_email(
        sender_email=contact.email,
        sender_name=contact.nom,
        sender_prenom=contact.prenom,
        raison=contact.raison,
        message=contact.message,
        contact_type=contact.contact_type,
        attachments=contact.attachments,
    )
    
    if success:
        return {"status": "success", "message": "Email sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")

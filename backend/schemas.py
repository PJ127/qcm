from pydantic import BaseModel

from typing import Optional


class ChoiceBase(BaseModel):
    text: str
    is_correct: bool


class ChoiceCreate(ChoiceBase):
    pass


class Choice(ChoiceBase):
    id: int
    question_id: int

    class Config:
        orm_mode = True


class QuestionBase(BaseModel):
    title: str
    text: str
    image_url: str
    image_explanation_url: str
    explanation: str
    answer_id: Optional[int] = None
    is_correct: bool = False
    validated: bool = False
    is_reached: bool = False


class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase):
    id: int
    choices: list[Choice] = []

    class Config:
        orm_mode = True


class ResponseBase(BaseModel):
    question_id: int
    choice_id: int


class ResponseCreate(ResponseBase):
    pass


class Response(ResponseBase):
    id: int

    class Config:
        orm_mode = True

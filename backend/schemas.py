from pydantic import BaseModel


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
    explanation: str


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

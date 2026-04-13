from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class LessonBase(BaseModel):
    title: str
    content: str | None = None
    order: int = 0


class LessonCreate(LessonBase):
    course_id: int


class LessonUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    order: int | None = None


class LessonRead(LessonBase):
    id: int
    course_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

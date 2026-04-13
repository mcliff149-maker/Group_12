from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from .lesson import LessonRead


class CourseBase(BaseModel):
    title: str
    description: str | None = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None


class CourseRead(CourseBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CourseReadWithLessons(CourseRead):
    lessons: list[LessonRead] = []

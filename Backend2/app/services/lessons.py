from __future__ import annotations

from sqlalchemy.orm import Session

from ..models.lesson import Lesson
from ..schemas.lesson import LessonCreate, LessonUpdate


def get_lesson(db: Session, lesson_id: int) -> Lesson | None:
    return db.get(Lesson, lesson_id)


def list_lessons(db: Session, course_id: int | None = None, skip: int = 0, limit: int = 100) -> list[Lesson]:
    q = db.query(Lesson)
    if course_id is not None:
        q = q.filter(Lesson.course_id == course_id)
    return q.order_by(Lesson.order).offset(skip).limit(limit).all()


def create_lesson(db: Session, lesson_in: LessonCreate) -> Lesson:
    db_lesson = Lesson(**lesson_in.model_dump())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson


def update_lesson(db: Session, lesson: Lesson, lesson_in: LessonUpdate) -> Lesson:
    for field, value in lesson_in.model_dump(exclude_unset=True).items():
        setattr(lesson, field, value)
    db.commit()
    db.refresh(lesson)
    return lesson


def delete_lesson(db: Session, lesson: Lesson) -> None:
    db.delete(lesson)
    db.commit()

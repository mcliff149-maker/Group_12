from __future__ import annotations

from sqlalchemy.orm import Session

from ..models.course import Course
from ..schemas.course import CourseCreate, CourseUpdate


def get_course(db: Session, course_id: int) -> Course | None:
    return db.get(Course, course_id)


def list_courses(db: Session, skip: int = 0, limit: int = 100) -> list[Course]:
    return db.query(Course).offset(skip).limit(limit).all()


def create_course(db: Session, course_in: CourseCreate, owner_id: int) -> Course:
    db_course = Course(**course_in.model_dump(), owner_id=owner_id)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


def update_course(db: Session, course: Course, course_in: CourseUpdate) -> Course:
    for field, value in course_in.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course: Course) -> None:
    db.delete(course)
    db.commit()

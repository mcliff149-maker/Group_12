from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..dependencies import get_current_active_user, get_db
from ..models.user import User
from ..schemas.lesson import LessonCreate, LessonRead, LessonUpdate
from ..services.courses import get_course
from ..services.lessons import create_lesson, delete_lesson, get_lesson, list_lessons, update_lesson

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("/", response_model=list[LessonRead])
def read_lessons(
    course_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[LessonRead]:
    """List lessons, optionally filtered by course_id (public)."""
    return list_lessons(db, course_id=course_id, skip=skip, limit=limit)


@router.post("/", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
def create_lesson_endpoint(
    lesson_in: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> LessonRead:
    """Create a lesson inside a course (course owner or admin)."""
    course = get_course(db, lesson_in.course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return create_lesson(db, lesson_in)


@router.get("/{lesson_id}", response_model=LessonRead)
def read_lesson(lesson_id: int, db: Session = Depends(get_db)) -> LessonRead:
    """Get a single lesson (public)."""
    lesson = get_lesson(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson


@router.patch("/{lesson_id}", response_model=LessonRead)
def update_lesson_endpoint(
    lesson_id: int,
    lesson_in: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> LessonRead:
    """Update a lesson (course owner or admin)."""
    lesson = get_lesson(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    course = get_course(db, lesson.course_id)
    if course and course.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return update_lesson(db, lesson, lesson_in)


@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lesson_endpoint(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete a lesson (course owner or admin)."""
    lesson = get_lesson(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    course = get_course(db, lesson.course_id)
    if course and course.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    delete_lesson(db, lesson)

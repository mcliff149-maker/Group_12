from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..dependencies import get_current_active_user, get_db
from ..models.user import User
from ..schemas.course import CourseCreate, CourseRead, CourseReadWithLessons, CourseUpdate
from ..services.courses import create_course, delete_course, get_course, list_courses, update_course

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/", response_model=list[CourseRead])
def read_courses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[CourseRead]:
    """List all courses (public)."""
    return list_courses(db, skip=skip, limit=limit)


@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course_endpoint(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> CourseRead:
    """Create a new course (authenticated)."""
    return create_course(db, course_in, owner_id=current_user.id)


@router.get("/{course_id}", response_model=CourseReadWithLessons)
def read_course(
    course_id: int,
    db: Session = Depends(get_db),
) -> CourseReadWithLessons:
    """Get a single course with its lessons (public)."""
    course = get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course


@router.patch("/{course_id}", response_model=CourseRead)
def update_course_endpoint(
    course_id: int,
    course_in: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> CourseRead:
    """Update a course (owner or admin)."""
    course = get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return update_course(db, course, course_in)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course_endpoint(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete a course (owner or admin)."""
    course = get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    delete_course(db, course)

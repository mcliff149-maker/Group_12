"""
REST API views for the ILES React frontend.

URL prefix: /api/
"""
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Log, Timesheet, Verification, Review
from .serializers import (
    UserPublicSerializer,
    SignUpSerializer,
    CreateUserAdminSerializer,
    UpdateProfileSerializer,
    LogSerializer,
    TimesheetSerializer,
    VerificationSerializer,
    ReviewSerializer,
)

User = get_user_model()

def _first_error(serializer_errors):
    """Return the first validation error message from a serializer's errors dict."""
    return str(next(iter(serializer_errors.values()))[0])

# ── Helpers ───────────────────────────────────────────────────────────────────

def _user_to_dict(user):
    """Return the public dict representation of a user."""
    return {
        'id': user.id,
        'username': user.username,
        'name': user.get_full_name() or user.username,
        'email': user.email,
        'role': user.role,
        'disabled': not user.is_active,
        'profileData': user.profile_data or {},
    }


def _tokens_for_user(user):
    """Return a fresh access + refresh token pair for *user*."""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)


def _require_role(request, *roles):
    """Return 403 Response if the request user's role is not in *roles*, else None."""
    if request.user.role not in roles:
        return Response({'message': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    return None


# ── Auth ──────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    """POST /api/auth/signin — {username, password, role} → {user, token}"""
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    role = request.data.get('role', '').strip()

    if not username or not password or not role:
        return Response({'message': 'username, password and role are required.'}, status=400)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'message': 'Invalid credentials or role.'}, status=401)

    if not user.check_password(password):
        return Response({'message': 'Invalid credentials or role.'}, status=401)
    if user.role != role:
        return Response({'message': 'Invalid credentials or role.'}, status=401)
    if not user.is_active:
        return Response({'message': 'This account has been disabled.'}, status=403)

    access, refresh = _tokens_for_user(user)
    return Response({'user': _user_to_dict(user), 'token': access, 'refreshToken': refresh})


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    """POST /api/auth/signup — create a new account."""
    serializer = SignUpSerializer(data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    user = serializer.save()
    return Response(_user_to_dict(user), status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """GET /api/auth/me — current user."""
    return Response(_user_to_dict(request.user))


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_me(request):
    """PATCH /api/auth/me — update name, email, and/or profile_data."""
    serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    user = serializer.save()
    return Response(_user_to_dict(user))


# ── Admin ─────────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_users(request):
    """GET /api/admin/users — list all users.
       POST /api/admin/users — create a user."""
    denied = _require_role(request, 'admin')
    if denied:
        return denied

    if request.method == 'GET':
        users = User.objects.all().order_by('username')
        return Response([_user_to_dict(u) for u in users])

    # POST
    serializer = CreateUserAdminSerializer(data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    user = serializer.save()
    return Response(_user_to_dict(user), status=201)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_toggle_disable(request, username):
    """PATCH /api/admin/users/:username/toggle-disable"""
    denied = _require_role(request, 'admin')
    if denied:
        return denied

    user = get_object_or_404(User, username=username)
    user.is_active = not user.is_active
    user.save(update_fields=['is_active'])
    return Response(_user_to_dict(user))


# ── Students ──────────────────────────────────────────────────────────────────

def _can_access_student(request, username):
    """Return True if the request user may access *username*'s data."""
    return (
        request.user.username == username
        or request.user.role in ('academic', 'admin')
    )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def student_logs(request, username):
    """GET /api/students/:username/logs
       POST /api/students/:username/logs"""
    if not _can_access_student(request, username):
        return Response({'message': 'Access denied.'}, status=403)

    student = get_object_or_404(User, username=username)

    if request.method == 'GET':
        logs = Log.objects.filter(user=student)
        return Response(LogSerializer(logs, many=True).data)

    # POST — only the student themselves may create logs
    if request.user.username != username:
        return Response({'message': 'Access denied.'}, status=403)
    serializer = LogSerializer(data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    serializer.save(user=student)
    return Response(serializer.data, status=201)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def student_log_detail(request, username, log_id):
    """PUT /api/students/:username/logs/:id
       DELETE /api/students/:username/logs/:id"""
    if request.user.username != username:
        return Response({'message': 'Access denied.'}, status=403)

    student = get_object_or_404(User, username=username)
    log = get_object_or_404(Log, id=log_id, user=student)

    if request.method == 'DELETE':
        log.delete()
        return Response(status=204)

    # PUT
    serializer = LogSerializer(log, data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    serializer.save()
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def student_timesheets(request, username):
    """GET /api/students/:username/timesheets
       POST /api/students/:username/timesheets"""
    if not _can_access_student(request, username):
        return Response({'message': 'Access denied.'}, status=403)

    student = get_object_or_404(User, username=username)

    if request.method == 'GET':
        entries = Timesheet.objects.filter(user=student)
        return Response(TimesheetSerializer(entries, many=True).data)

    if request.user.username != username:
        return Response({'message': 'Access denied.'}, status=403)
    serializer = TimesheetSerializer(data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    serializer.save(user=student)
    return Response(serializer.data, status=201)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def student_timesheet_detail(request, username, ts_id):
    """PUT /api/students/:username/timesheets/:id
       DELETE /api/students/:username/timesheets/:id"""
    if request.user.username != username:
        return Response({'message': 'Access denied.'}, status=403)

    student = get_object_or_404(User, username=username)
    entry = get_object_or_404(Timesheet, id=ts_id, user=student)

    if request.method == 'DELETE':
        entry.delete()
        return Response(status=204)

    serializer = TimesheetSerializer(entry, data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    serializer.save()
    return Response(serializer.data)


# ── Supervisors ───────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def supervisor_students(request):
    """GET /api/supervisors/students"""
    denied = _require_role(request, 'supervisor', 'admin')
    if denied:
        return denied
    students = User.objects.filter(role='student', is_active=True).order_by('username')
    return Response([_user_to_dict(u) for u in students])


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def supervisor_verifications(request):
    """GET /api/supervisors/verifications
       POST /api/supervisors/verifications"""
    denied = _require_role(request, 'supervisor', 'admin')
    if denied:
        return denied

    if request.method == 'GET':
        entries = Verification.objects.filter(supervisor=request.user)
        return Response(VerificationSerializer(entries, many=True).data)

    serializer = VerificationSerializer(data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    serializer.save(supervisor=request.user)
    return Response(serializer.data, status=201)


# ── Academic ──────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def academic_reviews(request):
    """GET /api/academic/reviews
       POST /api/academic/reviews"""
    denied = _require_role(request, 'academic', 'admin')
    if denied:
        return denied

    if request.method == 'GET':
        reviews = Review.objects.filter(reviewer=request.user)
        return Response(ReviewSerializer(reviews, many=True).data)

    serializer = ReviewSerializer(data=request.data)
    if not serializer.is_valid():
        first_error = _first_error(serializer.errors)
        return Response({'message': str(first_error)}, status=400)
    serializer.save(reviewer=request.user)
    return Response(serializer.data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def academic_student_logs(request, username):
    """GET /api/academic/students/:username/logs"""
    denied = _require_role(request, 'academic', 'admin')
    if denied:
        return denied
    student = get_object_or_404(User, username=username)
    logs = Log.objects.filter(user=student)
    return Response(LogSerializer(logs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def academic_students(request):
    """GET /api/academic/students — list all active students."""
    denied = _require_role(request, 'academic', 'admin')
    if denied:
        return denied
    students = User.objects.filter(role='student', is_active=True).order_by('username')
    return Response([_user_to_dict(u) for u in students])

from rest_framework import serializers
from .models import CustomUser, Log, Timesheet, Verification, Review


class UserPublicSerializer(serializers.ModelSerializer):
    """Read-only public view of a user (no password)."""
    name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'name', 'email', 'role', 'is_active']

    def get_name(self, obj):
        full = obj.get_full_name()
        return full if full else obj.username


class SignUpSerializer(serializers.ModelSerializer):
    """Create a new user account."""
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'name', 'email', 'password', 'role']

    def validate_role(self, value):
        allowed = {r[0] for r in CustomUser.ROLE_CHOICES}
        if value not in allowed:
            raise serializers.ValidationError(f'Role must be one of: {", ".join(allowed)}')
        return value

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        password = validated_data.pop('password')
        first_name, *rest = (name.split(' ', 1) if name else ('', ''))
        last_name = rest[0] if rest else ''
        user = CustomUser(
            first_name=first_name,
            last_name=last_name,
            **validated_data,
        )
        user.set_password(password)
        user.save()
        return user


class CreateUserAdminSerializer(serializers.ModelSerializer):
    """Admin creates a user (same as sign-up but via admin endpoint)."""
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'name', 'email', 'password', 'role']

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        password = validated_data.pop('password')
        first_name, *rest = (name.split(' ', 1) if name else ('', ''))
        last_name = rest[0] if rest else ''
        user = CustomUser(
            first_name=first_name,
            last_name=last_name,
            **validated_data,
        )
        user.set_password(password)
        user.save()
        return user


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = [
            'id', 'weekNumber', 'logDate', 'company',
            'activities', 'challenges', 'learningOutcomes',
            'hoursWorked', 'status', 'createdAt',
        ]

    # Map camelCase ↔ snake_case so the React frontend receives camelCase keys.
    weekNumber = serializers.IntegerField(source='week_number')
    logDate = serializers.DateField(source='log_date')
    learningOutcomes = serializers.CharField(source='learning_outcomes')
    hoursWorked = serializers.FloatField(source='hours_worked')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)


class TimesheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timesheet
        fields = [
            'id', 'date', 'startTime', 'endTime',
            'hours', 'taskDescription', 'status', 'createdAt',
        ]

    startTime = serializers.TimeField(source='start_time')
    endTime = serializers.TimeField(source='end_time')
    taskDescription = serializers.CharField(source='task_description')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = [
            'id', 'internUsername', 'period',
            'punctuality', 'workQuality', 'teamwork', 'communication',
            'overallRating', 'hoursVerified', 'comments', 'createdAt',
        ]

    internUsername = serializers.CharField(source='intern_username')
    workQuality = serializers.IntegerField(source='work_quality')
    overallRating = serializers.FloatField(source='overall_rating')
    hoursVerified = serializers.FloatField(source='hours_verified')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Allow the authenticated user to update their own profile."""
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'profile_data']

    def update(self, instance, validated_data):
        name = validated_data.pop('name', None)
        if name is not None:
            first_name, *rest = name.split(' ', 1) if name else ('', '')
            instance.first_name = first_name
            instance.last_name = rest[0] if rest else ''
        if 'email' in validated_data:
            instance.email = validated_data['email']
        if 'profile_data' in validated_data:
            instance.profile_data = validated_data['profile_data']
        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'studentUsername', 'logId', 'score',
            'feedback', 'recommendation', 'comments', 'reviewDate', 'createdAt',
        ]

    studentUsername = serializers.CharField(source='student_username')
    logId = serializers.IntegerField(source='log_id')
    reviewDate = serializers.DateField(source='review_date')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('supervisor', 'Supervisor'),
        ('academic', 'Academic Supervisor'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f'{self.username} ({self.role})'


class DashboardConfig(models.Model):
    """Stores per-user dashboard widget layout as JSON."""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='dashboard_config')
    config = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'DashboardConfig for {self.user.username}'


class Company(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    industry = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.name


class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    reg_number = models.CharField(max_length=50, unique=True)
    program = models.CharField(max_length=100)
    year_of_study = models.IntegerField()
    phone = models.CharField(max_length=20)

    class Meta:
        ordering = ['reg_number']

    def __str__(self):
        return f'{self.user.get_full_name()} ({self.reg_number})'


class InternshipPlacement(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('suspended', 'Suspended'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='placements')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='placements')
    supervisor = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name='supervised_placements',
        limit_choices_to={'role': 'supervisor'},
    )
    academic_supervisor = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name='academic_placements',
        limit_choices_to={'role': 'academic'},
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f'{self.student} at {self.company} ({self.status})'


class WeeklyLog(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='weekly_logs')
    week_number = models.IntegerField()
    activities = models.TextField()
    challenges = models.TextField(blank=True)
    skills_gained = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    class Meta:
        ordering = ['week_number']
        unique_together = ('placement', 'week_number')

    def __str__(self):
        return f'Week {self.week_number} — {self.placement}'


class SupervisorReview(models.Model):
    REVIEW_TYPE_CHOICES = [
        ('midterm', 'Mid-Term'),
        ('final', 'Final'),
    ]
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='supervisor_reviews')
    reviewer = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='supervisor_reviews',
        limit_choices_to={'role': 'supervisor'},
    )
    review_type = models.CharField(max_length=20, choices=REVIEW_TYPE_CHOICES)
    punctuality = models.IntegerField()
    technical_skills = models.IntegerField()
    communication = models.IntegerField()
    initiative = models.IntegerField()
    overall_comments = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-reviewed_at']

    def __str__(self):
        return f'{self.review_type} review for {self.placement}'

    @property
    def average_score(self):
        return (self.punctuality + self.technical_skills + self.communication + self.initiative) / 4


class AcademicEvaluation(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='academic_evaluations')
    evaluator = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='academic_evaluations',
        limit_choices_to={'role': 'academic'},
    )
    report_quality = models.IntegerField()
    log_completeness = models.IntegerField()
    learning_outcomes = models.IntegerField()
    presentation_score = models.IntegerField(default=0)
    comments = models.TextField(blank=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-evaluated_at']

    def __str__(self):
        return f'Academic evaluation for {self.placement}'

    @property
    def average_score(self):
        return (self.report_quality + self.log_completeness + self.learning_outcomes + self.presentation_score) / 4


class WeightedScore(models.Model):
    placement = models.OneToOneField(InternshipPlacement, on_delete=models.CASCADE, related_name='weighted_score')
    supervisor_score = models.FloatField(default=0)
    academic_score = models.FloatField(default=0)
    log_score = models.FloatField(default=0)
    final_score = models.FloatField(default=0)
    grade = models.CharField(max_length=2, blank=True)
    computed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Score for {self.placement}: {self.final_score:.2f} ({self.grade})'

    def compute(self):
        supervisor_reviews = self.placement.supervisor_reviews.all()
        if supervisor_reviews.exists():
            self.supervisor_score = sum(r.average_score for r in supervisor_reviews) / supervisor_reviews.count()
        else:
            self.supervisor_score = 0

        academic_evals = self.placement.academic_evaluations.all()
        if academic_evals.exists():
            self.academic_score = sum(e.average_score for e in academic_evals) / academic_evals.count()
        else:
            self.academic_score = 0

        logs = self.placement.weekly_logs.all()
        total_logs = logs.count()
        if total_logs > 0:
            approved_logs = logs.filter(is_approved=True).count()
            self.log_score = (approved_logs / total_logs) * 10
        else:
            self.log_score = 0

        self.final_score = (self.supervisor_score * 0.50) + (self.academic_score * 0.30) + (self.log_score * 0.20)

        if self.final_score >= 8:
            self.grade = 'A'
        elif self.final_score >= 6:
            self.grade = 'B'
        elif self.final_score >= 5:
            self.grade = 'C'
        elif self.final_score >= 4:
            self.grade = 'D'
        else:
            self.grade = 'F'

        self.save()


# ── REST API models (used by the React frontend) ──────────────────────────────

class Log(models.Model):
    """Simple weekly log entry — used by the REST API / React frontend."""
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='logs')
    week_number = models.IntegerField()
    log_date = models.DateField()
    company = models.CharField(max_length=200)
    activities = models.TextField()
    challenges = models.TextField()
    learning_outcomes = models.TextField()
    hours_worked = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-log_date']

    def __str__(self):
        return f'Log W{self.week_number} – {self.user.username}'


class Timesheet(models.Model):
    """Daily timesheet entry — used by the REST API / React frontend."""
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='timesheets')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    hours = models.FloatField()
    task_description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'Timesheet {self.date} – {self.user.username} ({self.hours}h)'


class Verification(models.Model):
    """Supervisor's verification of a student's internship period."""
    PERFORMANCE_CHOICES = [
        ('Excellent', 'Excellent'),
        ('Good', 'Good'),
        ('Satisfactory', 'Satisfactory'),
        ('Needs Improvement', 'Needs Improvement'),
    ]
    supervisor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='verifications',
        limit_choices_to={'role': 'supervisor'},
    )
    student_username = models.CharField(max_length=150)
    period_start = models.DateField()
    period_end = models.DateField()
    hours_completed = models.FloatField()
    performance = models.CharField(max_length=30, choices=PERFORMANCE_CHOICES)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Verification by {self.supervisor.username} for {self.student_username}'


class Review(models.Model):
    """Academic supervisor's review of a student's log."""
    RECOMMENDATION_CHOICES = [
        ('Approve', 'Approve'),
        ('Reject', 'Reject'),
        ('Revise', 'Revise'),
    ]
    reviewer = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='reviews',
        limit_choices_to={'role': 'academic'},
    )
    student_username = models.CharField(max_length=150)
    log_id = models.CharField(max_length=50)
    score = models.FloatField()
    feedback = models.TextField()
    recommendation = models.CharField(max_length=20, choices=RECOMMENDATION_CHOICES)
    comments = models.TextField(blank=True)
    review_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Review by {self.reviewer.username} for {self.student_username} (log {self.log_id})'


from django.contrib import admin
from .models import (
    CustomUser, Company, Student, InternshipPlacement,
    WeeklyLog, SupervisorReview, AcademicEvaluation, WeightedScore,
)


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'contact_email', 'contact_phone')
    list_filter = ('industry',)
    search_fields = ('name', 'industry', 'contact_email')


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('reg_number', 'user', 'program', 'year_of_study', 'phone')
    list_filter = ('program', 'year_of_study')
    search_fields = ('reg_number', 'user__username', 'user__first_name', 'user__last_name', 'program')


@admin.register(InternshipPlacement)
class InternshipPlacementAdmin(admin.ModelAdmin):
    list_display = ('student', 'company', 'supervisor', 'academic_supervisor', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'company', 'start_date')
    search_fields = ('student__reg_number', 'student__user__username', 'company__name')


@admin.register(WeeklyLog)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('placement', 'week_number', 'submitted_at', 'is_approved')
    list_filter = ('is_approved', 'placement__status')
    search_fields = ('placement__student__reg_number', 'activities')


@admin.register(SupervisorReview)
class SupervisorReviewAdmin(admin.ModelAdmin):
    list_display = ('placement', 'reviewer', 'review_type', 'punctuality', 'technical_skills', 'communication', 'initiative', 'reviewed_at')
    list_filter = ('review_type', 'reviewed_at')
    search_fields = ('placement__student__reg_number', 'reviewer__username')


@admin.register(AcademicEvaluation)
class AcademicEvaluationAdmin(admin.ModelAdmin):
    list_display = ('placement', 'evaluator', 'report_quality', 'log_completeness', 'learning_outcomes', 'presentation_score', 'evaluated_at')
    list_filter = ('evaluated_at',)
    search_fields = ('placement__student__reg_number', 'evaluator__username')


@admin.register(WeightedScore)
class WeightedScoreAdmin(admin.ModelAdmin):
    list_display = ('placement', 'supervisor_score', 'academic_score', 'log_score', 'final_score', 'grade', 'computed_at')
    list_filter = ('grade',)
    search_fields = ('placement__student__reg_number',)

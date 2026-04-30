from django import forms
from .models import WeeklyLog, SupervisorReview, AcademicEvaluation


class WeeklyLogForm(forms.ModelForm):
    class Meta:
        model = WeeklyLog
        fields = ['week_number', 'activities', 'challenges', 'skills_gained']


class SupervisorReviewForm(forms.ModelForm):
    class Meta:
        model = SupervisorReview
        fields = ['review_type', 'punctuality', 'technical_skills', 'communication', 'initiative', 'overall_comments']


class AcademicEvaluationForm(forms.ModelForm):
    class Meta:
        model = AcademicEvaluation
        fields = ['report_quality', 'log_completeness', 'learning_outcomes', 'presentation_score', 'comments']

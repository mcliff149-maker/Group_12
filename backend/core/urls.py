from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/student/', views.student_dashboard, name='student_dashboard'),
    path('dashboard/supervisor/', views.supervisor_dashboard, name='supervisor_dashboard'),
    path('dashboard/academic/', views.academic_dashboard, name='academic_dashboard'),
    path('dashboard/admin/', views.admin_dashboard, name='admin_dashboard'),
    path('log/submit/<int:placement_id>/', views.submit_weekly_log, name='submit_log'),
    path('log/approve/<int:log_id>/', views.approve_log, name='approve_log'),
    path('review/supervisor/<int:placement_id>/', views.submit_supervisor_review, name='supervisor_review'),
    path('evaluation/<int:placement_id>/', views.submit_academic_evaluation, name='academic_evaluation'),
    path('score/compute/<int:placement_id>/', views.compute_score, name='compute_score'),
]

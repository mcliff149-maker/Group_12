from django.urls import path
from . import views, api_views

urlpatterns = [
    # ── Template-based views (Django sessions) ─────────────────────────────
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
    # Dashboard config API (session-based)
    path('api/dashboard-config/', views.api_dashboard_config, name='api_dashboard_config'),
    path('api/dashboard-config/save/', views.api_dashboard_config_put, name='api_dashboard_config_put'),
    path('api/admin/dashboard-config/<int:user_id>/', views.api_admin_dashboard_config, name='api_admin_dashboard_config'),
    path('api/admin/dashboard-config/<int:user_id>/save/', views.api_admin_dashboard_config_put, name='api_admin_dashboard_config_put'),
    path('api/admin/dashboard-config/<int:user_id>/reset/', views.api_admin_dashboard_config_delete, name='api_admin_dashboard_config_delete'),

    # ── REST API (JWT — used by the React frontend) ─────────────────────────
    # Auth
    path('api/auth/signin', api_views.sign_in, name='api_sign_in'),
    path('api/auth/signup', api_views.sign_up, name='api_sign_up'),
    path('api/auth/me', api_views.me, name='api_me'),
    path('api/auth/me/update', api_views.update_me, name='api_update_me'),
    # Admin user management
    path('api/admin/users', api_views.admin_users, name='api_admin_users'),
    path('api/admin/users/<str:username>/toggle-disable', api_views.admin_toggle_disable, name='api_admin_toggle_disable'),
    # Student logs
    path('api/students/<str:username>/logs', api_views.student_logs, name='api_student_logs'),
    path('api/students/<str:username>/logs/<int:log_id>', api_views.student_log_detail, name='api_student_log_detail'),
    # Student timesheets
    path('api/students/<str:username>/timesheets', api_views.student_timesheets, name='api_student_timesheets'),
    path('api/students/<str:username>/timesheets/<int:ts_id>', api_views.student_timesheet_detail, name='api_student_timesheet_detail'),
    # Supervisor
    path('api/supervisors/students', api_views.supervisor_students, name='api_supervisor_students'),
    path('api/supervisors/verifications', api_views.supervisor_verifications, name='api_supervisor_verifications'),
    # Academic
    path('api/academic/students', api_views.academic_students, name='api_academic_students'),
    path('api/academic/reviews', api_views.academic_reviews, name='api_academic_reviews'),
    path('api/academic/students/<str:username>/logs', api_views.academic_student_logs, name='api_academic_student_logs'),
]


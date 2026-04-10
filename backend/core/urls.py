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
    # Dashboard config API
    path('api/dashboard-config/', views.api_dashboard_config, name='api_dashboard_config'),
    path('api/dashboard-config/save/', views.api_dashboard_config_put, name='api_dashboard_config_put'),
    path('api/admin/dashboard-config/<int:user_id>/', views.api_admin_dashboard_config, name='api_admin_dashboard_config'),
    path('api/admin/dashboard-config/<int:user_id>/save/', views.api_admin_dashboard_config_put, name='api_admin_dashboard_config_put'),
    path('api/admin/dashboard-config/<int:user_id>/reset/', views.api_admin_dashboard_config_delete, name='api_admin_dashboard_config_delete'),
]

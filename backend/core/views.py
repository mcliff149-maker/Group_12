from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import Student, InternshipPlacement, WeeklyLog, SupervisorReview, AcademicEvaluation, WeightedScore
from .forms import WeeklyLogForm, SupervisorReviewForm, AcademicEvaluationForm


@login_required
def dashboard(request):
    role = request.user.role
    if role == 'student':
        return redirect('student_dashboard')
    elif role == 'supervisor':
        return redirect('supervisor_dashboard')
    elif role == 'academic':
        return redirect('academic_dashboard')
    elif role == 'admin':
        return redirect('admin_dashboard')
    return render(request, 'core/dashboard.html')


@login_required
def student_dashboard(request):
    if request.user.role != 'student':
        return redirect('dashboard')
    try:
        student = request.user.student
    except Student.DoesNotExist:
        return render(request, 'core/student_dashboard.html', {'error': 'No student profile found.'})

    placements = student.placements.select_related('company').prefetch_related('weekly_logs', 'weighted_score')
    active_placement = placements.filter(status='active').first()
    context = {
        'student': student,
        'active_placement': active_placement,
        'placements': placements,
    }
    return render(request, 'core/student_dashboard.html', context)


@login_required
def submit_weekly_log(request, placement_id):
    if request.user.role != 'student':
        return redirect('dashboard')
    placement = get_object_or_404(InternshipPlacement, id=placement_id, student__user=request.user)
    if request.method == 'POST':
        form = WeeklyLogForm(request.POST)
        if form.is_valid():
            log = form.save(commit=False)
            log.placement = placement
            log.save()
            return redirect('student_dashboard')
    else:
        form = WeeklyLogForm()
    return render(request, 'core/submit_weekly_log.html', {'form': form, 'placement': placement})


@login_required
def supervisor_dashboard(request):
    if request.user.role != 'supervisor':
        return redirect('dashboard')
    placements = InternshipPlacement.objects.filter(supervisor=request.user).select_related('student', 'company')
    pending_logs = WeeklyLog.objects.filter(
        placement__supervisor=request.user, is_approved=False
    ).select_related('placement__student')
    context = {
        'placements': placements,
        'pending_logs': pending_logs,
    }
    return render(request, 'core/supervisor_dashboard.html', context)


@login_required
def approve_log(request, log_id):
    if request.user.role != 'supervisor':
        return redirect('dashboard')
    log = get_object_or_404(WeeklyLog, id=log_id, placement__supervisor=request.user)
    log.is_approved = True
    log.save()
    return redirect('supervisor_dashboard')


@login_required
def submit_supervisor_review(request, placement_id):
    if request.user.role != 'supervisor':
        return redirect('dashboard')
    placement = get_object_or_404(InternshipPlacement, id=placement_id, supervisor=request.user)
    if request.method == 'POST':
        form = SupervisorReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.placement = placement
            review.reviewer = request.user
            review.save()
            return redirect('supervisor_dashboard')
    else:
        form = SupervisorReviewForm()
    return render(request, 'core/submit_supervisor_review.html', {'form': form, 'placement': placement})


@login_required
def academic_dashboard(request):
    if request.user.role != 'academic':
        return redirect('dashboard')
    placements = InternshipPlacement.objects.filter(
        academic_supervisor=request.user
    ).select_related('student', 'company')
    context = {'placements': placements}
    return render(request, 'core/academic_dashboard.html', context)


@login_required
def submit_academic_evaluation(request, placement_id):
    if request.user.role != 'academic':
        return redirect('dashboard')
    placement = get_object_or_404(InternshipPlacement, id=placement_id, academic_supervisor=request.user)
    if request.method == 'POST':
        form = AcademicEvaluationForm(request.POST)
        if form.is_valid():
            evaluation = form.save(commit=False)
            evaluation.placement = placement
            evaluation.evaluator = request.user
            evaluation.save()
            return redirect('academic_dashboard')
    else:
        form = AcademicEvaluationForm()
    return render(request, 'core/submit_academic_evaluation.html', {'form': form, 'placement': placement})


@login_required
def admin_dashboard(request):
    if request.user.role != 'admin':
        return redirect('dashboard')
    placements = InternshipPlacement.objects.select_related(
        'student', 'company', 'weighted_score'
    ).prefetch_related('supervisor_reviews', 'academic_evaluations')
    context = {'placements': placements}
    return render(request, 'core/admin_dashboard.html', context)


@login_required
def compute_score(request, placement_id):
    if request.user.role != 'admin':
        return redirect('dashboard')
    placement = get_object_or_404(InternshipPlacement, id=placement_id)
    weighted_score, _ = WeightedScore.objects.get_or_create(placement=placement)
    weighted_score.compute()
    return redirect('admin_dashboard')

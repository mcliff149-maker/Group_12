# Generated migration for profile_data and Verification model update

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_review_log_id'),
    ]

    operations = [
        # Add profile_data to CustomUser
        migrations.AddField(
            model_name='customuser',
            name='profile_data',
            field=models.JSONField(blank=True, default=dict),
        ),

        # Remove old Verification fields
        migrations.RemoveField(
            model_name='verification',
            name='student_username',
        ),
        migrations.RemoveField(
            model_name='verification',
            name='period_start',
        ),
        migrations.RemoveField(
            model_name='verification',
            name='period_end',
        ),
        migrations.RemoveField(
            model_name='verification',
            name='hours_completed',
        ),
        migrations.RemoveField(
            model_name='verification',
            name='performance',
        ),

        # Add new Verification fields
        migrations.AddField(
            model_name='verification',
            name='intern_username',
            field=models.CharField(default='', max_length=150),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verification',
            name='period',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verification',
            name='punctuality',
            field=models.IntegerField(default=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verification',
            name='work_quality',
            field=models.IntegerField(default=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verification',
            name='teamwork',
            field=models.IntegerField(default=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verification',
            name='communication',
            field=models.IntegerField(default=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verification',
            name='overall_rating',
            field=models.FloatField(default=3.0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='verification',
            name='hours_verified',
            field=models.FloatField(default=0.0),
            preserve_default=False,
        ),
    ]

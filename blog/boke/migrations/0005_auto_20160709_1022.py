# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boke', '0004_user_headimg'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='headImg',
        ),
        migrations.AddField(
            model_name='author',
            name='fileImg',
            field=models.FileField(null=True, upload_to=b'./img/', blank=True),
        ),
    ]

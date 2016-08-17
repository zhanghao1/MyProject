# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boke', '0003_auto_20160612_1045'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='headImg',
            field=models.FileField(null=True, upload_to=b'./image/', blank=True),
        ),
    ]

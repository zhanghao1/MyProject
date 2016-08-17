# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boke', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('qq', models.CharField(max_length=20, null=True, blank=True)),
                ('phone', models.CharField(max_length=20, null=True)),
                ('register_time', models.DateTimeField(auto_now_add=True)),
                ('email', models.EmailField(max_length=254, null=True, blank=True)),
                ('password', models.CharField(max_length=255)),
            ],
        ),
    ]

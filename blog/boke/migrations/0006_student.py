# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boke', '0005_auto_20160709_1022'),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('user_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='boke.User')),
                ('grade', models.CharField(max_length=20)),
            ],
            bases=('boke.user',),
        ),
    ]


from celery import task
import csv
from django.http import HttpResponse
from django.utils.encoding import smart_str
# from django.utils.http import urlquote
# from boke.models import Blog

import django
django.setup()


@task()
def add(x, y):
    s = x + y
    print(s, 321)
    return s


@task()
def daochu(blogs):
    menu = ['标题', '内容', '访问次数', '发表时间', '作者']
    print(menu, 333)
    fname = 'test.csv'
    response = HttpResponse(content_type='text/csv')
    response[
        'Content-Disposition'] = 'attachment; filename=%s' % smart_str(fname)
    csvwriter = csv.writer(response)
    csvwriter.writerow(menu)
    for b in blogs:
        data = (b.title, b.content, b.counter, b.pubDate, b.author)
        csvwriter.writerow(data)
    print(response, 123321)
    return response


@task()
def save_data(blog, blogId):
    b = blog
    b.counter += 1
    b.save()
    return 33

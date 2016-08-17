# coding: utf-8
from django.shortcuts import render, render_to_response
from django.template import loader, RequestContext
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect, JsonResponse, FileResponse
from boke.models import Blog, User, Author
# from django.contrib.auth import authenticate, login, logout

from boke.forms import LoginSystem, BlogChange, BlogAdd, UserRegist, AuthorBook

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.views.decorators.csrf import csrf_protect
# from django.views.decorators.http import require_POST
from boke.auth import MyCustomBackend


import xlwt
import re
import csv

from django.http import StreamingHttpResponse

from django.utils.encoding import smart_str
from django.utils.http import urlquote

import datetime

from boke.tasks import add, daochu, save_data

# Create your views here.


def showBlog(request, blogId):
    t = loader.get_template('blog.html')
    try:
        blog = Blog.objects.get(id=blogId)
        c = save_data.delay(blog, blogId)
        print(c, 111, dir(c), 222, c.ready(), c.result)
        t1 = datetime.datetime.now()
        l = add.delay(3, 4)
        print(l, 2323, dir(l), l.ready())
        t2 = datetime.datetime.now()
        t_cha = (t2 - t1).seconds
        print(t_cha)
    except Blog.DoesNotExist:
        return HttpResponse(u'您访问的博客不存在<a href="javascript:history.go(-1)">返回</a>', status=403)
    # blog.counter += 1
    # blog.save()
    context = {'blog': blog}
    html = t.render(context)
    return HttpResponse(html)


@csrf_protect
def showBlogList(request):
    # t = loader.get_template('blog_list.html')
    # blogs = Blog.objects.all()
    # context = {'blog': blogs}
    # html = t.render(context)
    # return HttpResponse(html)
    blogs = Blog.objects.all()

    title = request.GET.get('title', '')
    if title:
        blogs = blogs.filter(title=title)
    author = request.GET.get('author', '')
    if author:
        try:
            author_id = Author.objects.get(name=author)
            blogs = blogs.filter(author_id=author_id)
        except Author.DoesNotExist:
            return HttpResponse('作者不存在<a href="javascript:history.go(-1)">返回</a>')

    out_file = request.GET.get('out_file', '')
    if out_file == '导出':
        # menu = ['标题', '内容', '访问次数', '发表时间', '作者']
        # fname = 'test.csv'
        # response = HttpResponse(content_type='text/csv')
        # response['Content-Disposition'] = 'attachment; filename=%s' % smart_str(fname)
        # csvwriter = csv.writer(response)
        # csvwriter.writerow(menu)
        # for b in blogs:
        #     data = (b.title, b.content, b.counter, b.pubDate, b.author)
        #     csvwriter.writerow(data)
        # return response

        # daochu.delay(blogs)

        # 异步执行导出文件
        response = daochu.delay(blogs).result
        return response

    paginator = Paginator(blogs, 2)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)

    content = {
        'contacts': contacts
    }
    return render_to_response('blog_list.html', content, context_instance=RequestContext(request))


@csrf_protect
def loginIn(request):
    if request.method == 'POST':
        form = LoginSystem(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = MyCustomBackend.authenticate(name=username, password=password)
            # try:
            #     user = User.objects.get(name=username, password=password)
            # except User.DoesNotExist:
            #     context = {
            #         'form': form,
            #         'errors': u'用户名或密码错误',
            #     }
            #     return render_to_response('login.html', context)
            if user:
                blogs = Blog.objects.all()
                context = {'blog': blogs}
                # return render_to_response('blog_list.html', context,
                # context_instance=RequestContext(request))
                return HttpResponseRedirect('/bloglist')
            else:
                return HttpResponse('登录失败')

        else:
            context = {
                'form': form,
                'errors': form.errors,
            }
            return render_to_response('login.html', context)
    else:
        form = LoginSystem()
        context = {
            'form': form
        }
        return render_to_response('login.html', context, context_instance=RequestContext(request))
        # return render(request, 'login.html', context)


@csrf_protect
def edit_blog(request, blogId):
    if request.method == 'POST':
        b = Blog.objects.get(id=blogId)
        form = BlogChange(request.POST, instance=b)
        if form.is_valid():
            form.save()
            # return render_to_response('blog_list.html', context)
            return HttpResponseRedirect('/bloglist')
        else:
            content = {
                'form': form,
                'error': form.errors,
            }
            return render_to_response('edit_blog.html', content)
    else:
        b = Blog.objects.get(id=blogId)
        form = BlogChange(instance=b)
        content = {
            'form': form
        }
        return render_to_response('edit_blog.html', content, context_instance=RequestContext(request))


@csrf_protect
def delete_blog(request, blogId):
    try:
        b = Blog.objects.get(id=blogId)
    except Blog.DoesNotExist:
        return HttpResponse('删除的博客不存在！')
    b.delete()
    return HttpResponseRedirect('/bloglist')


@csrf_protect
def add_blog(request):
    if request.method == 'POST':
        form = BlogAdd(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/bloglist')
        else:
            content = {
                'form': form,
                'errors': form.errors
            }
            return render_to_response('add_blog.html', content)
    else:
        form = BlogAdd()
        content = {
            'form': form
        }
        return render_to_response('add_blog.html', content)


@csrf_protect
def register(request):
    # if request.method == 'POST':
    #     form = UserRegist(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         return HttpResponseRedirect('/login')
    #     else:
    #         content = {
    #             'form': form,
    #             'errors': form.errors
    #         }
    #         return render(request, 'regist.html', content)
    # else:
    #     form = UserRegist()
    #     content = {
    #         'form': form
    #     }
    #     return render(request, 'regist.html', content)
    if request.method == 'POST':
        print("it is a test", 777)
        name = request.POST.get('name', '')
        if not name:
            return HttpResponse("请填写name")
        password = request.POST.get('password', '')
        if not password:
            return HttpResponse("请填写密码")
        s = request.POST['s']
        return_info = "name:%s,password:%s,s:%s" % (
            name, password, s)
        return HttpResponse(return_info)

    b_out = request.GET.get('out_put', '')
    if b_out == '导出':
        o_data = Blog.objects.all()
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet("bloglist")
        ws.write(0, 0, 'title')
        ws.write(0, 1, 'content')
        ws.write(0, 2, 'counter')
        ws.write(0, 3, 'pubDate')
        excel_row = 1
        for o in o_data:
            pubDate = o.pubDate.strftime("%Y-%m-%d %H:%M:%S")
            ws.write(excel_row, 0, o.title)
            ws.write(excel_row, 1, o.content)
            ws.write(excel_row, 2, o.counter)
            ws.write(excel_row, 3, pubDate)
            excel_row += 1
        response = HttpResponse(content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename=example.xls'
        wb.save(response)
        return response
        """
        sio = StringIO.StringIO()
        wb.save(sio)
        response = HttpResponse(sio.getvalue(),content_type='application/vnd.ms-excel') 
        response['Content-Disposition'] = 'attachment; filename=test.xls'
        return response
        """

        # def file_iterator(file_name, chunk_size=512):
        #     with open(file_name) as f:
        #         while True:
        #             c = f.read(chunk_size)
        #             if c:
        #                 yield
        #             else:
        #                 break
        # response = StreamingHttpResponse(file_iterator(file_name))
        # response['Content-Type'] = 'application/octet-stream'
        # response[
        #     'Content-Disposition'] = 'attachment; filename="{0}"'.format(filename)
        # return response

        # def readFile(fn, buf_size=262144):
        #     f = open(fn, 'rb')
        #     while True:
        #         c = f.open(fn, "rb")
        #         if c:
        #             yield c
        #         else:
        #             break
        #     f.close()
        #     file_name = "e:/23.txt"
        #     response = HttpResponse(readFile(file_name))
        #     print(12321)
        #     return response

        def readFile(file_name, buf_size=262144):
            with open(file_name, 'r') as f:
                while True:
                    block = f.readline(buf_size)
                    if block:
                        yield block
                    else:
                        return
        file_name = "e:/23.txt"

        # csv格式
        fname = 'testcsv.csv'
        agent = request.META.get('HTTP_USER_AGENT')
        if agent and re.search('MSIE', agent):
            response = HttpResponse(content_type="application/vnd.ms-excel")
            response[
                'Content-Disposition'] = 'attachment; filename=%s' % urlquote(fname)
        else:
            response = HttpResponse(content_type="text/csv")
            response[
                'Content-Disposition'] = 'attachment; filename=%s' % smart_str(fname)
        csvwriter = csv.writer(response)
        menu = ['序号', '手机号']
        csvwriter.writerow(menu)
        col = 1
        for c in readFile(file_name):
            phone = c.strip('\n')
            data = (col, phone)
            csvwriter.writerow(data)
            col += 1
        return response

        #  excel格式
        # wbk = xlwt.Workbook()
        # sheet = wbk.add_sheet('phone', cell_overwrite_ok=True)
        # menu = ['序号', '手机号']
        # for i in range(len(menu)):
        #     sheet.write(0, i, menu[i])
        # col = 1
        # for c in readFile(file_name):
        #     phone = c.strip('\n')
        #     sheet.write(col, 0, col)
        #     sheet.write(col, 1, phone)
        #     col += 1

        # fname = 'testfile.xls'
        # agent = request.META.get('HTTP_USER_AGENT')
        # if agent and re.search('MSIE', agent):
        #     response = HttpResponse(
        #         content_type="application/vnd.ms-excel")  # 解决ie不能下载的问题
        #     # 解决文件名乱码/不显示的问题
        #     response[
        #         'Content-Disposition'] = 'attachment; filename=%s' % urlquote(fname)
        # else:
        #     response = HttpResponse(
        #         content_type="application/ms-excel")  # 解决ie不能下载的问题
        #     # 解决文件名乱码/不显示的问题
        #     response[
        #         'Content-Disposition'] = 'attachment; filename=%s' % smart_str(fname)
        # wbk.save(response)
        # return response
    return render(request, 'regist.html')


@csrf_protect
def Author_list(request):
    author = Author.objects.all()
    content = {
        'author': author
    }
    return render(request, 'author.html', content)


@csrf_protect
def Addauthor(request):
    if request.method == 'POST':
        form = AuthorBook(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/author')
        else:
            content = {
                'form': form,
                'errors': form.errors
            }
            return render_to_response('add_author.html', content)

    else:
        form = AuthorBook()
        content = {
            'form': form,
        }
        return render(request, 'add_author.html', content)


# 文件下载
def bigFileView(request):
    # do something...

    def readFile(fn, buf_size=262144):
        f = open(fn, "rb")
        while True:
            c = f.read(buf_size)
            if c:
                yield c
            else:
                break
        f.close()

    file_name = "E:/23.txt"
    response = HttpResponse(readFile(file_name))

    return response


def output(request):
    data = Blog.objects.all()
    for d in data:
        d


@csrf_protect
def login(request):
    content = {}
    return render_to_response('boke_login.html', content, context_instance=RequestContext(request))


def jindu(request):
    content = {}
    return render_to_response('jindu.html', content, context_instance=RequestContext(request))

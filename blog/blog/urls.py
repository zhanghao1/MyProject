"""blog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from boke import views
import boke
# from django.conf import settings
# from django.conf.urls.static import static

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),

    url(r'^boke', include('boke.urls')),
    url(r'^login/$', views.loginIn, name='loginIn'),
    url(r'^register/$', views.register, name='register'),
    url(r'^blog/(?P<blogId>[0-9]+)/$', 'boke.views.showBlog', name='showBlog'),
    url(r'^edit_blog/(\d+)/$', 'boke.views.edit_blog'),
    url(r'^bloglist/$', 'boke.views.showBlogList'),
    url(r'^delete_blog/(\d+)$', 'boke.views.delete_blog'),
    url(r'^add_blog/$', 'boke.views.add_blog'),
    url(r'^author/$', 'boke.views.Author_list'),
    url(r'^add_author/$', 'boke.views.Addauthor'),
    url(r'^xiazai/$', 'boke.views.bigFileView', name='xiazai'),
]

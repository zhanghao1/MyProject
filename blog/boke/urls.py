
from django.conf.urls import url
from boke import views

urlpatterns = [
    url(r'login/$', views.login, name='boke_login'),
    url(r'jindu/$', views.jindu),
]

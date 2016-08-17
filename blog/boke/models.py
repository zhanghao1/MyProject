from django.db import models
import datetime
import hashlib

# Create your models here.


class Author(models.Model):
    name = models.CharField(max_length=50)
    age = models.IntegerField()
    fileImg = models.FileField(upload_to='./img/', blank=True, null=True)


class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    counter = models.IntegerField(default=0)
    pubDate = models.DateField(auto_now_add=True)
    author = models.ForeignKey(Author)


class User(models.Model):
    INPUT_STATE = (
        ('U', '正常'),
        ('F', '禁用'),
    )
    name = models.CharField(max_length=255)
    qq = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    register_time = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(blank=True, null=True)
    password = models.CharField(max_length=255)
    status = models.CharField(max_length=1, choices=INPUT_STATE, default='U')
    last_login = models.DateTimeField(default=datetime.datetime.now())

    def is_authenticated(self):
        return True

    def hashed_password(self, password=None):
        if not password:
            return self.password
        else:
            return hashlib.md5(password).hexdigest()

    def check_password(self, password):
        if self.hashed_password(password) == self.password:
            return True
        return False


class Student(User):
    grade = models.CharField(max_length=20)

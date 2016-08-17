# coding=utf-8

import os, sys, shutil

DEBUG = True
if 'collectstatic' in sys.argv:
    DEBUG = False

DATABASE_NAME = 'Blog'
DATABASE_HOST = '127.0.0.1'
DATABASE_PORT = '3306'
DATABASE_USER = 'root'
DATABASE_PASS = 'root'

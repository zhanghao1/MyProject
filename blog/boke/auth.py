
from boke.models import User


class MyCustomBackend:

    def authenticate(name=None, password=None):
        try:
            user = User.objects.get(name=name, password=password)
        except User.DoesNotExist:
            return None
        return user

    def get_user(user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

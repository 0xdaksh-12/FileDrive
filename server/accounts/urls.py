from django.urls import path

from .views import LoginView, LogoutView, RegisterView, RefreshView

urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("refresh", RefreshView.as_view(), name="refresh"),
]

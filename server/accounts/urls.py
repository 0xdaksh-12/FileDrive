from django.urls import path

from accounts.views import LoginView, LogoutView, RefreshView, RegisterView, UserView

urlpatterns = [
    path("auth/register", RegisterView.as_view(), name="register"),
    path("auth/login", LoginView.as_view(), name="login"),
    path("auth/logout", LogoutView.as_view(), name="logout"),
    path("auth/refresh", RefreshView.as_view(), name="refresh"),
    path("user", UserView.as_view(), name="user"),
]

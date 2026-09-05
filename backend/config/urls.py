"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/pets/", include("pets.urls")),
    path( "api/appointments/",include("appointments.urls")),
    path("api/shop/",include("shop.urls")),
    path("api/token/refresh/",TokenRefreshView.as_view(),name="token_refresh",),
    path( "api/grooming/",include("grooming.urls"),),
    path( "api/ai/", include("ai_assistant.urls"),),
    path( "api/boarding/", include("boarding.urls"),),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT,
)
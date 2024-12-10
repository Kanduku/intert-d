from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.get_tasks, name='get_tasks'),
    path('tasks/create/', views.create_task, name='create_task'),
    path('tasks/update/<int:id>/', views.update_task, name='update_task'),
    path('tasks/delete/<int:id>/', views.delete_task, name='delete_task'),
    path('tasks/delete-all/', views.delete_all_tasks, name='delete_all_tasks'),
]

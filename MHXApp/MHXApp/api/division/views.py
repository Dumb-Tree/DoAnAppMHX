from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, generics
from rest_framework.parsers import MultiPartParser
from .models import Division
from .serializers import DivisionSerializer
# Create your views here.


class DivisionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
def index(request):
    return render(request, template_name='index.html', context =
    { 'name':'MHXApp'
    })
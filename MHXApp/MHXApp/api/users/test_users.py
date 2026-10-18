from django.test import TestCase
from rest_framework.test import APITestCase
from .models import User
from django.urls import reverse
# Create your tests here.
class UserLoginTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='Tester', password='Abc123!!')

    def test_login_post_request(self):
        url = reverse('users-login') 
        response = self.client.post(url, {
            'username': 'Tester',
            'password': 'Abc123!!'
        })
        self.assertEqual(response.status_code, 200)
    def test_login_wrong_password(self):
        url = reverse('users-login')
        response = self.client.post(url, {
            'username': 'Tester',
            'password': 'Wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
    def test_login_nonexistent_user(self):
        url = reverse('users-login')
        response = self.client.post(url, {
            'username': 'DontExist',
            'password': 'Abc123!!'
        })
        self.assertEqual(response.status_code, 401)
    def test_login_missing_username(self):
        url = reverse('users-login')
        response = self.client.post(url, {
            'password': 'Abc123!!'
        })
        self.assertEqual(response.status_code, 400)
    def test_login_missing_password(self):
        url = reverse('users-login')
        response = self.client.post(url, {
            'username': 'Tester'
        })
        self.assertEqual(response.status_code, 400)
    def tearDown(self):
        return super().tearDown()
# Create your tests here.

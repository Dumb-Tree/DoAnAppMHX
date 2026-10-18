from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from api.division.models import Division, DivisionRegistration


User = get_user_model()


class DivisionRegistrationTests(APITestCase):
    def setUp(self):
        self.division_a = Division.objects.create(
            divisionName="Test Division",
            divisionDescription="Test division",
        )
        self.division_b = Division.objects.create(
            divisionName="Test Division",
            divisionDescription="Test division",
        )
        self.volunteerA = User.objects.create_user(
            username="testuserA",
            password="testpassword",
            MSSV="123456",
            role="volunteer"
        )
        self.client.login(username="testuserA", password="testpassword")
        self.volunteerB = User.objects.create_user(
            username="testuserB",
            password="testpassword",
            MSSV="654321",
            role="volunteer"
        )
        self.LeaderA = User.objects.create_user(
            username="testLeader",
            password="testpassword",
            role="leader",
            MSSV="111111",
            division=self.division_a
        )
        self.LeaderB = User.objects.create_user(
            username="testLeaderB",
            password="testpassword",
            role="leader",
            MSSV="222222",
            division=self.division_b
        )
        self.registration_url = reverse(
            "divisionregistrations-list"
        )

    def test_create_division_registration_no_authentication(self):
        url = reverse('divisionregistrations-list')
        data = {
            "division": self.division_a.id,
            "reason": "I want to join.",
            "Status": "pending"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 401)
        
    def test_register_division_successfully(self):
        user = self.volunteerA
        self.client.force_authenticate(user=user)
        data = {
            "division": self.division_a.id,
            "reason": "I want to join.",
        }
        response = self.client.post(self.registration_url, data, format='json')
        print("STATUS:", response.status_code)
        print("RESPONSE:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_register_division_already_registered(self):
        user = self.volunteerA
        self.client.force_authenticate(user=user)
        DivisionRegistration.objects.create(
            division=self.division_a,
            volunteer=user,
            reason="I want to join.",
            Status="pending"
        )
        DivisionRegistration.objects.create(
            division=self.division_a,
            volunteer=user,
            Status="Cancelled"
        )
        data = {
            "division": self.division_a.id,
            "reason": "I want to join again.",
            "Status": "pending"
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_cancel_division_registration(self):
        user = self.volunteerA
        self.client.force_authenticate(user=user)
        registration = DivisionRegistration.objects.create(
            division=self.division_a,
            volunteer=user,
            reason="I want to join.",
            Status="pending"
        )
        cancel_url = reverse('divisionregistrations-cancel', args=[registration.id])
        response = self.client.post(cancel_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        registration.refresh_from_db()
        self.assertEqual(registration.Status, "cancelled")
        
    def test_leader_cannot_accept_registration_from_other_division(self):
        user = self.LeaderB
        self.client.force_authenticate(user=user)
        registration = DivisionRegistration.objects.create(
            division=self.division_a,
            volunteer=self.volunteerA,
            reason="I want to join.",
            Status="pending"
        )
        approve_url = reverse('divisionregistrations-accept', args=[registration.id])
        response = self.client.post(approve_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_sequential_registration_approval(self):
        user = self.volunteerA
        self.client.force_authenticate(user=user)
        registration1 = DivisionRegistration.objects.create(
            division=self.division_a,
            volunteer=user,
            reason="I want to join.",
            Status="pending"
        )
        registration2 = DivisionRegistration.objects.create(
            division=self.division_b,
            volunteer=user,
            reason="I want to join another division.",
            Status="pending"
        )
        self.client.force_authenticate(user=self.LeaderA)
        approve_url1 = reverse('divisionregistrations-accept', args=[registration1.id])
        response1 = self.client.post(approve_url1)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        
        self.client.force_authenticate(user=self.LeaderB)
        approve_url2 = reverse('divisionregistrations-accept', args=[registration2.id])
        response2 = self.client.post(approve_url2)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        return super().tearDown()
# Create your tests here.

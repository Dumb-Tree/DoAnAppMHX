from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.activities.models import Activity, ActivityRegistration
from api.campaign.models import Campaign
from api.division.models import Division
User = get_user_model()

class ActivityRegistrationTests(APITestCase):
    def setUp(self):
        self.campaign = Campaign.objects.create(
            campaignYear=2026,
            campaignStartDate="2026-6-01",
            campaignEndDate="2026-12-30",
        )
        self.division = Division.objects.create(
            divisionName="Test Division",
            divisionDescription="Test division",
        )
        self.activity = Activity.objects.create(
            campaign=self.campaign,
            division=self.division,
            name="Test Activity",
            description="Test activity",
            start_time="2026-12-02T10:00:00Z",
            end_time="2026-12-02T12:00:00Z",
        )
        self.volunteer = User.objects.create_user(
            username="testuser",
            password="testpassword",
            MSSV="123456",
            role="volunteer"
        )
        self.client.login(username="testuser", password="testpassword")
        self.registration_url = reverse(
            "registrations-list"
        )

    def test_create_activity_registration_no_authentication(self):
        url = reverse('registrations-list')
        data = {
            "activity": self.activity.id,
            "volunteer": self.volunteer.id,
            "Status": "registered"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 401)
        
        
    def test_successful_activity_registration(self):
        user = self.volunteer
        self.client.force_authenticate(user=user)
        url = reverse('registrations-list')
        data = {
            "activity": self.activity.id,
            "volunteer": self.volunteer.id,
            "Status": "registered"
        }
        response = self.client.post(url, data, format='json')
        print("STATUS", response.status_code)
        print("RESPONSE DATA", response.data)
        self.assertEqual(response.status_code, 201)

        
    def test_activity_registration_time_conflict(self):
        user = self.volunteer
        self.client.force_authenticate(user=user)
        url = reverse('registrations-list')
        data1 = {
            "activity": self.activity.id,
            "volunteer": self.volunteer.id,
            "Status": "registered"
        }
        response1 = self.client.post(url, data1, format='json')
        self.assertEqual(response1.status_code, 201)

        overlapping_activity = Activity.objects.create(
            campaign=self.campaign,
            division=self.division,
            name="Overlapping Activity",
            description="This activity overlaps with the first one.",
            start_time="2026-06-01T11:00:00Z",
            end_time="2026-06-01T13:00:00Z",
        )
        data2 = {
            "activity": overlapping_activity.id,
            "volunteer": self.volunteer.id,
            "Status": "registered"
        }
        response2 = self.client.post(url, data2, format='json')
        self.assertEqual(response2.status_code, 400)    
    
    def tearDown(self):
        return super().tearDown()    
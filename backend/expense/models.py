from django.db import models


class UserDetails(models.Model):
    fullname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)

    def __str__(self):
        return self.fullname
    
class Budget(models.Model):
    user_id = models.ForeignKey(UserDetails, on_delete= models.CASCADE )
    budget_item = models.CharField(max_length=100)
    budget_cost = models.IntegerField()
    budget_date = models.DateField()
    update_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.budget_item
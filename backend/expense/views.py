from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from django.db.models import Sum

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')

        if UserDetails.objects.filter(email = email).exists():
            return JsonResponse({'message':'Email already exists'}, status=400)
        UserDetails.objects.create(fullname=fullname, email=email, password=password)
        return JsonResponse({'message':'User created successfully'}, status=201)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        try:
            user = UserDetails.objects.get( email = email, password = password)
            return JsonResponse({'message':'Login Successfull!','userId':user.id,'userName':user.fullname},  status=200)
        except:
            return JsonResponse({'message':'Invalid Credentials!'}, status=400)
        
@csrf_exempt
def add_expense(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('userId')
        budget_item = data.get('budget_item')
        budget_cost = data.get('budget_cost')
        budget_date = data.get('budget_date')

        user = UserDetails.objects.get(id = user_id)
        try:
            Budget.objects.create(user_id=user, budget_item = budget_item, budget_cost=budget_cost, budget_date=budget_date)
                    #user_id m
            return JsonResponse({'message':'Expense added to your list'}, status=201)
        except Exception as e:
            return JsonResponse({'message':'Couldnt add the item!', 'error':str(e)}, status=400)
        
@csrf_exempt
def manage_expense(request,userId):
    if request.method == 'GET':
        expenses = Budget.objects.filter(user_id =userId)
        exp_list = list(expenses.values())
        return JsonResponse(exp_list, safe=False)
    
@csrf_exempt
def update_expense(request,expense_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            expense = Budget.objects.get(id = expense_id)
            expense.budget_item = data.get('budget_item',expense.budget_item)
            expense.budget_cost = data.get('budget_cost',expense.budget_cost)
            expense.budget_date = data.get('budget_date',expense.budget_date)
            expense.save()
            return JsonResponse({'message':'Expense updated successfully'},status=200)
        except:
            return JsonResponse({'message':'Expense not found'},status=404)
        
@csrf_exempt
def delete_expense(request,expense_id):
    if request.method == 'DELETE':
        try:
            expense = Budget.objects.get(id = expense_id)
            expense.delete()
            return JsonResponse({'message':'Expense deleted successfully'},status=200)
        except:
            return JsonResponse({'message':'Expense not deleted'},status=404)
        
@csrf_exempt
def search_expense(request,userId):
    if request.method == 'GET':
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')
        expenses = Budget.objects.filter(user_id =userId, budget_date__range=[from_date,to_date])
        exp_list = list(expenses.values())
        agg = expenses.aggregate(Sum('budget_cost'))
        total = agg['budget_cost__sum'] or 0
        return JsonResponse({'expenses':exp_list, 'total':total})
    
@csrf_exempt
def change_password(request,userId):
    if request.method == 'POST':
        data = json.loads(request.body)
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')

        try:
            user = UserDetails.objects.get(id = userId)
            if user.password != old_password :
                return JsonResponse({'message':'Old password is wrong!'}, status=400)
            user.password = new_password
            user.save()
            return JsonResponse({'message':'Password changed Successfully'}, status=201)
        except:
            return JsonResponse({'message':'Couldnt change the password'}, status=404)
        
@csrf_exempt
def profile(request, userId):
    if request.method == 'GET':
        try:
            user = UserDetails.objects.get(id=userId)
            return JsonResponse({'fullname':user.fullname, 'email':user.email}, status=200)
        except:
            return JsonResponse({'Error Fetching profile details'}, status=200)

@csrf_exempt
def update_profile(request,userId):
    if request.method == 'PUT':
        data = json.loads(request.body)
        full_name = data.get('fullname')
        email = data.get('email')

        try:
            user = UserDetails.objects.get(id = userId)
            if full_name is not None :
                user.fullname = full_name
            if email is not None:
                if UserDetails.objects.filter(email = email).exclude(id=userId).exists():
                    return JsonResponse({'message':'Email already exists'}, status=400)
                user.email = email
            user.save()
            return JsonResponse({'message':'Profile updated Successfully'}, status=200)
        except:
            return JsonResponse({'message':'Couldnt update the profile'}, status=404)
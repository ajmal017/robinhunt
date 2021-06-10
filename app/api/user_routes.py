from flask import Blueprint, jsonify, session, request
from flask_login import login_required
from app.models import db, User, Portfolio

user_routes = Blueprint('users', __name__)


# USER DATA ----------------
# grab all users
@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


# grab a user by user id
@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()




# USER PORTFOLIO DATA ----------------
# grab a user's portfolio
@user_routes.route('/<int:user_id>/portfolios')
@login_required
def get_portfolio(user_id):
    portfolio = Portfolio.query.filter(Portfolio.user_id == user_id).first()
    return portfolio.to_dict()


# update a user's cash balance in their portfolio
@user_routes.route('/<int:user_id>/portfolios/<int:portfolio_id>', methods=["PATCH"])
@login_required
def update_cash(user_id, portfolio_id):
    portfolio = Portfolio.query.get(portfolio_id)
    body = request.get_json()  # turn request into dict with key/values from body of request
    adjustment = body.get('adjustment')  # extract adjustment amount from request
    newBalance = portfolio.cash_balance + float(adjustment)  # format adjustment and add to balance
    portfolio.cash_balance = newBalance  # overwrite existing cash balance with new balance var
    db.session.add(portfolio)  # add updates and commit changes
    db.session.commit()
    return portfolio.to_dict() # return updated portfolio to save in state
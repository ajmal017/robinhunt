from flask import Blueprint, jsonify, session, request
from flask_login import login_required
from app.models import db, Portfolio


portfolio_routes = Blueprint('portfolios', __name__)


@portfolio_routes.route('/<int:user_id>')
@login_required
def get_portfolio(user_id):
    portfolio = Portfolio.query.filter(Portfolio.user_id == user_id).first()
    return portfolio.to_dict()


@portfolio_routes.route('/<int:portfolio_id>', methods=["PATCH"])
@login_required
def update_cash(portfolio_id):
    portfolio = Portfolio.query.get(portfolio_id)
    body = request.get_json()
    adjustment = body.get('adjustment')
    newBalance = portfolio.cash_balance + float(adjustment)
    portfolio.cash_balance = newBalance
    db.session.add(portfolio)
    db.session.commit()
    return portfolio.to_dict()

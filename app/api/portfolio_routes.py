from flask import Blueprint
from flask_login import login_required
from app.models import Portfolio


portfolio_routes = Blueprint('portfolios', __name__)


@portfolio_routes.route('/<int:user_id>')
@login_required
def get_portfolio(user_id):
    portfolio = Portfolio.query.get(user_id)
    return portfolio.to_dict()
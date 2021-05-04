from flask import Blueprint
from flask_login import login_required
from app.models import Trade


trade_routes = Blueprint('trades', __name__)


@trade_routes.route('/<int:portfolio_id>')
@login_required
def get_trades(portfolio_id):
    trades = Trade.query.filter(Trade.portfolio_id == portfolio_id).all()
    all_trades = [trade.to_dict() for trade in trades]
    return {"trades": all_trades}
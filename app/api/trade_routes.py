from flask import Blueprint, jsonify, session, request
from flask_login import login_required
# from app.forms import NewTradeForm
from app.models import db, Trade
from datetime import datetime # needed for timestamp

trade_routes = Blueprint('trades', __name__)

# get portfolio for user
@trade_routes.route('/<int:portfolio_id>')
@login_required
def get_trades(portfolio_id):
    trades = Trade.query.filter(Trade.portfolio_id == portfolio_id).all()
    all_trades = [trade.to_dict() for trade in trades]
    return {"trades": all_trades}


# new trade order execution
@trade_routes.route('/<int:portfolio_id>/stocks/<ticker>', methods=['POST'])
@login_required
def add_trade(portfolio_id, ticker):
    # print('MADE IT BACK!')
    # form = NewTradeForm()
    # form['csrf_token'].data = request.cookies['csrf_token']
    # if form.validate_on_submit():
    body = request.get_json()
    trade = Trade(
        portfolio_id=portfolio_id,
        order_type=body.get('order_type'),
        ticker=ticker,
        order_price=body.get('order_price'),
        order_volume=body.get('order_volume'),
        timestamp=datetime.now()
    )
    db.session.add(trade)
    db.session.commit()
    return trade.to_dict()
    # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
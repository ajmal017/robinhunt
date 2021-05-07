from flask import Blueprint
from flask_login import login_required
from app.models import Watchlist, Watchlist_Item


watchlist_routes = Blueprint('watchlists', __name__)


@watchlist_routes.route('/<int:user_id>')
@login_required
def get_watchlist(user_id):
    watchlist = Watchlist.query.get(user_id)
    return watchlist.to_dict()
from flask import Blueprint
from flask_login import login_required
from app.models import Watchlist, Watchlist_Item


watchlist_routes = Blueprint('watchlists', __name__)

# /api/watchlists/:user_id
# grab all watchlists for the logged in user 
@watchlist_routes.route('/<int:user_id>')
@login_required
def get_watchlist(user_id):
    watchlists = Watchlist.query.filter(Watchlist.user_id == user_id).all()
    user_watchlists = [watchlist.to_dict() for watchlist in watchlists]
    return {"watchlists": user_watchlists}

# /api/watchlists/:watchlist_id/items
# grab all watchlist items for a specified watchlist
@watchlist_routes.route('/<int:watchlist_id>/items')
@login_required
def get_watchlist_items(watchlist_id):
    watchlist_items = Watchlist_Item.query.filter(Watchlist_Item.watchlist_id == watchlist_id).all()
    filtered_watchlist_items = [watchlist_item.to_dict() for watchlist_item in watchlist_items]
    return {"watchlist_items": filtered_watchlist_items}
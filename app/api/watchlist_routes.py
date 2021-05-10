from flask import Blueprint, jsonify, session, request
from flask_login import login_required
from app.forms import NewWatchlistForm
from app.forms import NewWatchlistItemForm
from app.models import db, Watchlist, Watchlist_Item


watchlist_routes = Blueprint('watchlists', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f"{field} : {error}")
    return errorMessages


# GET ROUTES 

# /api/watchlists/:user_id
# grab all watchlists for the logged in user 
@watchlist_routes.route('/<int:user_id>')
@login_required
def get_watchlists(user_id):
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



# POST ROUTES 

# /api/watchlists/
@watchlist_routes.route('/', methods=['POST'])
@login_required
def add_watchlist():
    form = NewWatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        watchlist = Watchlist(
            name=form.data['name'],
            user_id=form.data['user_id'],
        )
        db.session.add(watchlist)
        db.session.commit()
        return watchlist.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# /api/watchlists/:watchlist_id
@watchlist_routes.route('/<int:watchlist_id>', methods=['POST'])
@login_required
def add_watchlist_item(watchlist_id):
    form = NewWatchlistItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        watchlist_item = Watchlist_Item(
            watchlist_id=watchlist_id,
            ticker=form.data['ticker'],
        )
        db.session.add(watchlist_item)
        db.session.commit()
        return watchlist_item.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# DELETE routes

# /api/watchlists/:watchlist_id
@watchlist_routes.route('/<int:watchlist_id>', methods=['DELETE'])
@login_required
def remove_watchlist_item(watchlist_id):
    form = NewWatchlistItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        ticker=form.data['ticker']
        watchlist_item = Watchlist_Item.query.filter(Watchlist_Item.ticker == ticker).first()
        db.session.delete(watchlist_item)
        db.session.commit()
        return watchlist_item.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
# from app.models import WatchlistItem


# def watchlist_exists(form, field):
#     print("Checking if watchlist exits", field.data)
#     name = field.data
#     watchlist = Watchlist.query.filter(Watchlist.name == name).first()
#     if user:
#         raise ValidationError("Watchlist is already registered.")


class NewWatchlistItemForm(FlaskForm):
    ticker = StringField('ticker', validators=[DataRequired()])
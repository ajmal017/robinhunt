from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Watchlist


# def watchlist_exists(form, field):
#     print("Checking if watchlist exits", field.data)
#     name = field.data
#     watchlist = Watchlist.query.filter(Watchlist.name == name).first()
#     if user:
#         raise ValidationError("Watchlist is already registered.")


class NewWatchlistForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    user_id = IntegerField('user_id', validators=[DataRequired()])

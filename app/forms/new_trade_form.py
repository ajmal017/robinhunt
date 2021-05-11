from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField, DateTimeField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Watchlist


class NewTradeForm(FlaskForm):
    order_type = StringField('order_type', validators=[DataRequired()])
    order_price = FloatField('order_price', validators=[DataRequired()])
    order_volume = FloatField('order_price', validators=[DataRequired()])
    timestamp = DateTimeField('timestamp', validators=[DataRequired()])
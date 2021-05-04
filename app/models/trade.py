from .db import db

class Trade(db.Model):
    __tablename__ = 'trades'

    id = db.Column(db.Integer, primary_key = True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey("portfolio.id"), nullable=False)
    order_type = db.Column(db.String(255), nullable=False)
    ticker = db.Column(db.String(255), nullable=False)
    order_price = db.Column(db.Numeric, nullable=False)
    order_volume = db.Column(db.Numeric, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    portfolio = db.relationship("Portfolio", back_populates="trades")

    def to_dict(self):
      return {
          "id": self.id,
          "portfolio_id" : self.portfolio_id,
          "order_type" : self.order_type,
          "ticker" : self.ticker,
          "order_price" : self.order_price,
          "order_volume" : self.order_volume,
          "timestamp" : self.timestamp,
      }
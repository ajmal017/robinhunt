from .db import db

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    cash_balance = db.Column(db.Numeric, default=0.00)

    user = db.relationship("User", back_populates="portfolio")
    trades = db.relationship("Trade", back_populates="portfolio")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "cash_balance": self.cash_balance
            }

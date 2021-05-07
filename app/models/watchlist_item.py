from .db import db

class Watchlist_Item(db.Model):
    __tablename__ = 'watchlist_items'

    id = db.Column(db.Integer, primary_key = True)
    watchlist_id = db.Column(db.Integer, db.ForeignKey("watchlists.id"), nullable=False)
    ticker = db.Column(db.String(255), nullable=False)

    watchlist = db.relationship("Watchlist", back_populates="watchlist_items")

    def to_dict(self):
        return {
            "id": self.id,
            "watchlist_id": self.watchlist_id,
            "ticker": self.ticker
            }
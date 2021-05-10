from .db import db

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)

    user = db.relationship("User", back_populates="watchlist")
    watchlist_items = db.relationship("Watchlist_Item", back_populates="watchlist")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name
            }
from app.models import db, Watchlist


def seed_watchlists():
    demo_watchlist = Watchlist(user_id=1, name='Tech Favorites')
    db.session.add(demo_watchlist)
    db.session.commit()


def undo_watchlists():
    db.session.execute('TRUNCATE watchlists RESTART IDENTITY CASCADE;')
    db.session.commit()
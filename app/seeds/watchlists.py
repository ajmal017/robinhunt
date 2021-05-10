from app.models import db, Watchlist


def seed_watchlists():
    demo_watchlist_1 = Watchlist(user_id=1, name='Tech Favorites')
    demo_watchlist_2 = Watchlist(user_id=1, name='Healthcare Favorites')
    db.session.add(demo_watchlist_1)
    db.session.add(demo_watchlist_2)
    db.session.commit()


def undo_watchlists():
    db.session.execute('TRUNCATE watchlists RESTART IDENTITY CASCADE;')
    db.session.commit()
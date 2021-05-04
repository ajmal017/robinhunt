from app.models import db, Portfolio 


def seed_portfolios():
    demo_portfolio = Portfolio(user_id=1, cash_balance=2000.25)
    db.session.add(demo_portfolio)
    db.session.commit()


def undo_portfolios():
    db.session.execute('TRUNCATE portfolios RESTART IDENTITY CASCADE;')
    db.session.commit()
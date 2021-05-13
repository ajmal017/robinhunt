from app.models import db, Trade
from datetime import date


today = date.today()


def seed_trades():
    demo_trade_1 = Trade(
        portfolio_id = 1,
        order_type = 'buy',
        ticker = 'PLUG',
        order_price = 8.28,
        order_volume = 20,
        timestamp = today,
    )

    demo_trade_2 = Trade(
        portfolio_id = 1,
        order_type = 'buy',
        ticker = 'AAPL',
        order_price = 98.75,
        order_volume = 5,
        timestamp = today,
    )

    demo_trade_3 = Trade(
        portfolio_id = 1,
        order_type = 'buy',
        ticker = 'FB',
        order_price = 210.25,
        order_volume = 5,
        timestamp = today,
    )

    demo_trade_4 = Trade(
        portfolio_id = 1,
        order_type = 'buy',
        ticker = 'BABA',
        order_price = 224.13,
        order_volume = 3,
        timestamp = today,
    )

    db.session.add(demo_trade_1)
    db.session.add(demo_trade_2)
    db.session.add(demo_trade_3)
    db.session.add(demo_trade_4)
    db.session.commit()


def undo_trades():
    db.session.execute('TRUNCATE trades RESTART IDENTITY CASCADE;')
    db.session.commit()
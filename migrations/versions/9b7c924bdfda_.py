"""empty message

Revision ID: 9b7c924bdfda
Revises: ce6213593b9f
Create Date: 2021-05-04 16:33:09.466132

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9b7c924bdfda'
down_revision = 'ce6213593b9f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('trades',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('order_type', sa.String(length=255), nullable=False),
    sa.Column('ticker', sa.String(length=255), nullable=False),
    sa.Column('order_price', sa.Numeric(asdecimal=False), nullable=False),
    sa.Column('order_volume', sa.Numeric(asdecimal=False), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('trades')
    # ### end Alembic commands ###

"""empty message

Revision ID: aa8d51ae7fc5
Revises: 0f30756da3af
Create Date: 2020-12-31 16:01:53.386457

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'aa8d51ae7fc5'
down_revision = '0f30756da3af'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('p_address', sa.String(length=50), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'p_address')
    # ### end Alembic commands ###

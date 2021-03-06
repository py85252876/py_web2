"""empty message

Revision ID: d691d98da928
Revises: d17bc28dac3f
Create Date: 2020-12-31 11:24:33.907938

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd691d98da928'
down_revision = 'd17bc28dac3f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'buying', 'user', ['buier_id'], ['id'])
    op.add_column('user', sa.Column('info', sa.String(length=50), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'info')
    op.drop_constraint(None, 'buying', type_='foreignkey')
    # ### end Alembic commands ###

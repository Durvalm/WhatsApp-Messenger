"""Message tablename fix

Revision ID: e6783b73712a
Revises: ada98668fd3d
Create Date: 2024-01-03 12:53:29.371003

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e6783b73712a'
down_revision = 'ada98668fd3d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('chats')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chats',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('content', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('sender_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('receiver_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('timestamp', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], name='chats_receiver_id_fkey'),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], name='chats_sender_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='chats_pkey')
    )
    # ### end Alembic commands ###
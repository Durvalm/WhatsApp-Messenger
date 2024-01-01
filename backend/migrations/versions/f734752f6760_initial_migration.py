"""initial migration

Revision ID: f734752f6760
Revises: 
Create Date: 2024-01-01 13:45:16.349789

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f734752f6760'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('chats')
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('picture_filename', sa.String(length=255), nullable=True))
        batch_op.create_unique_constraint(None, ['picture_filename'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('picture_filename')

    op.create_table('chats',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='chats_pkey'),
    sa.UniqueConstraint('name', name='chats_name_key')
    )
    # ### end Alembic commands ###

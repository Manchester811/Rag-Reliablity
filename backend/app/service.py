from .db import connect
def rows(query,params=()):
    with connect() as c:
        return [dict(r) for r in c.execute(query,params).fetchall()]

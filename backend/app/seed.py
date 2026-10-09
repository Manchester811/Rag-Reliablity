from .db import init_db
from .experiment_engine import create_experiment
if __name__=="__main__":
    init_db()
    eid,_=create_experiment("Seeded Demo",["paraphrase","temporal","contradiction","distractor"],"medium",3)
    print("Created demo experiment:",eid)

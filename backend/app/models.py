from pydantic import BaseModel, Field
class AttackRequest(BaseModel):
    question:str
    expected_answer:str
    attack_types:list[str]=Field(default_factory=lambda:["paraphrase","typo","distractor"])
    severity:str="medium"
class RepairRequest(BaseModel):
    failure_type:str
    current_top_k:int=3
class ExperimentRequest(BaseModel):
    name:str="Reliability Experiment"
    attack_types:list[str]=Field(default_factory=lambda:["paraphrase","temporal","contradiction","distractor"])
    severity:str="medium"
    top_k:int=3


class AskRequest(BaseModel):
    question: str
    document_id: int
    top_k: int = 5

def generate_attacks(question, expected_answer, attack_types, severity="medium"):
    scale={"low":1,"medium":3,"high":5,"critical":8}.get(severity.lower(),3)
    out=[]
    for attack in attack_types:
        if attack=="paraphrase":
            variants=[
                f"In other words, {question}",
                f"Can you restate the answer to this: {question}",
                f"Please determine the answer without relying on the original wording: {question}"
            ]
            q=variants[min(scale-1,2)]
        elif attack=="typo":
            words=question.split()
            if words:
                for i in range(min(scale,len(words))):
                    idx=i % len(words); words[idx]=words[idx][::-1]
            q=" ".join(words)
        elif attack=="temporal":
            q=question+" Focus on the latest applicable year or reporting period."
        elif attack=="multi-hop":
            q="Identify multiple supporting facts, connect them, and answer: "+question
        elif attack=="contradiction":
            q=question+" Compare conflicting evidence and explain which source should be trusted."
        elif attack=="distractor":
            q=question
        elif attack=="ambiguity":
            q=question+" Interpret the question carefully and state any ambiguity."
        elif attack=="negation":
            q="Which statement would be incorrect regarding this question? "+question
        else:
            continue
        out.append({"question":q,"expected_answer":expected_answer,
                    "attack_type":attack,"severity":severity,"intensity":scale})
    return out

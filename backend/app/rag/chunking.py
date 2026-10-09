import re

def fixed(text,size=512,overlap=64):
    words=text.split(); out=[]; step=max(1,size-overlap)
    for i in range(0,len(words),step):
        chunk=" ".join(words[i:i+size])
        if chunk: out.append(chunk)
    return out

def sentence(text,size=5):
    sentences=[x.strip() for x in re.split(r"(?<=[.!?])\s+",text) if x.strip()]
    return [" ".join(sentences[i:i+size]) for i in range(0,len(sentences),size)]

def paragraph(text):
    return [x.strip() for x in re.split(r"\n\s*\n",text) if x.strip()]

def recursive(text,size=512,overlap=64):
    # Dependency-free approximation using paragraph then fixed-size fallback.
    chunks=paragraph(text)
    result=[]
    for c in chunks:
        if len(c.split())<=size: result.append(c)
        else: result.extend(fixed(c,size,overlap))
    return result

STRATEGIES={"fixed":fixed,"sentence":sentence,"paragraph":paragraph,"recursive":recursive}

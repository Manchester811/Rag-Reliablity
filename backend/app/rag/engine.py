from .providers import HybridRetriever, DenseRetriever

def build_retriever(chunks,mode="hybrid"):
    if mode=="dense":
        return DenseRetriever(chunks)
    if mode=="hybrid":
        return HybridRetriever(chunks)
    return HybridRetriever(chunks)

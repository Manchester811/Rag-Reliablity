import math, statistics

def paired_stats(baseline, candidate):
    if len(baseline) != len(candidate) or not baseline:
        raise ValueError("Baseline and candidate must be non-empty paired arrays of equal length")
    deltas=[float(b)-float(a) for a,b in zip(baseline,candidate)]
    mean=statistics.mean(deltas)
    sd=statistics.stdev(deltas) if len(deltas)>1 else 0.0
    se=sd/math.sqrt(len(deltas)) if deltas else 0.0
    # 95% normal approximation interval. Clearly labeled as an approximation.
    margin=1.96*se
    improved=sum(d>0 for d in deltas)
    return {
        "n":len(deltas),
        "mean_delta":round(mean,4),
        "std_delta":round(sd,4),
        "standard_error":round(se,4),
        "ci95_low":round(mean-margin,4),
        "ci95_high":round(mean+margin,4),
        "improved_cases":improved,
        "improved_rate":round(improved/len(deltas),4)
    }

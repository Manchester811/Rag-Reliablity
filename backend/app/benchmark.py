import json
from pathlib import Path
from .experiment_engine import create_experiment
def main():
    eid,(results,total_ms)=create_experiment("Reproducible Local Benchmark",
        ["paraphrase","temporal","contradiction","distractor"],"medium",3)
    avg=round(sum(r["overall"] for r in results)/len(results),2)
    report={
      "experiment_id":eid,"cases":len(results),"average_score":avg,
      "average_latency_ms":round(sum(r["latency_ms"] for r in results)/len(results),2),
      "results":results
    }
    out=Path(__file__).resolve().parents[1]/"data"; out.mkdir(exist_ok=True)
    (out/"benchmark_results.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps(report,indent=2))
if __name__=="__main__": main()

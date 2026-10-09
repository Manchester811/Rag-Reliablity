# Architecture

```text
                 Next.js Dashboard
                         |
                         v
                     FastAPI
                         |
          +--------------+--------------+
          |              |              |
      Experiments     Attacks        Failures
          |              |              |
          +--------------+--------------+
                         |
                  Evaluation Engine
                         |
             +-----------+-----------+
             |                       |
         Demo RAG                 Metrics
             |                       |
             +-----------+-----------+
                         |
                  Failure Diagnosis
                         |
                  Repair Suggestions
                         |
                    Re-run / CI
                         |
                       SQLite
```

Execution:
1. Dataset questions are turned into normal and adversarial test cases.
2. The demo RAG retrieves top-k chunks.
3. Metrics evaluate retrieval and generated answers.
4. Failures receive a root-cause hypothesis.
5. The full configuration is persisted for reproduction.
6. Repair suggestions can be tested by rerunning an experiment.

# Command overview

All commands for the workshop on one page. Explanations are in
[participant_instructions.md](participant_instructions.md).

Run everything from the repository folder, in a terminal where the API key is
exported. 

## Every new terminal

| Command | What it does |
|---|---|
| `read -rs BTELLIGENT_API_KEY && export BTELLIGENT_API_KEY` | API key (paste, Enter) |
| `read -rs LEADERBOARD_TOKEN && export LEADERBOARD_TOKEN` | workshop token, only for submitting |
| `export LEADERBOARD_URL=https://<address>` | leaderboard address, only for submitting |

## OpenSearch

| Command | What it does |
|---|---|
| `git pull` | get the latest version of the workshop material (`git stash && git pull && git stash pop` if you have changed files) |
| `docker compose up -d --wait` | start OpenSearch and Dashboards (also after a restart of the laptop or WSL) |
| <http://localhost:5601/app/discover> | browse and search the CVs in OpenSearch Dashboards |
| `uv run evolve-eval index` | load the 1000 CVs (once; `--if-needed` skips an existing index) |
| `uv run evolve-eval check` | test OpenSearch, index and API key: expect `"ok": true` |
| `docker compose down` | stop OpenSearch and Dashboards, keep the index (`-v` deletes it) |

## Scoring a prompt

| Command | What it does |
|---|---|
| `uv run evolve-eval baseline` | score the starting prompt on dev |
| `uv run evolve-eval run FILE` | score your prompt on dev (40 profiles) |
| `… --split validation` | on validation (20 profiles) instead |
| `… --details` | add the generated query and points for every profile |
| `… --limit 5` | only the first 5 profiles (quick test) |

## Evolving

`R` stands for your run folder, e.g. `evolve/runs/ex1`.

| Command | What it does |
|---|---|
| `uv run openevolve-run evolve/initial_prompt.txt evolve/evaluator.py --config evolve/configs/evolve.yaml --output R --iterations 5` | evolve for 5 iterations (about 3 minutes) |
| `… --checkpoint R/checkpoints/checkpoint_10 --iterations 10` | continue a run for 10 more iterations (same `--output R`) |
| `R/best/best_program.txt` | the best prompt of the run |
| `R/checkpoints/checkpoint_N/programs/` | all candidates with scores and feedback |

What you edit: the meta-prompt in `evolve/meta/templates/` and the evolution
parameters in `evolve/configs/evolve.yaml`.

## Leaderboard

`R` stands for your run folder, e.g. `evolve/runs/ex1`.

| Command | What it does |
|---|---|
| `uv run evolve-eval submit R/best/best_program.txt --name "Your Name" --wait` | submit a prompt (with your current meta-prompt and evolution config) and wait for the score |

Every `evolve-eval` command prints one JSON object; on problems it contains an
`"error"` with a hint. `uv run evolve-eval COMMAND --help` lists all options.

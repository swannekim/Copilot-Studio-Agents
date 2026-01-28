# 🚀 Operative Agents – Hands-On Implementation

This repository contains **my implementation of agents** inspired by the training modules from [**Microsoft Agent Academy – Operative**](https://microsoft.github.io/agent-academy/operative/).  
It includes both:

*   **Agent source code**
*   **Step‑by‑step guides** on how each agent is built
*   **Notes and explanations** following the order and structure of the Microsoft Agent Academy Operative course

Whether you're learning how agents work, studying the architecture, or looking for practical reference code, this repo aims to be a clear and friendly companion.

***

## 📚 About This Repository

The purpose of this repo is to provide a **practical, hands-on collection of agents** built throughout the Operative curriculum.  
It mirrors the course flow:

1.  Core concepts of operational agents
2.  Planning and reasoning patterns
3.  Tool‑using agents
4.  Multi‑step task execution
5.  Safety, evaluation, and deployment
6.  End‑to‑end agent examples

Each folder contains:

*   The **agent implementation**
*   A **README** describing how it was built
*   **Prompts**, **configurations**, and **code snippets** used in training
*   Additional comments or optimizations from my own experience

***

## 📁 Repository Structure

    ├── 01-basic-agents/
    │   ├── agent.py
    │   ├── README.md
    │   └── example_inputs/
    │
    ├── 02-tool-agents/
    │   ├── agent_with_tools.py
    │   ├── tools/
    │   └── README.md
    │
    ├── 03-reasoning-patterns/
    │   ├── chain_of_thought_agent.py
    │   ├── planner_executor/
    │   ├── README.md
    │
    ├── 04-multistep-workflows/
    │   ├── workflow_agent.py
    │   └── README.md
    │
    ├── 05-safety-evaluation/
    │   ├── evaluator.py
    │   └── README.md
    │
    ├── 06-end-to-end-examples/
    │   ├── project1/
    │   ├── project2/
    │   └── README.md
    │
    └── main/  
        ├── shared_utils/
        └── CONTRIBUTING.md

> 📝 *This structure follows the learning path taught in Agent Academy – Operative. The folder names may differ slightly depending on your personal setup.*

***

## 🎯 Goals of This Project

This repo is designed to help you:

*   Understand how **agents think, plan, and act**
*   Learn **tool-calling patterns** and how to integrate them
*   Build agents that can handle **multi-step, real-world tasks**
*   Explore **testing and evaluation** for reliability
*   Recreate and extend the **Operative course** examples in your own environment

If you're also studying Copilot Studio, Power Platform, or Microsoft’s orchestration patterns, these agent examples can provide conceptual grounding as well.

***

## 🧩 What You’ll Find Here

### ✔️ Full agent implementations

Rewritten, simplified, or extended to be easy to read and modify.

### ✔️ Commented code

Explains *why* something is implemented a certain way, not just *how*.

### ✔️ Helpful prompts and configurations

Collected from the course and refined through testing.

### ✔️ Step‑by‑step build guides

So you can use this repo as a self‑contained learning resource.

### ✔️ My sandbox experiments

Extra patterns I tested beyond the course content.

***

## 🏁 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Install dependencies

(If you have a requirements.txt file)

```bash
pip install -r requirements.txt
```

### 3. Run an agent

```bash
python 01-basic-agents/agent.py
```

### 4. Customize and explore

Most agents are modular — swap prompts, replace tools, or integrate new reasoning patterns.

***

## 🧪 Evaluation & Debugging

This repo includes examples of:

*   Automated test sets
*   Observation and improvement cycles
*   Regression detection
*   Logging useful outputs (thinking traces, steps, tool calls)

These follow the Operative module on agent evaluation.

***

## 📜 License

This project is licensed under the MIT License — feel free to fork, improve, and build on top of it.

***

## 🙌 Acknowledgements

This work is based on:

*   **Microsoft Agent Academy – Operative**
*   The open-source agent examples from Microsoft
*   Additional experiments and personal notes during hands‑on study

✨ Huge thanks to the creators of the Agent Academy for making such a clear and practical curriculum.

# 🕵️‍♂️ 02: Authoring Agent Instructions

> [Agent Academy Course Site](https://microsoft.github.io/agent-academy/operative/02-agent-instructions/)

**Codename: Operation Secret Directive**  
> 이 미션은 실습이 아니라, 이후의 Agent 개발 과정 전체에 영향을 주는 **지시문(authoring instructions)** 작성 원칙을 이해하는 데 초점을 둡니다.

---

## 🎯 미션 소개  

Operation Secret Directive는 Copilot Studio 에이전트가 **어떻게 행동하고 의사결정을 내리는지**를 강력하게 좌우하는  
“명확하고 정밀한 지시문(authoring instructions)”을 작성하는 방법을 다룹니다.

에이전트는 잘 쓰여진 지시문을 기반으로 다음을 수행합니다:
- 어떤 도구, 지식, Topic, 다른 Agent를 사용할지 결정  
- 도구 호출 시 필요한 입력값을 추론  
- 사용자에게 전달할 최종 응답 구성  

즉, 지시문은 "AI에게 주는 작전 매뉴얼"이라고 생각하면 됩니다.

---

## 🔎 학습 목표  

이 미션에서는 다음을 학습합니다:

- Copilot Studio에서 에이전트 지시문을 작성하는 방법  
- 도구(tool), 지식(knowledge), Topic, Agent 협업을 지시하는 방식  
- 에이전트가 안정적·정확하게 동작하도록 만드는 원칙  
- 고품질 설명문(description)을 작성하는 법  

---

## 📝 Agent Instructions란 무엇인가?

Instructions는 에이전트 행동의 핵심 규칙입니다. 에이전트는 이를 기반으로:

1. 어떤 Tool/Topic을 사용할지 선택  
2. Tool에 필요한 input 채우기  
3. 사용자에게 응답 생성  

> ⚠️ **중요:** 지시문은 반드시 에이전트가 실제로 가지고 있는 도구/지식 기반으로 작성해야 합니다.  
> 존재하지 않는 기능을 지시해도 에이전트는 수행할 수 없습니다.

예:
- “FAQ를 검색하라” → 반드시 FAQ 문서를 지식 소스로 추가해야 함  
- `/createTicket` 같은 도구 이름을 지시문에 직접 사용할 수 있음  

---

## 📌 지시문에 포함해야 할 요소

- **모호성이 있는 경우 우선순위나 규칙을 명확하게 안내**
- **특정 조건에서만 사용해야 하는 도구 제한**
- **도구 input 채우는 방법에 대한 힌트**
- **응답 포맷 지정 (table, bullet 등)**
- **행동 제약 조건 (특정 주제만 답변)**

### 예시
- “영업시간/예약/결제 관련 질문이 아니라면 FAQ 문서를 사용하라.”
- “티켓 생성은 ticket-creation Topic만 사용한다.”
- “주문 상태는 항상 표(table)로 표시한다.”

---

## 🧪 테스트 및 개선  

지시문을 작성한 뒤:
1. **Test pane에서 에이전트 행동 검증**
2. 필요 시 수정  
3. 변경사항 publish  

---

## 🧠 Advanced Tips

- 지시문을 번호나 리스트로 작성하면 AI가 더 잘 이해함  
- Markdown 사용 권장  
- 특정 기능이 매우 구체적이라면 **Topic으로 분리**하는 것이 좋음  
- 도구/토픽의 **정확한 이름**을 반드시 사용  

---

## 🔐 Safety / Moderation 지침

- 지식 문서를 사용할 때 어떤 도구만 사용 가능한지 제한  
- 도구 input 제한 (예: "특정 이메일 주소만 발송 가능")  
- 민감하거나 위험한 동작을 막는 guardrail 추가  

---

## ✍️ Tool / Topic / Agent 설명문 작성 가이드

에이전트는 설명(description)을 기반으로 어떤 기능을 언제 호출할지 판단합니다.  
좋은 설명문은 아래 원칙을 따릅니다:

### ✔ Best Practices
- **간단하고 직설적**  
- **기능과 목적을 명확하게**  
- **1–2 문장으로 짧고 핵심만**  
- **고유한 이름 사용**  
- **중복 설명 제거**  
- **도구/토픽 간 역할 중첩 없도록 조정**

### 🟢 Good Example  
“This topic provides tomorrow’s weather forecast for any location, including temperature. It does not provide current weather.”

### 🔴 Bad Example  
“This tool can answer questions.”  
(너무 모호함)

---

## 🗂️ Example Instruction Structure

지시문은 다음 구조를 추천합니다:

1. **Overview:** 에이전트 역할·목표  
2. **Process Steps:** 주요 수행 단계  
3. **Collaboration:** 어떤 상황에서 어떤 Agent/Tool 호출  
4. **Safety:** 금지 행동, 제한 규칙  
5. **Feedback Loop:** 모호한 질문 처리 방식, 에스컬레이션 규칙  

---

## 🎉 Mission Complete

이 문서를 통해:

- 정교한 지시문 작성 방법을 이해했고  
- 에이전트 도구/지식 소스 활용 전략을 익혔으며  
- 안전하고 투명한 에이전트 행동을 설계할 수 있게 되었습니다.  

다음 미션은 **Mission 03: Multi-Agent System 구축**입니다.

---

## 📚 추가 참고 자료
- Microsoft Copilot Studio – Authoring Instructions  
- Generative Mode Guidance  

---

# 🇺🇸 Example Instructions (Good & Bad)

## 🟢 GOOD Instructions Examples

### **1. Tool Usage Prioritization**
“Search `/CustomerFAQ` only when the user question is not related to billing, appointment, or operating hours.”

### **2. Explicit Tool Selection Rule**
“When the user requests to create a support ticket, always use the `/CreateTicket` tool. Do not attempt to resolve the issue directly.”

### **3. Response Formatting**
“For any order status inquiry, always provide your response in a three‑column table: Order Number, Status, Expected Delivery.”

### **4. Input Hinting**
“When drafting an email, use the customer’s email address from `/GetCustomerInfo.email`.”

### **5. Safety Guardrail**
“Do not answer questions related to HR, personal data, or medical topics. Respond with a safe alternative message.”

---

## 🔴 BAD Instructions Examples

### ❌ 1. Too Vague  
“Use tools as needed.”  
→ 어떤 도구? 언제? 기준 없음.

### ❌ 2. Incomplete Restrictions  
“Try not to use the ticket tool.”  
→ “try”는 AI에게 명확한 제약이 아님.

### ❌ 3. Conflicting Guidance  
“Always summarize user requests, but also answer immediately.”  
→ 무엇이 우선인지 판단 불가.

### ❌ 4. Missing Tool Names  
“Send an email to the customer.”  
→ 어떤 도구로? 어떤 주소로?

### ❌ 5. Non‑actionable  
“Be smart and solve the problem.”  
→ 구체적인 행동 지침이 없음.
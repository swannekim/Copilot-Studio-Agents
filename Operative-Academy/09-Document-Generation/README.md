# 🚨 09: Generate a Candidate Interview Questions Document
> [Agent Academy Course Site](https://microsoft.github.io/agent-academy/operative/09-document-generation/)


## 🧪 Hands-on: Generating an Interview Document

#### 🎯 Objective

이 실습에서는 **Job Application 정보를 기반으로 AI가 인터뷰 문서를 자동 생성하는 기능**을 만든다.  
Resume + Job Description + Requirements + Candidate Info →  
**Word Template에 자동 채워진 Interview Prep Document** 로 변환하는 전체 파이프라인을 구성한다.

핵심은 3가지:

1.  **멀티모달 Prompt로 문서 생성 (GPT-4.1 사용)**
2.  **Agent Flow에서 Prompt 호출 → 파일 바이트(Binary)를 받아 문서로 반환**
3.  **Topic에서 사용자에게 Word 파일로 전달**


### Create the prompt
> objective: create a prompt capable of analyzing a job description and candidate profile to create tailored interview questions

#### **📌 Why this matters**

이 Prompt는 문서 생성의 핵심 알고리즘 역할을 한다.  
AI가 다음의 정보를 모두 조합해 **면접관이 실제로 활용 가능한 전문 문서**를 만들어야 하기 때문.

*   Candidate Profile
*   Resume Evidence
*   Job Requirements
*   Evaluation of Skills Fit
*   Interview Questions (정확히 10개, 유형별 분배)

Prompt 품질이 좋지 않으면 문서가 잘못 채워지고 → Word Template 필드 매핑이 실패한다.


#### **🧠 Technical Deep Dive**

*   **GPT‑4.1 / GPT‑4o 계열은 “DocumentOutput” (Word/PDF) 생성 가능 모델**  
    기본 모델(mini)은 텍스트 출력만 가능하므로 반드시 변경 필요.
*   Prompt는 “documentOutput” 구조를 포함해 실제 템플릿을 채우는 Word 문서를 반환함.
*   Template 파일(Interview\_Questions\_Template.docx)을 테스트에 넣으면  
    Copilot Studio가 자동으로 템플릿을 분석하여 “19개 필드”를 인식함.
*   모델이 생성하는 JSON/fields → 템플릿의 Content Controls(CC)로 매핑됨  
    → 이 구조가 “표준 문서 생성 파이프라인”.

1. Copilot Studio: Tools > New Tool > Prompt
![alt text](image.png)
2. Rename Prompt Tool: Interview Question Document Prep
3. Instructions
```text
You are tasked with evaluating a candidate’s resume against a specific job listing description and generating a targeted set of interview questions to support structured candidate screening.
### Instructions

1. **Extract Candidate Details:**
    - Identify and extract the candidate’s full name.
    - Extract contact information, specifically the email address.
    - Identify the candidate’s current or most recent job title.
    - Extract location if present.
    - Estimate total years of experience only if supported by resume dates.

2. **Analyze the Job Listing Description:**
    - Review the job description to identify:
    - Must-have requirements
    - Nice-to-have requirements
    - Key responsibilities
    - Required tools and technologies
    - Treat must-have requirements as the highest priority for evaluation.

3. **Evaluate Resume Against Job Requirements:**
    - Compare the resume content against each must-have requirement.
    - For each requirement, determine:
        - Evidence level: Strong, Moderate, Weak, or Missing
        - A confidence score from 0–100
        - Supporting evidence using short phrases grounded in the resume text only
    - Do not infer or invent experience.

4. **Assess Overall Candidate Fit:**
    - Identify:
        - Top strengths (up to 5)
        - Key gaps (up to 5)
        - Risks or concerns only when supported by missing or unclear evidence
        - Provide a concise one-paragraph summary suitable for recruiter review.

5. **Generate Interview Questions (Exactly 10):**
    - Generate exactly 10 interview questions based on the job requirements and resume evaluation.
    - Distribute the questions as follows:
        - 5 Core Requirement Questions focused on the most critical must-have requirements.
        - 3 Gap or Clarification Questions targeting weak, missing, or ambiguous areas.
        - 2 Scenario-Based Questions derived directly from key job responsibilities.
    - Avoid generic or culture-only questions unless explicitly required by the job description.

**Interview Question Requirements:**
    - Each question must include:
        - The interview question
        - The job requirement it maps to
     - Questions must be specific, non-duplicative, and grounded in the provided inputs.
     - Produce questions in numbered format (1, 2, 3)

### Input Data

Application Number:  /ApplicationNumber

Candidate Details (Name, Email)
Resume Details
Job Details (Job Number, Title, Description and Requirements)
Evaluation Criteria (Weighting, Evaluation Criteria)
```
![alt text](image-7.png)
![alt text](image-24.png)
![alt text](image-25.png)
- Change model to GPT-4.1
    - this prompt should generate a document: need to change the model the prompt is using to one that supports multi-modal inputs and outputs
- Test with word template file (Interview_Questions_Template.docx): check 19 identified fields > Save
![alt text](image-8.png)
![alt text](image-31.png)
![alt text](image-28.png)
![alt text](image-27.png)

### Create an agent flow to call the prompt

#### **📌 Why this matters**

Prompt Tool은 단독 실행이 아니라 Agent Flow에서 아래 작업을 해야 한다:

1.  ApplicationNumber(입력) 받기
2.  Prompt 호출
3.  문서의 **Base64 → Binary 변환**
4.  Agent가 전송할 수 있는 **File Output**으로 반환

문서 생성 시 반드시 Binary 파일이 필요하기 때문에, Flow에서 이 변환 단계를 처리해야 한다.



#### **🧠 Technical Deep Dive**

*   Run a prompt 결과는 `documentOutput.contentBytes` 로 Base64 형태로 제공.
*   Flow에서 다음 expression으로 Binary 변환해야 Agent가 파일로 전송 가능함:

<!---->

    binary(outputs('Run_a_prompt')?['body/responsev2/predictionOutput/documentOutput/contentBytes'])

*   Output을 **File 형식**으로 만들어야 Topic에서 파일로 전송할 수 있음.
*   Flow 이름 “Doc Prep”은 Agent 도구로 등록되며,  
    Topic에서 특정 Application Number 와 함께 호출됨.


1. Copilot Studio: Tools > New Tool > Agent Flow
![alt text](image-6.png)
2. When an agent calls the flow trigger to expand it and select the Add an input button
- ApplicationNumber (text)
- description: What's the job application number as the description
![alt text](image-10.png)
3. Add an action: AI capabilites > Run a prompt
![alt text](image-11.png)
4. Respond to the agent > add an output > save draft
- InterviewFile (File): 
binary(outputs('Run_a_prompt')?['body/responsev2/predictionOutput/documentOutput/contentBytes'])
![alt text](image-12.png)
5. Overview tab: Save > Designer tab: publish
- Flow name: Doc Prep
- Description: Creates an interview prep document and returns to the agent
![alt text](image-13.png)
![alt text](image-14.png)

### Create the topic

#### **📌 Why this matters**

Agent가 사용자 질문에 자동으로 반응하여:

*   ApplicationNumber 추출
*   Doc Prep Flow 실행
*   생성된 Word 파일 전달

까지의 end‑to‑end 자동화를 수행하는 부분.

이 Topic이 제대로 구성되지 않으면 Flow는 만들어져도 사용자에게 파일이 돌아가지 않음.

#### **🧠 Technical Deep Dive**

*   Topic Input Variable: `VarApplicationNumber`
    *   숫자 구조를 정확히 제한해야 함 (A#####)
    *   잘못된 값 입력 시 Flow 실패 방지
*   Tool 호출 시 ApplicationNumber에 `VarApplicationNumber` 할당
*   File 전송 시:
    *   Content: Flow Output(InterviewFile)
    *   File Name: 동적 생성
            Topic.VarApplicationNumber & "InterviewPrep.docx"

이렇게 파일명이 자동 생성되면 여러 Application을 테스트할 때 매우 편리함.

1. Interview Agent > Add a topic
- name: Generate Interview Doc
![alt text](image-15.png)
2. Topic trigger description
```text
This topic generates an interview prep document with applicant details, role details and interview questions.
```
3. Topic details > Input > Create a new variable
![alt text](image-16.png)
- Variable name == Display name: VarApplicationNumber
- description: Fill with the Job Application Number referenced in the chat. The number always starts with a J followed by at least 4 digits.
![alt text](image-17.png)
4. Add a tool > Doc Prep
![alt text](image-18.png)
- ApplicationNumber = VarApplicationNumber
![alt text](image-19.png)
5. Add node > Send a message: file
![alt text](image-20.png)
- textbox: Here is your interview prep file.
- add > file
![alt text](image-21.png)
- Content: InterviewFile
- Name: Topic.VarApplicationNumber&"InterviewPrep.docx" (formula)
![alt text](image-22.png)

6. Test topic

#### **📌 Why 이 테스트가 중요함**

문서 생성은 다음 이유로 실패하기 쉽기 때문:

*   Prompt가 템플릿 필드를 모두 채우지 못한 경우
*   Base64 디코딩 오류
*   Application Number가 잘못되었을 때
*   Topic 변수 매핑 오류
*   템플릿 필드 이름 불일치

테스트에서 문제를 발견해야 실제 실습 진행 시 전체 pipeline이 끊기지 않는다.


#### **🧠 Technical Deep Dive**

테스트 흐름은 다음과 같다:

1.  사용자가 입력  
    `Create an interview prep file for job application A01000.`
2.  Topic Trigger: ApplicationNumber 추출
3.  Flow → Prompt 호출
4.  문서 생성
5.  파일 전달
6.  챗에서 즉시 DOCX 다운로드 가능

Activity Map에서 "Doc Prep" Flow 호출 여부와 Prompt Output이 표시됨.

- prompt: Create an interview prep file for job application A01000.
![alt text](image-29.png)
![alt text](image-30.png)
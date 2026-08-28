# 실습 랩 팩 — 새로운 Copilot Studio에서 Workflows 만들기

**대상:** L200–250 · **형식:** 4개 시나리오 중 **2개 선택**
**DLP가 적용된 테넌트 기준으로 작성:** Microsoft 365 커넥터만 사용합니다.

---

## 0. Overview

이 Lab pack에는 **서로 독립적이고 완결된 시나리오 4개**가 들어 있습니다. 시나리오 간 의존 관계는 없습니다.

### 0.1 4 Scenarios

| # | 시나리오 | 실제 업무에서 하는 일 | 트리거 |
|---|---|---|---|
| **1** | **IT Request Triage Desk** | 받은 편지함에 도착하는 모든 요청 메일을 분류하고, 우선순위를 정하고, Excel 추적표에 기록하고, 보낸 사람에게 접수 확인을 보내고, 긴급하면 Teams로 에스컬레이션합니다 — 전부 자동으로. | 메일 수신 |
| **2** | **Reply Desk with Approval** | Microsoft 365 Copilot이 들어온 질문에 근거 있는 답변 초안을 작성하고, 사람이 승인하거나 수정을 요청하고, 에이전트가 그 피드백을 반영한 뒤, 워크플로가 답장을 보냅니다. | 메일 수신 |
| **3** | **Daily Brief 8AM** | 평일 아침마다 Microsoft 365 Copilot이 하루 일정(캘린더, 메일, 채팅)을 읽고, 에이전트가 정해진 형식의 브리핑으로 정리해, 노트북을 열기도 전에 Teams로 전달합니다. | 일정 |
| **4** | **Friday Project Roll-up** | Excel의 프로젝트 추적표를 읽고, 에이전트가 상태와 리스크를 분석하고, 팀 리드에게 요약 승인을 요청한 뒤, 리더십에 메일을 보내고 팀에 게시하고 보고서를 보관합니다. | 일정 |

### 0.2 노드 커버리지

| | Agent node | M365 Copilot node | Human review | Excel Online | Outlook | Teams |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **1 · IT Request Triage Desk** | ✅ | ➕ | ➕ | ✅ | ✅ | ✅ |
| **2 · Reply Desk with Approval** | ✅ | ✅ | ✅ | ➕ | ✅ | ✅ |
| **3 · Daily Brief 8AM** | ✅ | ✅ | ➕ | ➕ | ➕ | ✅ |
| **4 · Friday Project Roll-up** | ✅ | ➕ | ✅ | ✅ | ✅ | ✅ |

✅ **핵심 빌드에 포함** — 이 노드를 실제로 사용합니다
➕ **선택 확장** — 핵심 빌드에는 없지만, 일찍 끝나면 이 팩이 추가하는 방법을 안내합니다.

---

## 1. 시작하기 전에

### 1.1 환경 확인

1. `copilotstudio.microsoft.com` 에서 **Copilot Studio** 를 엽니다.
2. **환경 선택기**(왼쪽 아래, 이름 위)가 랩 환경을 가리키는지 확인합니다. 모든 참가자가 같은 환경에 있어야 합니다.

   > 일부 환경은 미리 보기 호스트 `copilotstudio.preview.microsoft.com` 에서 제공됩니다. 랩 환경이
   > 여기에 해당하면 전환할 때 다시 로그인하라는 화면이 나올 수 있고, URL도 위와 다를 수 있습니다.
   > 정상이며 — 중요한 것은 선택기에 올바른 환경 이름이 보이는지입니다.

3. 왼쪽 탐색 메뉴에서 **Workflows (워크플로)**(**Agents (에이전트)** 아래)가 보이는지 확인합니다. **Workflows (워크플로)** 가 없다면 새 환경이 아직 활성화되지 않은 것입니다 — 세션 중이 아니라 세션 전에 해결하세요.

![Workflows 목록. 만든 모든 워크플로가 게시 상태와 Enabled 토글과 함께 여기에 표시됩니다.](./img/01-workflows-list.png)
*Workflows 목록. 만든 모든 워크플로가 게시 상태와 Enabled 토글과 함께 여기에 표시됩니다.*

4. 브라우저 탭을 3개 더 열어 하나는 **Outlook**(`outlook.office.com`), 하나는 **Teams**, 하나는 **OneDrive**를 띄워 둡니다.

### 1.2 모든 것에 하나의 ID만 ⚠️

> Copilot Studio 로그인과 **여러분이 만드는 모든 연결(connection)** 에 **동일한 회사 또는 학교 계정**을 사용하세요.
>
> 트리거, 에이전트, M365 Copilot 노드, 모든 커넥터 도구는 하나의 ID로 동작합니다. 계정이 서로 다르면 워크플로가 메일을 읽거나 파일에 쓸 수 없고, 실행 시점에 진단하기 매우 까다로운 권한 오류가 발생합니다. 특히 M365 Copilot 노드는 **Connection 필드에 지정된 사용자로 실행**됩니다 — 그 사용자가 Microsoft 365에서 볼 수 있는 것이 곧 워크플로가 사용할 수 있는 범위입니다.

### 1.3 연결(Connections) — 처음에 무엇을 보게 되는가

**연결(connection)** 은 노드가 여러분을 대신해 동작하도록 허용해 둔 권한입니다 — 메일을 읽고, 파일에 쓰고, Teams에 여러분 이름으로 게시합니다. 커넥터마다 하나씩 필요하며, 환경당 한 번만 만들면 됩니다.

**무엇을 보게 될지는 그 커넥터가 이 환경에서 사용된 적이 있는지에 따라 달라집니다:**

| 상황 | 노드에 표시되는 것 | 할 일 |
|---|---|---|
| 해당 커넥터의 연결이 **이미 있음** | 계정 이름과 초록색 **Connected** 체크 | 없음 — 그대로 진행 |
| **아직 연결이 없음** (새로 만든 랩 환경) | **Not connected** | 하나 만들기 — 20초, 아래 절차 |

> ⚠️ **새로 프로비저닝된 랩 환경에서는 처음 사용하는 *모든* 커넥터가 "Not connected"로 표시된다고 예상하세요** — Excel과 M365 Copilot뿐 아니라 Office 365 Outlook과 Microsoft Teams도 마찬가지입니다. 정상이며 무언가 잘못한 신호가 아닙니다. 한 번 만들어 두면 같은 커넥터를 쓰는 이후 모든 노드가 재사용하므로, 환경당 커넥터당 한 번만 하면 됩니다.

**연결을 만드는 방법 (모든 커넥터 동일):**

1. 노드의 구성 패널 맨 위에서 **Connection\*** 을 찾습니다. **Not connected** 라고 표시되어 있습니다.
2. **Not connected** 버튼 자체를 클릭하거나, 그 필드 오른쪽 끝의 작은 **꺾쇠(⌄)** 를 클릭합니다 — 패널 본문의 안내 문구는 클릭해도 아무 일도 일어나지 않으니 주의하세요.
3. 메뉴에 *"No connections available"* 과 **Create new connection** 이 보입니다. 이것을 클릭합니다.
4. 커넥터 이름이 적힌 대화 상자가 나타납니다(예: **Office 365 Outlook** 또는 **M365 Copilot (V2)**). 표시 이름은 비워 둬도 됩니다. **Create** 를 클릭합니다.
5. 로그인 탭이 열립니다. 랩 계정을 선택합니다. 탭은 자동으로 닫힙니다.
6. 이제 필드에 계정이 표시되고, 그 아래 종속 필드들이 로드됩니다.

### 1.4 Excel 통합 문서 준비 (시나리오 1과 4에 필요)

Excel Online (Business)은 **서식이 지정된 Excel Table** 안에 있는 셀만 읽고 쓸 수 있습니다. 1행에 헤더만 입력한 워크시트는 Table이 *아니며*, 커넥터의 **Table** 드롭다운에 나타나지 않습니다. Excel을 쓰는 랩에서 가장 흔한 실패 원인입니다.

> ⏭️ **대신 이렇게 하세요 — 1분이면 됩니다.** `Workflows-Lab.xlsx` 가 **이 가이드와 같은 폴더에** 들어 있으며, 세 개의 Table과 샘플 데이터가 이미 만들어져 있습니다.
>
> 1. 다운로드해서 **본인 OneDrive for Business 최상위 폴더**에 업로드합니다 — 커넥터는 *실행 중인 ID* 가 소유한 파일이 필요하므로, 참가자마다 각자의 사본이 있어야 합니다.
> 2. 파일 이름은 정확히 `Workflows-Lab.xlsx` 로 유지합니다.
> 3. 파일을 닫습니다.
>
> 준비는 이것으로 끝입니다. 아래의 수동 생성 과정은 참고용이자 대비책으로만 남겨 둔 것입니다 — 학습이 아니라 단순 입력 작업이며, Table 이름을 조금이라도 잘못 입력하면 한참 뒤 Excel 노드에서 커넥터 문제처럼 보이는 오류로 나타납니다.

![alt text](./img/image-4.png)

<details>
<summary><b>통합 문서를 직접 만들기 (참고 / 대비책)</b></summary>

<br>

**한 번만 하면 됩니다:**

1. 브라우저에서 **OneDrive for Business** 를 열고 새 Excel 통합 문서를 만듭니다. 이름은 정확히:

   ```
   Workflows-Lab.xlsx
   ```

2. 첫 번째 시트 이름을 `RequestLog` 로 바꿉니다. **A1:I1** 에 다음 헤더를 입력합니다:

   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | ReceivedAt | FromAddress | Subject | Category | Priority | Summary | OwnerTeam | SLAHours | Status |

3. **A1:I1** 을 선택하고 **Insert ▸ Table** 을 고른 뒤, **My table has headers** 를 체크하고 **OK** 를 누릅니다.
4. Table이 선택된 상태에서 **Table Design** 을 열고 **Table Name** 을 다음으로 설정합니다:

   ```
   RequestLog
   ```

5. `ProjectTracker` 라는 두 번째 시트를 추가합니다. **A1:F1** 에 다음 헤더를 입력합니다:

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | Project | Owner | Status | PercentComplete | Risk | LastUpdate |

   3–4단계와 똑같이 Table로 변환하고 이름을 `ProjectTracker` 로 지정합니다.

6. 시나리오 4가 분석할 데이터가 있도록 `ProjectTracker` 에 **샘플 행 6개**를 채웁니다. 아래를 복사하세요:

   | Project | Owner | Status | PercentComplete | Risk | LastUpdate |
   |---|---|---|---|---|---|
   | M365 Copilot rollout — Wave 2 | Jihoon Park | On track | 72 | Low | 2026-08-18 |
   | Intune device compliance baseline | Mina Seo | At risk | 40 | High | 2026-08-14 |
   | Teams Phone migration (Seoul HQ) | Daniel Cho | On track | 88 | Low | 2026-08-19 |
   | Entra ID Conditional Access refresh | Hyewon Lim | Blocked | 25 | High | 2026-08-11 |
   | SharePoint archive cleanup | Jun Kang | On track | 60 | Medium | 2026-08-17 |
   | Purview DLP policy tuning | Sora Yoon | At risk | 35 | Medium | 2026-08-15 |

7. `ReportArchive` 라는 세 번째 시트를 추가하고 **A1:D1** 에 `GeneratedAt`, `Headline`, `AtRiskCount`, `ApprovedBy` 헤더를 입력한 뒤, `ReportArchive` 라는 이름의 Table로 변환합니다.

</details>

---

**어느 방법을 택했든, 두 가지는 공통입니다:**

- 워크플로가 파일을 대상으로 실행될 때는 **파일을 닫아 두세요**. 브라우저 세션이 파일을 잠그고 있으면 Excel 쓰기가 간헐적으로 실패하는 흔한 원인이 됩니다.
- **참가자마다 본인 OneDrive에 파일이 있어야 합니다.** 커넥터는 로그인한 ID로 실행되며, 그 ID가 소유한 파일에만 접근할 수 있습니다. 다른 사람 사본의 공유 링크로는 동작하지 않습니다.

> 📎 **빈 행이 하나 생깁니다.** 헤더만 있는 행에 `Insert ▸ Table` 을 적용하면 범위에 빈 데이터 행이
> 하나 포함된 Table이 만들어집니다. 그래서 워크플로가 처음 쓰는 행은 2행이 아니라 **3행**에 들어갑니다.
> 정상이므로 실패로 해석하지 마세요.

### 1.5 Teams 대상 준비 (시나리오 1, 3, 4에 필요)

두 가지 선택지가 있습니다. 이번 실습에서는 A 권장.

- **옵션 A — 나에게 메시지 보내기 (가장 빠르고, 준비 필요 없음).** Teams 게시 단계에서 **Post in (게시 위치)** 을 **Chat with Flow bot** 으로, **Recipient** 를 본인 메일 주소로 설정합니다. 미리 만들 것이 없습니다.
- **옵션 B — 실제 채널 (더 현실적).** `Workflow Lab` 이라는 팀을 만들고 `Alerts` 라는 **표준(standard)** 채널을 만듭니다.

> ⚠️ **세션 전에 확인할 Teams 제약 두 가지.** **비공개(private) 채널 게시는 지원되지 않습니다** — `Alerts` 는 표준 채널로 만드세요. 그리고 **Flow bot (흐름 봇)** 게시자는 **상용 테넌트에서만** 사용할 수 있습니다. 정부 클라우드에서는 **Post as (다음으로 게시)** 를 **User** 로 설정하세요. 두 작업 모두 Teams 관리 센터에서 Workflows (Power Automate) 앱이 **허용(allow)** 상태여야 합니다.

---

## 2. 핵심 개념

시작하기 전 확인해두면 좋은 용어집.

| 개념 | 여기서의 의미 |
|---|---|
| **Workflow** | Copilot Studio의 자율 실행 단위입니다. 대화 턴이 아니라 **트리거**로 실행되므로, 아무도 보고 있지 않아도 백그라운드에서 일이 처리됩니다. 워크플로는 기본적으로 **결정적(deterministic)** 입니다. 같은 입력은 같은 규칙 경로를 따릅니다. |
| **Trigger** | 워크플로를 시작시키는 이벤트입니다. 다섯 가지 유형은 **Manual (수동)**, **Recurrence (되풀이)**(일정), **Connector (커넥터)**(서비스에서 어떤 일이 발생), **When a HTTP request is received**, **When an agent calls the workflow** 입니다. 이 팩은 Connector와 Recurrence를 사용합니다. |
| **Event → Payload → Action** | 오늘 만드는 모든 것의 사고 모델입니다. 트리거가 **이벤트**로 발동하고, 워크플로에 **페이로드**(메일의 Subject, Body, From)를 넘기고, 뒤따르는 **액션**들이 그 페이로드를 가지고 동작합니다. |
| **Node** | 캔버스 위의 한 단계: 트리거, 액션, 분기, 에이전트 등. |
| **Dynamic content (`/` 토큰)** | 앞선 노드가 만들어 낸 데이터에 대한 참조입니다. 거의 모든 텍스트 필드에서 `/` 를 입력하면 **Insert dynamic content** 패널이 열리고, 거기서 값을 고릅니다. 이것이 워크플로가 고정된 문자열이 아니라 실행 시점의 *실제* 항목을 가지고 동작하게 만드는 장치입니다. **실행마다 달라져야 할 값을 직접 타이핑하고 있다면, 토큰을 넣어야 하는 상황입니다.** |
| **Agent node (inline agent)** | 한 단계를 AI 에이전트에게 맡깁니다. 에이전트는 추론하고, 도구를 호출하고, 결과를 돌려줍니다. **Agent (에이전트)** 를 **New agent for this workflow (이 워크플로의 새 에이전트)** 로 두면 인라인 에이전트가 만들어집니다 — 지시문, 모델, 출력 형태가 이 노드 안에 있고 워크플로와 함께 움직입니다. 판단이 필요한 단계에 사용하세요. |
| **Agent node — 출력 형태(Output shape)** | 패널 *맨 아래* 의 **Output (출력)** 드롭다운이 다음 단계가 무엇을 받을지를 결정합니다: **Text response (텍스트 응답)**(문자열 하나), **Structured output (구조적 출력)**(미리 정의된 필드), **Custom structured output (사용자 지정 구조적 출력)**(직접 정의한 JSON 스키마에 맞는 객체). 구조화된 출력을 쓰면 **각 필드가 각각의 동적 콘텐츠 토큰이 됩니다** — 그래서 `priority` 로 분기하거나 Excel 열에 바로 쓸 수 있습니다. |
| **M365 Copilot node** | 한 단계를 Microsoft 365 Copilot 자체에 맡깁니다. **실행 중인 사용자의 메일, 파일, 캘린더, 채팅에 그라운딩** 됩니다. **Message** 를 작성하면, 답변이 **Body / Response** 토큰으로 돌아옵니다. |
| **Agent node vs. M365 Copilot node** | Microsoft 365에 이미 존재하는 내용을 활용하려면 **M365 Copilot node** 를 쓰세요 — 그라운딩이 내장되어 있고 연결된 사용자로 실행됩니다. 자동화에 특화된 지시문과 통제된 출력 형태가 필요하면 **agent node** 를 쓰세요. 시나리오 2와 3은 이 순서로 둘 다 사용하며, 그것이 핵심입니다. |
| **Human review (인적 검토)** | 워크플로를 일시 정지하고, 지정한 사람(들)에게 양식을 보내고, 누군가 제출하면 다시 진행합니다. 정의한 모든 입력은 사람이 답한 값을 담은 동적 콘텐츠 토큰이 됩니다. 그동안 실행은 **Waiting** 상태로 머뭅니다. |
| **Human-in-the-loop: 설계로 vs. 판단으로** | *설계로(by design)* = 제작자인 여러분이 특정 지점에 Human review 노드를 배치합니다. *판단으로(by judgement)* = agent node에서 **Request human assistance (사람의 도움 요청)** 를 켜고 에이전트가 스스로 에스컬레이션하게 합니다. 시나리오 2와 4는 *설계로* 를 사용합니다. |
| **결정적 단계 vs. AI 단계** | 규칙이 명확하면 결정적 단계를 쓰세요 — 더 저렴하고 예측 가능합니다. 규칙으로 표현할 수 없는 추론이 필요하면 AI 단계를 쓰세요. 좋은 워크플로는 대부분 결정적이고, 판단이 정말 필요한 두세 지점에만 AI가 들어갑니다. |
| **노드 하나 테스트 vs. 전체 흐름 테스트** | 노드의 **Run node (노드 실행)** 탭은 *그 단계만* 실행하며, 실제로 참조하는 상위 값만 임의로 채워 넣게 해 줍니다 — 빠르고, 게시(publish)하지 않습니다. 상단 명령 모음의 **Run** 버튼은 전체 그래프를 실행합니다. 프롬프트를 다듬는 중이라면 노드만, 트리거 로직을 검증한다면 전체를 실행하세요. |
| **Publish (게시)** | 워크플로는 **게시한 뒤에야** 트리거를 수신하기 시작합니다. 오류가 있는 워크플로는 게시할 수 없습니다 — 명령 모음의 **Review (검토)** 버튼이 오류 개수를 보여줍니다. |
| **Activity (활동)** | 실행 기록 탭입니다. 실행을 선택하면 각 노드의 실제 입력과 출력이 캔버스에 로드됩니다. 디버깅은 여기서 합니다. |

![모든 노드에는 자체 Run node 탭이 있어, 다음 노드를 추가하기 전에 한 단계만 따로 테스트할 수 있습니다.](./img/10-run-node-tab.png)

*모든 노드에는 자체 Run node 탭이 있어, 다음 노드를 추가하기 전에 한 단계만 따로 테스트할 수 있습니다.*

### 2.1 오늘 시간을 가장 많이 아껴 주는 다섯 가지 습관

![디자이너 캔버스의 노드 팔레트 — 워크플로를 조립하는 구성 요소들입니다.](./img/03-node-palette.png)
*디자이너 캔버스의 노드 팔레트 — 워크플로를 조립하는 구성 요소들입니다.*


1. **노드를 만들 때마다 바로 이름을 바꾸세요.**

2. **Dynamic Content는 천천히 삽입하고 칩(chip)을 확인하세요.** `/` 를 입력하고, *Insert dynamic content* 패널이 열릴 때까지 **잠시 멈춘 뒤**, 두세 글자를 입력해 필터링하고, 항목을 클릭합니다. Dynamic Content는 글자 단위로 편집할 수 없는 둥근 **칩** 이며, 마우스를 올리면 내부 식(expression)이 표시됩니다.

3. **입력하기 전에 미리 채워진 상자를 비우세요.** 여러 필드에 안내 텍스트가 *이미 들어 있습니다* — Human review의 입력 라벨(`Text`, `Text 1`)과 드롭다운 옵션 상자(`First option`)가 그렇습니다. 그냥 입력하면 **뒤에 덧붙어서** `TextDecision` 이나 `First optionApprove` 같은 값이 됩니다. 항상 **Delete** 를 먼저 하세요. 드롭다운 값이 잘못되면 분기가 **아무 오류도 없이** 조용히 잘못된 경로로 갑니다.

4. **각 노드는 완성한 즉시 테스트하세요.** 다음 노드를 추가하기 전에요. 일곱 번째 노드에 가서야 두 번째 노드가 잘못된 형태를 반환한다는 걸 알게 되면, 30초짜리 테스트보다 훨씬 큰 비용을 치릅니다.

5. **자주 저장하세요.**

---

### 2.2 배경 지식 — Cloud flows vs. agent flows vs. workflows

이미 Power Automate로 자동화를 하고 계실 수도 있습니다. 그렇다면 자연스러운 질문은 *"이건 뭐가 다르고, 내가 쌓아 온 지식은 이제 쓸모없어진 건가?"* 일 겁니다. 짧게 답하면: 아닙니다 — 다만 이것은 겉모습만 바꾼 것이 아니라 실제로 다른 런타임입니다.

<details>
<summary><b>펼치기: 세 가지 자동화의 종류, 그리고 오늘 만드는 것은 어느 쪽인가</b></summary>

<br>

**모든 것을 설명하는 단어: *harness*.**

Copilot Studio에서 만드는 모든 것은 **harness** 위에서 실행됩니다 — 여러분의 설계와 모델 사이에 있는 런타임입니다. 언제 모델을 호출할지, 무엇을 보낼지, 돌아온 결과를 어떻게 해석할지, 어떤 도구를 호출할지를 결정합니다. 현재 Microsoft는 세 가지를 제공하며, harness가 무엇을 만들 수 있는지, 무엇으로부터 복구할 수 있는지, 요금이 어떻게 부과되는지를 결정합니다.

| | **Power Automate cloud flow** | **Agent flow** | **Workflow** ← *이번 랩* |
|---|---|---|---|
| **Harness** | — (Copilot Studio harness 아님) | **Standard harness** | **GitHub Copilot harness** |
| **실행 위치** | Power Automate | Copilot Studio | Copilot Studio |
| **디자이너** | Power Automate 디자이너 | Copilot Studio flow 디자이너 | 새로 설계된 비주얼 캔버스 |
| **차별화 기능** | 가장 넓은 커넥터 범위, 오랜 기간 검증됨 | Copilot Studio 에이전트에 연결된 결정적 자동화 | 네이티브 AI 액션 노드, 에이전트 핸드오프, **노드 단위 테스트** |
| **과금 모델** | Power Automate 라이선스 | Copilot Studio capacity | **Copilot Credits** (사용량 기반) |

> 💷 **과금은 요약이 아니라 공식 문서를 직접 확인하세요.** Microsoft의 harness 문서는 GitHub Copilot harness의 에이전트와 워크플로가 사용량 기반 과금으로 **Copilot Credits** 를 사용한다고 설명합니다. 그런데 workflows 문서는 워크플로가 실행하는 액션마다 **Copilot Studio capacity** 를 소비한다고도 적혀 있고, 관리 센터는 이를 **Agent flow actions** 항목으로 보고합니다. 두 설명 모두 공식 문서에 있습니다. "워크플로는 Copilot Credits를 사용하고, 액션 소비량은 capacity와 함께 확인할 수 있다" 정도를 안전한 요약으로 삼고, 고객에게 구체적인 숫자를 말하기 전에는 라이선스 담당자에게 확인하세요. **모호하지 않은 것 한 가지: 디자이너에서의 테스트는 무료입니다.** 이 팩이 노드를 만들 때마다 테스트하라고 하는 이유입니다.

**왜 하나가 아니라 셋인가?**

왼쪽에서 오른쪽으로 읽어 보세요 — *결정적 자동화와 에이전트가 점점 가까워지는* 흐름입니다:

- **cloud flow** 는 순수한 결정적 자동화입니다. 앱과 서비스를 연결합니다. 에이전트에 대한 개념은 없습니다.
- **agent flow** 는 같은 결정적 자동화를 Copilot Studio 안으로 옮긴 것으로, 에이전트에 붙일 수 있고 Copilot Studio를 통해 과금됩니다. Microsoft 문서는 agent flow를 **standard harness** 의 일부로, *classic* 에이전트처럼 만들고 관리한다고 설명합니다.
- **workflow** 는 **GitHub Copilot harness** 의 자동화 경험입니다 — 트리거와 액션이라는 구조는 같지만, AI 액션·에이전트 핸드오프·노드 단위 테스트가 일급 기능인 캔버스 위에 있습니다.

**가장 중요하고, 사람들이 흔히 오해하는 지점:**

> 워크플로는 여전히 **결정적** 입니다. Microsoft는 agent flow와 workflow를 똑같이 설명합니다 — *"규칙 기반 경로를 따라 액션이나 작업을 실행한다. 같은 입력은 항상 같은 출력을 만든다."*
>
> 에이전트적인 것은 *워크플로* 가 아니라 **그 안에 배치하는 개별 노드들** 입니다. 여러분이 그린 그래프는 여전히 그린 순서대로 위에서 아래로 실행됩니다. 3번 노드가 4번 노드를 건너뛰기로 결정하지 않습니다.
>
> 이 팩의 패턴이 통하는 이유가 바로 이것입니다. 예측 가능한 뼈대에, 판단이 정말 필요한 두세 지점에만 추론을 주입합니다. 감사 가능성과 지능 중 하나를 포기하는 대신 둘 다 얻습니다.

**실제로 마주치게 될 실무적 결과:**

| 상황 | 알아 둘 것 |
|---|---|
| 이미 잘 쓰고 있는 cloud flow가 있음 | agent flow로 **변환** 할 수 있습니다. 과금 방식이 바뀌기 때문에 **되돌릴 수 없는 일방향** 작업입니다. |
| cloud flow를 곧바로 workflow로 변환하고 싶음 | **지원되지 않습니다.** Microsoft는 cloud flow를 *agent flow* 로만 변환할 수 있고 새 workflow 형식으로는 변환할 수 없다고 명시합니다. workflow로 만들고 싶다면 새로 만들어야 합니다. |
| 조직 내에서 누군가는 "agent flow", 누군가는 "workflow"라고 말함 | 둘은 **동의어가 아닙니다.** harness도, 캔버스도, 과금도 다릅니다. 헷갈리면 어떤 버튼을 눌렀는지 물어보세요: **New agent flow**(standard) 인지 **New workflow (새 워크플로)**(GitHub Copilot) 인지. |
| GitHub Copilot harness에서 agent flow를 열었을 때 | 다른 경험으로 넘어가는 것이므로 **새 브라우저 탭** 에서 열립니다. |
| 재무 팀이 비용을 물어봄 | 워크플로는 **Copilot Credits** 를, agent flow는 **Copilot Studio capacity** 를 사용합니다. 둘 다 Power Platform 관리 센터의 **Licensing ▸ Copilot Studio** 에서 확인할 수 있습니다. 구체적인 수치를 말하기 전에 위의 과금 안내를 먼저 읽으세요. |

**여러분의 Power Automate 경험은 그대로 이어집니다.** 트리거, 액션, 커넥터, 동적 콘텐츠, 분기, 실행 기록 — 개념도 사고 방식도 같습니다. 새로운 것은 AI 노드 유형, 에이전트 핸드오프, 노드 단위 테스트입니다. 커리어를 다시 쌓는 수준이 아니라, 하루 정도 익히면 되는 차이입니다.

*출처: [Choose a harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview) · [Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview) · [Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)*

</details>

---

### 2.3 배경 지식 — Agent node vs. M365 Copilot node

두 노드 모두 한 단계에 AI를 넣습니다. 하지만 서로 대체할 수 없으며, 잘못 고르는 것이 이 팩에서 가장 흔한 설계 실수입니다. 한 줄로 정리하면: **M365 Copilot node는 *여러분의 조직* 을 알고 있고, agent node는 *여러분이 시킨 대로* 합니다.**

<details>
<summary><b>펼치기: 어떤 AI 노드를 골라야 하고, 그 이유는 무엇인가</b></summary>

<br>

**차이는 지능이 어디서 오는가에 있습니다.**

| | **Agent node (에이전트)** | **M365 Copilot node** |
|---|---|---|
| **지식의 출처** | *여러분이* 넣은 것 — 지시문과 동적 콘텐츠로 전달한 값 | Microsoft 365 자체 — 실행 중인 사용자의 메일, 캘린더, 채팅, 파일 |
| **여러분이 통제하는 것** | 지시문, 모델, 도구, **출력 형태** | **Message**(보내는 요청 내용) |
| **출력 토큰** | 텍스트 응답이면 `Agent Response`, 구조화된 출력이면 **필드마다 하나씩** | `Body / Response` — 텍스트 한 덩어리 |
| **실행 주체** | 워크플로 | 연결된 사용자, 그 사용자의 권한으로 |
| **가장 잘하는 일** | 넘겨받은 데이터에 *여러분의* 규칙을 적용하기 | *"우리 조직은 이것에 대해 이미 무엇을 알고 있나?"* 에 답하기 |

**판단 기준이 되는 질문:** *이 단계에는 워크플로가 아직 갖고 있지 않은 정보가 필요한가?*

- **그렇다** → M365 Copilot node. Microsoft 365 안으로 들어가 찾아냅니다. 그만큼의 맥락을 동적 콘텐츠로 일일이 넣어 주는 것은 불가능합니다.
- **아니다, 이미 가진 것에 판단만 적용하면 된다** → Agent node. 더 저렴하고, 더 예측 가능하며, 출력 형태를 통제할 수 있습니다.

**출력 형태가 진짜 차이인 이유.** M365 Copilot node는 산문을 반환합니다 — `Body / Response` 문자열 하나. Teams에 게시하기에는 완벽하지만 분기에는 쓸 수 없습니다. **구조화된 출력** 을 쓰는 agent node는 *필드* 를 반환하고 각각이 토큰이 됩니다 — 그래서 시나리오 1에서 `Category` 를 Excel 열에 쓰고 `Priority` 로 분기할 수 있습니다. 다음 단계가 결과를 가지고 *결정* 을 내려야 한다면, 구조화된 출력을 쓰는 agent node가 필요합니다.

**시나리오 2는 의도적으로 이 순서로 둘 다 사용합니다:**

```
M365 Copilot node  →  실제 조직 맥락에 근거한 답변 초안 작성
        ↓
Human review       →  사람이 승인하거나 수정을 요청
        ↓
Agent node         →  엄격한 지시문에 따라 검토자의 피드백을 반영
```

어느 쪽도 다른 쪽의 일을 대신할 수 없습니다. Copilot node에는 *"수정 요청이 비어 있으면 초안을 전혀 바꾸지 말고 그대로 반환하라"* 고 지시할 수 없습니다 — 그것은 자동화에 특화된 동작입니다. 반대로 agent node는 지난 분기에 조직이 VPN 정책에 대해 무엇을 결정했는지 알 수 없습니다. **그 핸드오프 자체가 배울 점** 이며, 단순한 구현 세부사항이 아닙니다.

---

**Inline agent vs. published agent — 기능의 차이가 아니라 설계 선택**

agent node를 추가할 때 **Agent (에이전트)** 를 *New agent for this workflow* 로 두면 **inline agent** 가 만들어집니다. 지시문, 모델, 출력 형태가 노드 안에 있고 워크플로와 함께 움직입니다. 대신 노드가 **이미 게시된 에이전트** 를 가리키게 할 수도 있습니다.

| | **Inline agent** (이 팩) | **Published / referenced agent** |
|---|---|---|
| **존재 위치** | 워크플로 노드 안 | 환경 내 독립 자산으로 |
| **다른 곳에서 재사용** | 불가 | 가능 — 여러 워크플로와 에이전트가 호출 가능 |
| **대화형 사용** | 불가 — 한 단계, 한 결과 | 직접 대화하는 것도 가능 |
| **버전 관리** | 워크플로와 함께 이동 | 자체적으로 관리 |
| **선택 기준** | 에이전트가 **한 프로세스의 한 단계** 만 담당하고, 이식성이 의미 없을 때 | 동작이 **여러 프로세스에서 재사용** 되거나, 사람이 직접 상호작용해야 할 때 |

솔직한 트레이드오프: inline agent는 모든 것을 한곳에 두므로 워크플로를 읽고, 넘겨주고, 다시 만들기 쉽습니다 — 랩에는 정확히 맞고, 단일 목적 로직이라면 실제 운영에서도 종종 맞습니다. 다만 두 워크플로가 *같은* 판단을 필요로 하는 순간, 그 로직은 한 번 게시해서 참조해야 합니다. 그렇지 않으면 같은 지시문을 두 곳에서 관리하게 되고 결국 서로 어긋납니다.

> 💡 **워크플로도 에이전트의 *도구* 가 될 수 있습니다 — 관계는 양방향입니다.** 워크플로에 **When an agent calls the workflow** 트리거와 **Respond to the agent** 액션을 주고 게시하면, 에이전트가 이를 도구로 호출할 수 있습니다. 실제 제약도 있습니다. 응답은 동기식이어야 하고, 워크플로는 **100초** 안에 응답해야 합니다. 오늘 만드는 것과는 반대 방향이며, Copilot Studio의 두 축이 이렇게 결합됩니다.

*출처: [Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview) · [Add a workflow as a tool to an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-agent) · [Choose a harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview)*

</details>


---

# 시나리오 1 — IT Request Triage Desk

**핵심 노드: Agent (custom structured output) · Excel Online (Business) · Outlook · If/Else · Teams**

### 이 시나리오가 해결하는 문제

요청은 평범한 이메일로 들어옵니다 — "로그인이 안 돼요", "노트북이 충전이 안 됩니다", "이 파일은 어떻게 공유하나요". 누군가는 각각을 읽고, 그게 무엇인지 판단하고, 얼마나 급한지 판단하고, 추적표에 넣고, 보낸 사람에게 접수됐다고 알리고, 불이 났다면 적절한 팀을 찔러야 합니다. 이 읽기-라우팅 작업은 매일 아침 누군가의 20~40분을 잡아먹으며, 대기열에서 가장 가치가 낮은 일입니다.

이 워크플로는 그 전부를 이메일 한 통당 약 30초 만에 처리합니다 — 그리고 중요한 것은, *실제* 해결은 사람이 계속 책임지도록 남겨 둔다는 점입니다.

### 무엇을 만드는가

![시나리오 1 완성 모습. 접수 확인이 If/Else 앞에 놓인다는 점에 주목하세요 — 분기는 다시 합쳐지지 않으므로, 공통 단계는 그 위에 둡니다.](./img/14-scenario1-canvas.png)
*시나리오 1 완성 모습. 접수 확인이 If/Else 앞에 놓인다는 점에 주목하세요 — 분기는 다시 합쳐지지 않으므로, 공통 단계는 그 위에 둡니다.*


```
[Trigger]  Office 365 Outlook — When a new email arrives
           Folder: Inbox · Subject filter: [REQ]
    │      payload: Subject · Body · From · Received Time · Message Id
    ▼
[Agent]    "Request Triage Agent"  (new inline agent, no tools)
    │      Output: Custom structured output
    │      → category · priority · summary · owner_team · sla_hours · ack_message
    ▼
[Excel]    Add a row into a table  →  RequestLog
    ▼
[Outlook]  Reply to email  →  acknowledgement to the sender   (runs for every request)
    ▼
[If/Else]  Priority  Equals  High
    ├── If ───▶ [Teams]  Post message  →  urgent escalation
    └── Else ─▶ (nothing)
```

> 🔍 **접수 확인이 왜 분기 *위* 에 놓이는가.** 이 디자이너에서 **If/Else** 는 다시 합쳐지지
> **않습니다**: 각 분기는 그냥 끝납니다. 그 뒤에 이어지는 줄기가 없으므로, *양쪽* 결과 모두에서
> 실행되어야 하는 단계를 둘 곳이 없습니다. 보낸 사람 모두에게 메일을 받았다고 알리는 것처럼
> 공통적인 것은 반드시 분기 **앞** 에 두어야 합니다(아니면 양쪽에 중복으로 넣어야 합니다). 이걸
> 잘못하는 것이 첫 워크플로에서 사람들이 가장 흔히 저지르는 구조적 실수입니다.

---

## Step 1 — 워크플로 만들고 이름 짓기

1. Copilot Studio 왼쪽 탐색에서 **Workflows (워크플로)** 를 선택합니다.
![alt text](./img/image.png)
2. **New workflow (새 워크플로)** 를 선택합니다. 디자이너("Agentic Automations")가 열리고 캔버스에 **Start** 노드 하나가 있습니다.
![alt text](./img/image-1.png)
3. 상단의 제목(**Untitled Workflow (제목 없는 워크플로)**)을 선택하고 그 위에 입력합니다:

   ```
   IT Request Triage Desk
   ```

4. **Save (저장)** 를 선택합니다(또는 Ctrl+S).

> 🔎 **Save 아이콘**
> 이 아이콘은 자주 **비활성화** 된 것처럼 보이며, 그것이 정상입니다: 디자이너가 자동으로 **Draft (초안)** 를 저장해 주므로, 새로 기록할 것이 없으면 Save가 비활성화됩니다.
>
> **Run** 과 **Publish (게시)** 는 워크플로에 **action** 노드가 최소 하나 생기기 전까지 비활성화 상태로 유지됩니다. **Publish (게시)** 에 마우스를 올리면 툴팁에 *"Action node required to publish."* 라고 나옵니다.

![디자이너 명령 모음: 왼쪽에 Build / Activity / Monitor 탭, 오른쪽에 Save, Run, Review, Publish.](./img/12-command-bar.png)
*오른쪽 아이콘은 왼쪽에서 오른쪽으로 Undo, Redo, Version history, Send feedback, Save, Run — 그다음 Review와 Publish 입니다.*

<details>
<summary>💡 <b>개념</b></summary>

워크플로는 Copilot Studio의 자율 실행 측면입니다. 대화 턴이 아니라 트리거로 실행됩니다 — 그것이 여러분이 대화하는 에이전트와의 결정적 차이입니다.

</details>

> 📛 **이름 규칙.** 워크플로 이름은 **반드시 문자로 시작** 해야 합니다. 숫자로 시작하는 이름은
> 곧바로 거부됩니다. 시나리오 3에서 이 규칙을 다시 만나게 됩니다.

---

## Step 2 — 이메일 트리거 구성하기

![이메일 트리거. Subject Filter는 Advanced parameters 아래에 있습니다 — Show all을 클릭해 드러내세요.](./img/11-email-trigger.png)
*이메일 트리거, 구성이 완료된 모습. **Show all (모두 보기)** 을 클릭하기 전에는 카운터가 "Showing 4 of 9" 로 표시되고 Subject Filter는 숨겨져 있습니다.*


1. **Start** 노드를 선택합니다. 오른쪽에 구성 패널이 열립니다.
![alt text](./img/image-2.png)

2. **Trigger type (트리거 유형)** 을 **Manual (수동)** 에서 **Connector (커넥터)** 로 바꿉니다.

   Connector를 선택하면 곧바로 **Select a trigger (트리거 선택)** 대화 상자가 열립니다

3. 그 대화 상자에서 **Office 365 Outlook** 타일을 고르고, **When a new email arrives (새 메일이 도착하면)** 를 고릅니다.

   > 이름이 거의 똑같은 트리거가 네 개 있습니다 — *When a new email arrives*, *…in a shared mailbox*, *…mentioning me arrives*, 그리고 이벤트 트리거. 평범한 **When a new email arrives (새 메일이 도착하면)** 를 고르세요.

   ![alt text](./img/image-3.png)

   환경에 Office 365 Outlook 연결이 이미 있다면 자동으로 바인딩되며 초록색 **Connected** 체크가 표시됩니다. **새 랩 환경에서는 대신 "Not connected" 라고 나옵니다** — 연결을 만든 다음 계속하세요.

4. **Folder (폴더)** 를 설정합니다. 필드 오른쪽의 작은 **Change (변경)** 버튼을 클릭하세요 — 그러면 폴더 선택기가 열립니다. 목록에서 **Inbox** 를 클릭한 다음 **Escape** 를 누르거나 패널의 다른 곳을 클릭해 선택기를 닫습니다. 이제 필드에 `Inbox` 가 표시됩니다.

   > 이 선택기는 *tree* 라서 하위 항목이 있는 폴더는 펼칠 수 있습니다 — 하지만 **Inbox** 는 최상위에 있으므로, 여기서는 한 번 클릭하는 것으로 충분합니다.

5. 이제 제목 필터를 설정합니다. **Advanced parameters (고급 매개 변수)** 아래에서 패널에 **"Showing 4 of 9"** 라고 표시됩니다 — 필터는 숨겨진 다섯 개 중 하나입니다. **Show all (모두 보기)** 을 클릭하고(카운터가 *Showing 9 of 9* 로 바뀝니다), **Subject Filter (제목 필터)** 를 찾아 입력합니다:

   ```
   [REQ]
   ```

6. 노드 이름을 바꿉니다. 구성 패널 헤더에서 **노드 제목을 한 번 클릭** 하면 아래에 *"Click to rename"* 힌트가 보입니다. 기존 텍스트가 이미 선택된 상태로 나타나므로 바로 덮어씁니다:

   ```
   New request email
   ```

   **Enter** 를 누릅니다.
   ![alt text](./img/image-5.png)

7. **Save (저장)** 를 선택합니다.

> ⚠️ **트리거를 좁게 유지하세요.** **Subject filter** 가 없으면 이 워크플로는 받은 편지함에 도착하는 *모든* 메시지에 발동합니다 — 자신이 보낸 접수 확인 메일까지 포함되므로 무한 루프가 됩니다. `[REQ]` 는 이를 테스트 메시지로만 제한합니다. 이 단계를 건너뛰지 마세요.

> 🔎 **토큰은 어디에서 오나요?** 이 트리거의 페이로드가 이후 모든 곳에서 사용하게 될 값입니다: **Subject (제목)**, **Body (본문)**, **From**, **Received Time**, **Message Id (메시지 ID)**. 한 노드 안에서 *Event → Payload → Action* 이 이루어지는 것입니다.

---

## Step 3 — 트리아지 에이전트 추가하기

이것이 이 시나리오의 핵심입니다. 그 앞의 모든 것은 데이터를 옮기지만, 이 노드는 판단을 내립니다.

### 3a — 노드 추가하기

1. 트리거 아래에서 **+**(**Add a step (단계 추가)**) 버튼을 선택합니다.
2. **Add (추가)** 대화 상자에서 **Agent (에이전트)** 타일을 선택합니다.
3. 노드가 **Not connected** 로 열리면 먼저 연결을 만드세요 — 1.3절을 참고하세요. 새 환경에서는 그렇게 나옵니다. 연결되고 나면 **Agent (에이전트)** 드롭다운과 **Instructions (안내)** 필드가 나타납니다.
4. **Agent (에이전트)** 드롭다운을 **New agent for this workflow (이 워크플로의 새 에이전트)** 로 그대로 둡니다.
5. 노드 이름을 `Request Triage Agent` 로 바꿉니다.
![alt text](./img/image-6.png)

<details>
<summary>💡 <b>개념</b></summary>

**New agent for this workflow (이 워크플로의 새 에이전트)** 는 *인라인* 에이전트를 만듭니다: 지시문, 모델, 출력 형태가 이 노드 안에 있고 워크플로와 함께 움직입니다. 다른 곳에서는 재사용할 수 없습니다 — 그리고 에이전트의 역할이 하나의 자동화에 특화되어 있을 때는 그것이 바로 여러분이 원하는 바입니다.

</details>

### 3b — 지시문 작성하기

![인라인 agent 노드: Agent가 'New agent for this workflow'로 설정되어 있고, 지시문과 모델 선택기가 보입니다.](./img/05-agent-node-config.png)

*인라인 agent 노드: Agent가 'New agent for this workflow'로 설정되어 있고, 지시문과 모델 선택기가 보입니다.*

인라인 에이전트에서 **Instructions (안내)** 필드는 직무 설명이자 *동시에* 실행별 프롬프트입니다 — 별도의 Message 필드가 없습니다.

아래 텍스트를 **Instructions (안내)** 에 입력합니다. **`⟨insert /Subject⟩`** 가 보이는 곳에서는 `/` 를 입력하고, 선택기가 뜰 때까지 기다린 뒤, 몇 글자를 입력하고 그 값을 선택하세요.

> 🔤 **트리거의 값이 선택기 어디에 있는가 — 지금 있는 필드에 따라 달라집니다.** **agent 노드의 Instructions** 상자 안에서는 트리거의 출력이 트리거 노드 이름이 *아니라* **Input (입력)** 이라는 제목 아래에 묶여 있습니다. 그래서 여기서는 **Input (입력)** → **Subject (제목)**, **From**, **Body (본문)** 를 찾으면 됩니다. 이후에 나오는 일반 **connector** 필드(Excel과 Outlook 단계)에서는 같은 값이 대신 트리거 노드 이름 — **New request email** — 아래에 묶이고, 앞선 각 노드에 대한 그룹도 함께 나타납니다. 어느 쪽이든 같은 토큰이며, 제목만 다를 뿐입니다.

```
You are the IT service desk triage assistant for an enterprise IT team.
Read the request email below and classify it. Use only what is in the email.
Never invent a fact, a person, a system name, or a date that is not there.

Subject: ⟨insert /Subject⟩
From: ⟨insert /From⟩
Body: ⟨insert /Body⟩

Apply these rules exactly:

category — choose exactly one:
  Access        accounts, passwords, MFA, permissions, group membership, licences
  Hardware      laptops, phones, monitors, docks, batteries, peripherals
  Software      installs, updates, licences for an app, crashes, errors in an app
  HowTo         the sender knows the system works and is asking how to use it
  Other         anything that does not clearly fit above

priority — choose exactly one:
  High     a person or team is blocked right now, or security or data is at risk
  Medium   work is slowed but a workaround exists
  Low      a question, a request for information, or a nice-to-have

summary — one sentence, maximum 25 words, in English, describing what the
sender actually needs. Not what they wrote — what they need.

owner_team — choose exactly one:
  Identity        accounts, passwords, MFA, permissions, groups
  Endpoint        laptops, phones, drivers, operating system, device management
  Collaboration   Teams, Outlook, OneDrive, Excel, Copilot
  ServiceDesk     anything that does not clearly fit the other three

sla_hours — 4 if priority is High, 24 if Medium, 72 if Low.

ack_message — two or three sentences addressed to the sender, written in the
same language as the incoming email. Confirm what you understood, name the
team that will pick it up, and state the response time in hours. Do not
promise a solution, a fix, or a root cause. Do not include a greeting line
and do not include a signature.
```

![alt text](./img/image-7.png)
> ✅ **세 개의 칩을 확인하세요.** 다음으로 넘어가기 전에, 세 값이 리터럴 텍스트가 아니라 색이 입혀진
> **칩** — 글자 단위로 편집할 수 없는 작고 둥근 알약 모양 — 으로 나타나는지 확인하세요. 트리거
> 칩은 필드 이름만 표시합니다: **`Subject`**, **`From`**, **`Body`**. 하나에 마우스를 올리면 툴팁이
> 내부 식을 보여 줍니다. 예: `triggerOutputs()?['body/subject']`; 그것이 진짜 토큰임을 확인하는
> 방법입니다. 토큰이 삽입되지 않았다면 선택기가 열린 채로 남아 그다음에 입력하는 것을 모두 삼켜
> 버리고, 나머지 지시문이 조용히 잘려 나갑니다.

<details>
<summary>💡 <b>지시문을 이렇게까지 구체적으로 쓰는 이유</b></summary>

인라인 에이전트는 실행 시점에 판단합니다. 비결정적 단계를 *신뢰할 수 있게* 만드는 방법은 지시문을 더 짧게 쓰는 것이 아니라 — 에이전트가 추측해야만 하는 모든 틈을 닫는 것입니다. 모든 필드에 허용 값의 명시적이고 닫힌 목록이 있다는 점에 주목하세요. 그것이 다음 단계들(고정된 Excel 열에 쓰기, `High` 로 분기하기)을 안전하게 만드는 요소입니다.

</details>

### 3c — 모델 선택하기

모델 드롭다운은 **Instructions (안내)** 헤더의 오른쪽에 있습니다.

기본값은 **Claude Opus 5**, 무거운 다단계 추론 모델입니다. 이 작업에 잘 동작하므로 그대로 두어도 됩니다.

<details>
<summary>🎯 <b>다만 알아 둘 만한 점</b></summary>

짧은 이메일에 대한 분류는 빠르고 대량으로 이루어지는 일입니다 — 바로 채팅 계층 모델(GPT-5 Chat, Claude Sonnet)이 더 낮은 지연 시간과 비용으로 같은 답을 주는 경우입니다. 노드별로 모델을 적정 규모로 맞추는 것은 이 제품에서 가장 저렴한 최적화입니다. 둘 다 시도해 보고 **Activity (활동)** 에서 실행 시간을 비교하세요.

</details>

### 3d — 출력 형태 잡기 — 이 시나리오에서 가장 중요한 설정

![Output은 agent 패널 맨 아래에 있습니다. Custom structured output은 여러분이 제공하는 JSON 스키마를 검증합니다.](./img/09-agent-output-structured.png)
*Output은 agent 패널 맨 아래에 있습니다. Custom structured output은 여러분이 제공하는 JSON 스키마를 검증합니다.*


1. 구성 패널 **맨 아래** 로 스크롤합니다. **Output (출력)** 은 Tools, Knowledge, Request human assistance, Web search 아래에 있습니다.
2. **Output (출력)** 드롭다운을 열고 **Custom structured output (사용자 지정 구조적 출력)** 을 선택합니다.
3. 그 아래에 **JSON Schema** 상자가 나타납니다. 다음을 붙여넣습니다:

```json
{
  "type": "object",
  "properties": {
    "category":    { "type": "string",  "description": "Access, Hardware, Software, HowTo, or Other" },
    "priority":    { "type": "string",  "description": "High, Medium, or Low" },
    "summary":     { "type": "string",  "description": "One sentence, maximum 25 words" },
    "owner_team":  { "type": "string",  "description": "Identity, Endpoint, Collaboration, or ServiceDesk" },
    "sla_hours":   { "type": "integer", "description": "4, 24, or 72" },
    "ack_message": { "type": "string",  "description": "Two or three sentences for the requester" }
  },
  "required": ["category", "priority", "summary", "owner_team", "sla_hours", "ack_message"]
}
```
![alt text](./img/image-8.png)

4. **Save (저장)** 를 선택합니다.

<details>
<summary>💡 <b>개념 — 이것이 시나리오 전체의 축입니다</b></summary>

**Text response (텍스트 응답)** 를 쓰면 에이전트는 산문 덩어리 하나를 건네주고, 여러분은 그것으로 구조적인 아무것도 할 수 없습니다. **Custom structured output (사용자 지정 구조적 출력)** 을 쓰면 **각 필드가 각자의 동적 콘텐츠 토큰이 됩니다**. 그것이 Step 4에서 `priority` 를 Excel 열에 넣고 Step 6에서 그것으로 분기할 수 있게 해 주는 요소입니다. *AI가 구조를 만들고, 결정적 단계가 그것을 소비합니다.* 이 패턴을 기억하세요 — 이 팩에서 가장 재사용성이 높은 아이디어 하나입니다.

</details>

> 🔤 **토큰은 첫 글자가 대문자입니다.** 스키마는 `snake_case` 를 쓰지만, 선택기는 필드를 첫 글자
> 대문자로 표시합니다: **Category, Priority, Summary, Owner_team, Sla_hours, Ack_message**. 같은
> 값이지만 표시가 다릅니다 — `category` 가 아니라 `Categ` 로 검색하세요.

### 3e — 더 진행하기 전에 노드 테스트하기

1. agent 노드를 선택한 상태에서, 그 사이드 패널의 **Run node (노드 실행)** 탭을 엽니다.
2. 패널에는 여러분의 지시문이 실제로 참조하는 상위 필드만 나열됩니다 — *New request email · 3 of 34* 처럼 표시되며 **From**, **Subject (제목)**, **Body (본문)** 가 나옵니다. 직접 채워 넣으세요:
   - **Subject (제목)** → `[REQ] Cannot sign in to Teams - MFA prompt keeps looping`
   - **From** → 자신의 이메일 주소
   - **Body (본문)** → `Since this morning the MFA prompt on Teams loops forever and I cannot get in. I have a customer call in 40 minutes. Tried restarting and clearing the cache.`
3. **Run** 을 선택합니다.
4. **Output (출력)** 을 읽습니다. 이름이 붙은 여섯 개 필드가 돌아와야 하며, `category` = `Access`, `priority` = `High`, `owner_team` = `Identity`, `sla_hours` = `4`, 그리고 영어로 된 `ack_message` 가 나와야 합니다.

<details>
<summary>💡 <b>전체 흐름이 아니라 노드를 테스트하세요</b></summary>

노드 단위 테스트는 이 단계만 격리해서 실행합니다 — 빠르고, 게시하지 않으며, 나머지 워크플로를 발동시키지 않습니다. 출력이 만족스러워질 때까지 여기서 지시문을 다듬으세요. 프롬프트를 고치는 것은 이 단계에서는 20초지만, 그 위에 노드를 다섯 개 더 쌓은 뒤에는 5분이 걸립니다.

</details>

---

## Step 4 — 요청을 Excel에 기록하기

![Add a row into a table. Location, Document library, File, Table가 모두 확정되어야 Row 필드가 나타납니다.](./img/15-excel-add-row.png)
*Add a row into a table. Location, Document library, File, Table가 모두 확정되어야 Row 필드가 나타납니다.*


![동적 콘텐츠 선택기. 구조화된 출력의 각 필드가 저마다의 토큰이 되며, 데이터 유형이 오른쪽에 표시됩니다.](./img/16-token-picker.png)
*동적 콘텐츠 선택기. 구조화된 출력의 각 필드가 저마다의 토큰이 되며, 데이터 유형이 오른쪽에 표시됩니다.*


1. 에이전트 노드 아래에서 **Add a step (단계 추가)**을 선택합니다.
2. `Add a row into a table`를 검색하고 **Excel Online (Business)** 아래에서 선택합니다.
![alt text](./img/image-9.png)
3. 노드에 **Not connected**가 표시되면 **연결을 만듭니다**
4. 위치 매개변수를 순서대로 설정합니다 — 각 항목이 다음 항목을 불러옵니다:

   | 매개변수 | 값 |
   |---|---|
   | Location | `OneDrive for Business` |
   | Document library | `OneDrive` — 목록에서 **첫 번째가 아니라는** 점에 주의하세요. 보통 첫 번째는 `PersonalCacheLibrary`입니다 |
   | File | **Change (변경)**를 클릭한 뒤 파일 트리에서 `Workflows-Lab.xlsx`를 선택합니다 |
   | Table | `RequestLog` |

   ![alt text](./img/image-10.png)

5. 이제 아홉 개의 테이블 열이 필드로 나타납니다. 각 필드를 채웁니다 — `/`를 입력하고, 잠시 멈추고, 필터링한 뒤 선택합니다:

   | 표시되는 필드 | 삽입할 토큰 | 출처 |
   |---|---|---|
   | Received at | `Received Time` | New request email |
   | From address | `From` | New request email |
   | Subject | `Subject` | New request email |
   | Category | `Category` | Request Triage Agent |
   | Priority | `Priority` | Request Triage Agent |
   | Summary | `Summary` | Request Triage Agent |
   | Owner team | `Owner_team` | Request Triage Agent |
   | SLA hours | `Sla_hours` | Request Triage Agent |
   | Status | *텍스트를 입력합니다* `New` | — |

   ![alt text](./img/image-11.png)

6. 노드 이름을 `Log to request tracker`로 바꾸고 **Save (저장)**를 선택합니다.

> 📎 **필드 라벨은 다시 렌더링됩니다.** 커넥터가 표시를 위해 헤더 이름을 분리하기 때문에,
> `ReceivedAt`는 "Received at"로, `SLAHours`는 "SLA hours"로 표시됩니다. 실제 열 자체는
> 바뀌지 않습니다.

> ⚠️ **Table 드롭다운이 비어 있다면**, 통합 문서에 헤더는 있지만 *형식이 지정된 table*이 없는 것입니다. 섹션 1.4로 돌아가 헤더 행을 선택하고 **Insert ▸ Table**을 사용하세요. 또한 브라우저에서 파일이 **닫혀** 있는지도 확인하세요.

<details>
<summary>💡 <b>방금 무슨 일이 일어났는지 확인하세요</b></summary>

아홉 개 열 중 여덟 개가 토큰으로 채워졌고, `Status`만 직접 입력했습니다. 에이전트에서 **Text response (텍스트 응답)**를 사용했다면 여섯 개의 AI 열은 하나도 불가능했을 것입니다.

</details>

---

## Step 5 — 보낸 사람에게 접수 확인하기

이 단계는 긴급 여부와 관계없이 **모든** 요청에 대해 실행됩니다 — 그래서 분기 *앞*에 위치합니다.

1. **Log to request tracker** 아래에서 **Add a step (단계 추가)**을 선택합니다.
2. `Reply to email`을 검색하고 **Office 365 Outlook** 아래에서 선택합니다.
![alt text](./img/image-12.png)
3. 다음과 같이 구성합니다:

   | 매개변수 | 값 |
   |---|---|
   | **Message ID** | `Message Id` *(New request email에서)* |
   | **Body (본문)** | `Ack_message` *(Request Triage Agent에서)* |
   | Reply all | False (default) |

   ![alt text](./img/image-13.png)

4. 노드 이름을 `Acknowledge the sender`로 바꾸고 **Save (저장)**를 선택합니다.

> 📎 **답장 텍스트는 `Body`에 들어갑니다.** 이 커넥터 버전은 **Message ID**, **To (받는 사람)**, **CC (참조)**,
> **BCC**, **Subject (제목)**, **Body (본문)**, **Reply all (모두 회신)**, **Importance (중요도)**, **Attachments (첨부 파일)**를 노출합니다. `Body`는
> 서식 있는 텍스트 편집기입니다 — 토큰을 거기에 삽입하세요.

<details>
<summary>💡 <b>에이전트가 접수 확인 메시지를 작성한 이유</b></summary>

"요청을 접수했습니다" 같은 판에 박힌 답장은 보낸 사람에게 여러분의 자동화를 무시하라고 가르치는 셈입니다. 에이전트의 `ack_message`는 *그들의 구체적인 문제*를 *그들의 언어로* 다시 설명하고 실제 응답 시간을 약속합니다 — 이것이 사람들이 신뢰하는 자동화와 우회하는 자동화의 차이입니다.

</details>

---

## Step 6 — 높은 우선순위 요청을 Teams로 에스컬레이션하기

### 6a — 분기 추가하기

![If/Else 조건 빌더 — Property, Operator, Value. Else 분기는 자동으로 생성됩니다.](./img/07-ifelse-condition.png)
*If/Else 조건 빌더 — Property, Operator, Value. Else 분기는 자동으로 생성됩니다.*


1. **Acknowledge the sender** 아래에서 **Add a step (단계 추가)**을 선택하고 **If/Else**를 고릅니다.
![alt text](./img/image-14.png)
2. 조건 행을 구성합니다 — 자유 텍스트가 아니라 세 부분으로 이루어집니다:

   | 부분 | 값 |
   |---|---|
   | **Property (속성)** | **Request Triage Agent**의 `Priority` 토큰을 삽입합니다 |
   | **Operator (운영자)** | `Equals` |
   | **Value (값)** | `High`를 입력합니다 |

3. 노드 이름을 `Is it urgent?`로 바꾸고 **Save (저장)**를 선택합니다.
![alt text](./img/image-16.png)
> 📎 **분기의 이름은 If와 Else이며**, **Else** 분기는 자동으로 생성됩니다 —
> 패널에 그렇게 표시됩니다. **Else**는 비워 두세요: Medium이나 Low 요청은 기록되고 접수 확인되며,
> 그것으로 충분합니다.

### 6b — If 분기에 에스컬레이션 게시하기

1. **If** 분기에서 **Add a step (단계 추가)**을 선택합니다.
2. `Post message in a chat or channel`을 검색하고 **Microsoft Teams** 아래에서 선택합니다.
![alt text](./img/image-17.png)
3. 다음과 같이 설정합니다:

   | 매개변수 | 값 |
   |---|---|
   | Post as (다음으로 게시) | `Flow bot` (흐름 봇) *(이미 기본값)* |
   | Post in (게시 위치) | `Chat with Flow bot` (흐름 봇과 채팅) |
   | Recipient | 본인 이메일 주소 |

   *(실제 채널을 사용하시나요? **Post in (게시 위치)**을 `Channel` (채널)로 설정한 뒤 `Workflow Lab`과 `Alerts`를 선택합니다.)*

4. **Message (메시지)**에 다음을 입력하고 표시된 위치에 토큰을 삽입합니다:

   ```
   HIGH PRIORITY REQUEST

   ⟨insert /Summary⟩

   Team:     ⟨insert /Owner_team⟩
   Category: ⟨insert /Category⟩
   Respond within ⟨insert /Sla_hours⟩ hours.

   From:    ⟨insert /From⟩
   Subject: ⟨insert /Subject⟩
   ```
   ![alt text](./img/image-18.png)
5. 노드 이름을 `Escalate to on-call`로 바꾸고 **Save (저장)**를 선택합니다.

> 🚨 **이 단계에서는 칩을 주의 깊게 읽으세요.** 이제 Excel 노드가 생겼으므로, 선택기에는
> `Category`라는 토큰이 **두 개**, `Subject`가 두 개, `Summary`가 두 개 하는 식으로 들어 있습니다 —
> *Add a row into a table*가 방금 만든 행을 반환하기 때문입니다. 첫 번째 항목을 고르면 아무 표시 없이
> `Request Triage Agent.Category`가 아니라 `Log to request tracker.Category`에 묶입니다. 둘 다 "동작"하므로
> 오류는 나지 않고, 단지 잘못된 데이터를 얻게 됩니다. 모든 칩이 의도한 노드를 참조하는지 확인하세요.

<details>
<summary>💡 <b>개념 — 결정적 vs. AI</b></summary>

에이전트는 우선순위가 *무엇인지*를 결정했고, If/Else는 *그것에 대해 무엇을 할지*를 결정했습니다. 규칙이 확실하게 처리할 수 있는 일을 AI 단계에 맡기지 마세요: 분기가 더 빠르고, 무료이며, 감사 가능하고, 항상 동일하게 동작합니다.

</details>

---

## Step 7 — 게시, 실행, 검증

![디자이너 명령 모음: 왼쪽에 Build / Activity / Monitor 탭, 오른쪽에 Save, Run, Review, Publish.](./img/12-command-bar.png)
*디자이너 명령 모음: 왼쪽에 Build / Activity / Monitor 탭, 오른쪽에 Save, Run, Review, Publish.*


1. 명령 모음의 **Review (검토)** 버튼을 확인합니다 — 완성되지 않은 부분이 있으면 문제 개수를 표시합니다. 그런 다음 **Publish (게시)**를 선택합니다.

   제목 옆의 배지가 **Draft → Published**로 바뀌고 Publish 버튼이 *"No changes to publish"*와 함께 비활성화됩니다.

   > ⚠️ 워크플로는 **게시된 뒤에야** 트리거를 수신합니다. 테스트 메일을 먼저 보내면 아무 일도 일어나지 않습니다.

2. Outlook에서 본인에게 테스트 메일을 보냅니다. 다음 중 하나를 복사하세요:

   **Test A — High / Identity로 돌아와야 함**
   ```
   Subject: [REQ] Cannot sign in to Teams - MFA prompt keeps looping

   Since this morning the MFA prompt on Teams loops forever and I cannot get in.
   I have a customer call in 40 minutes. I already restarted and cleared the cache.
   ```

   **Test B — Low / Collaboration으로 돌아와야 함**
   ```
   Subject: [REQ] How do I share an Excel file with an external partner?

   No rush at all. I would like to send a workbook to a partner outside the
   company and I am not sure which sharing option is allowed. Whenever you have time.
   ```

   **Test C — 한국어, Medium 또는 High / Endpoint로 돌아와야 함**
   ```
   Subject: [REQ] 노트북 배터리가 30분 만에 방전됩니다

   지난주부터 완충해도 30분이면 꺼집니다. 외근이 많아 계속 전원을 찾아다니고 있습니다.
   교체가 가능한지 확인 부탁드립니다.
   ```

3. **Activity (활동)** 탭을 열고 실행이 나타날 때까지 기다린 뒤, 실행을 선택해 캔버스에 로드합니다.

   > ⏱️ 인내심을 가지세요. 메일 트리거는 폴링 방식이라 실행은 보통 1~2분 안에 나타납니다. 실행 하나가 완료되는 데는 약 30초가 걸립니다.

4. 로드된 실행에서 각 노드를 선택해 실제로 받은 입력과 출력을 확인합니다.
![alt text](./img/image-19.png)
![alt text](./img/image-21.png)
![alt text](./img/image-20.png)

### ✅ 네 가지 결과 모두 검증하기

| 위치 | 확인해야 할 내용 |
|---|---|
| **Excel** — `Workflows-Lab.xlsx`, `RequestLog` 시트 | 아홉 개 열이 모두 채워지고 `Status` = `New`인 새 행. **행 3**에 들어갑니다(행 2는 table의 빈 시작 행입니다). |
| **Outlook** — 테스트 스레드 | *여러분*의 문제를 *여러분*의 언어로 다시 설명하고 응답 시간을 명시한 답장 |
| **Teams** — Flow bot 채팅 | Test A와 Test C에 대한 에스컬레이션 메시지, **Test B에 대해서는 아무것도 없음** |
| **Activity (활동)** 패널 | 노드별로 열어 볼 수 있는 **Succeeded** 실행 |

**Else** 경로가 동작한다는 것을 증명하기 위해 일부러 Test B를 보내세요. 모든 것에 알림을 보내는 워크플로는 아무것에도 알림을 보내지 않는 워크플로와 같습니다.

![alt text](./img/image-22.png)

### 선택 확장

| 확장 |
|---|
| **트리거와 에이전트 사이에 M365 Copilot node를 추가합니다.** Message: `Have we seen a request like this before? Search my mail and chats for prior cases matching:` + `/Subject`. 그 **Body / Response**를 에이전트의 지시문에 추가 맥락으로 넣어, 조직의 이력을 활용해 분류가 개선되도록 합니다. |
| **High 우선순위에 대한 사람 게이트를 추가합니다.** **If** 분기에서 Teams 게시 앞에 **Human review (인적 검토)** 노드를 삽입하고, Yes/No 입력 `PageOnCall` 하나를 둡니다. 사람이 확인했을 때만 호출합니다. |
| **중복을 제거합니다.** 에이전트 앞에 **Excel Online (Business) ▸ List rows present in a table (테이블에 있는 행 나열)**를 추가하고 최근 제목들을 지시문에 전달해 `duplicate_of`를 표시할 수 있게 합니다. |

---

# 시나리오 2 — Reply Desk with Approval

**핵심 노드: M365 Copilot · Human review · If/Else · Agent · Outlook · Teams**

### 이 시나리오가 해결하는 문제

답이 어디에 있는지 — 어느 스레드, 어느 회의, 어느 결정인지 — 기억만 할 수 있다면 3분이면 *답할 수 있는* 질문들이 도착합니다. 그래서 그 질문들은 받은 편지함에 이틀 동안 앉아 있다가, 결국 급하게 답장을 쓰게 됩니다.

Microsoft 365 Copilot은 이미 그 맥락을 알고 있습니다. 이 워크플로는 그것을 활용합니다 — 다만 사람이 예라고 말하기 전에는 여러분을 대신해 아무것도 보내지 않습니다. 그것이 거의 모든 조직이 실제로 원하는 패턴입니다: **AI는 기계의 속도로 초안을 쓰고, 사람은 사람의 속도로 확정합니다.**

### 무엇을 만드는가

```
[Trigger]  Office 365 Outlook — When a new email arrives
           Folder: Inbox · Subject filter: [Ask]
    ▼
[M365 Copilot]  Draft a reply, grounded in my mail, files, meetings and chats
    │           Time zone: Asia/Seoul        → token: Body / Response
    ▼
[Human review]  emailed to the approver — the run sits at Waiting
    │           inputs: Decision (Approve / Reject) · ChangeRequest (optional)
    ▼
[If/Else]  Decision  Equals  Approve
    ├── If ───▶ [Agent]  apply the reviewer's change request to the draft
    │            ▼
    │           [Outlook] Reply to email
    └── Else ─▶ [Teams]  tell me the reply was suppressed
```

---

## Step 1 — 워크플로와 트리거 만들기

1. **Workflows (워크플로) ▸ New workflow (새 워크플로)**. 제목을 다음으로 바꿉니다:

   ```
   Reply Desk with Approval
   ```

2. **Start** 노드를 선택하고, **Trigger type (트리거 유형)** 을 **Connector (커넥터)** 로 설정한 뒤, 대화 상자에서 **Office 365 Outlook ▸ When a new email arrives (새 메일이 도착하면)** 를 선택합니다.
3. 시나리오 1과 똑같이 구성합니다:
   - **Folder (폴더)** — **Change (변경)** 를 클릭한 뒤 트리에서 **Inbox** 를 선택합니다.
   - **Advanced parameters (고급 매개 변수) ▸ Show all (모두 보기)**, 그런 다음 **Subject filter** = `[Ask]`
4. 노드 이름을 `New question email` 로 바꿉니다. **Save (저장)** 를 선택합니다.
![alt text](./img/image-24.png)

> ⚠️ **시나리오 1도 함께 만들었다면**, 제목 필터가 서로 달라야 합니다 — `[REQ]` 와 `[Ask]`. 같은 받은 편지함을 겹치는 필터로 감시하는 두 워크플로는 같은 메시지에 둘 다 발동하고, 여러분은 남은 세션 내내 이유를 궁금해하게 됩니다.

---

## Step 2 — M365 Copilot으로 답장 초안 작성하기

1. 트리거 아래에서 **Add a step (단계 추가)** 를 선택하고 **M365 Copilot** 타일을 고릅니다.
2. 노드가 **Not connected** 상태로 열립니다. 연결을 만드세요: **Connection** 필드의 **셰브런 ⌄** 을 클릭 → **Create new connection** → *M365 Copilot (V2)* 대화 상자에서 **Create** → 팝업에서 랩 계정을 선택합니다. (본문에 있는 큰 *"Connect to M365 Copilot"* 자리 표시자를 클릭해도 아무 일도 일어나지 않습니다.)
3. **Message** 필드에 아래 텍스트를 입력하되, 표시된 곳에는 `/` 로 토큰을 삽입합니다:

   ```
   Draft a reply to the email below, written on my behalf.

   Use my Microsoft 365 content - my recent mail, files, meetings and chats - to
   ground the answer in what my team has actually said and decided. Where you use
   something you found, say briefly where it came from, for example "as we agreed
   in Tuesday's review". If you cannot find grounding for a point, say plainly that
   you will follow up with the detail rather than inventing it.

   Subject: ⟨insert /Subject⟩
   From:    ⟨insert /From⟩
   Body:    ⟨insert /Body⟩

   Write the reply as a plain-text email body in the same language as the incoming
   email. Keep it under 150 words. Use short paragraphs. End with one clear next
   step and an owner for it.

   Do not include a subject line, a greeting header block, or a signature.
   Return only the reply text and nothing else.
   ```
   ![alt text](./img/image-23.png)

4. **Time zone** 을 설정합니다. **Advanced parameters (고급 매개 변수)** 아래에 이미 보이며(*Showing 2 of 3*), **IANA 식별자** 를 받습니다:

   ```
   Asia/Seoul
   ```

5. 노드 이름을 `Draft reply with Copilot` 로 바꿉니다. **Save (저장)** 를 선택합니다.
![alt text](./img/image-25.png)

> ⏰ **이 필드는 기본값이 `America/New_York` 입니다.** UTC도 아니고, 여러분 테넌트의 지역도 아닙니다. 그대로 두면 "today", "this week", "yesterday's meeting" 같은 모든 상대적 표현이 뉴욕 시간으로 해석됩니다. 의도적으로 설정하세요.

<details>
<summary>💡 <b>개념 — agent node가 아니라 이 노드를 쓰는 이유</b></summary>

M365 Copilot 노드는 **Connection 필드의 사용자로 실행** 되며, 별도 설정 없이 그 사용자의 메일, 파일, 캘린더, 채팅에 그라운딩됩니다. agent 노드가 비슷한 수준의 맥락에 다가가려면 도구와 지식을 일일이 연결해 줘야 합니다. 어림잡는 기준: **Microsoft 365가 이미 아는 것을 활용 → M365 Copilot 노드. 자동화에 특화된 동작을 구축 → agent 노드.** Step 5는 바로 그 이유로 agent 노드를 사용하므로, 한 워크플로 안에서 둘 다 보게 됩니다.

</details>

> 🔐 **연결된 사용자가 Microsoft 365에서 볼 수 있는 것은 무엇이든 이 노드가 사용할 수 있습니다.** 연결 계정은 편의의 문제가 아니라 보안 결정입니다. 이 노드를 공유 계정이나 권한이 높은 계정에 연결하지 마세요.

### 지금 바로 테스트

노드의 **Run node (노드 실행)** 탭을 열어 Subject, From, Body를 직접 붙여 넣고 **Run** 을 선택합니다. 초안을 읽어 보세요. 너무 길거나, 너무 격식을 차렸거나, 사실을 지어냈다면, 나중이 아니라 여기서 Message를 고치세요.

> 📤 **답은 `Body / Response` 로 돌아옵니다.** 이 노드는 여섯 개의 토큰을 반환합니다 — *Body*, *Body / Conversation ID*, *Body / Response*, *Body / Citations*, *See More URL*, *Type*. 초안 텍스트는 **Body / Response** 입니다("The response from the Copilot agent" 로 설명됨). 그냥 "Response" 라는 이름의 토큰은 없으므로, `Response` 로 필터링한 뒤 설명이 맞는 항목을 고르세요.

---

## Step 3 — 사람 검토 관문 추가하기

### 3a — 노드 추가

1. Copilot 노드 아래에서 **Add a step (단계 추가)** 를 선택하고 **Human review (인적 검토)** 타일을 고릅니다. 그 타일 하나로 노드가 추가되며, 골라야 할 하위 항목은 없습니다.

![Human review 노드. 정의하는 각 입력은 검토자의 답을 담은 토큰이 됩니다. 텍스트 입력에는 드롭다운 옵션을 줄 수 있습니다.](./img/06-human-review-inputs.png)
*Human review 노드. 정의하는 각 입력은 검토자의 답을 담은 토큰이 됩니다. 텍스트 입력에는 드롭다운 옵션을 줄 수 있습니다.*

2. 연결은 자동으로 바인딩됩니다.
3. 노드 이름을 `Approve the reply` 로 바꿉니다.

### 3b — 네 개의 필드 구성

| Field | 입력할 내용 |
|---|---|
| **Title** | `Approve reply: ` 를 입력한 뒤 `/Subject` 토큰을 삽입합니다. *(이것이 승인자가 받는 이메일의 제목 줄이 됩니다.)* |
| **Message** | 아래 블록 — 표시된 곳에 토큰을 삽입합니다. |
| **Assigned to (first to respond)** | 여러분 본인의 이메일 주소. 드롭다운에서 해석된 항목을 고릅니다. |
| **Channel** | `Outlook`, 또는 요청을 더 빨리 받고 싶다면 `Teams` — 아래 노트를 보세요. |

**Message:**

```
A reply has been drafted for the email below. Review the draft and choose
whether to send it.

--- ORIGINAL MESSAGE ---
From: ⟨insert /From⟩
Subject: ⟨insert /Subject⟩

⟨insert /Body⟩

--- DRAFTED REPLY ---
⟨insert /Body / Response from Draft reply with Copilot⟩

--- HOW TO RESPOND ---
Choose Approve to send it. Leave ChangeRequest empty to send the draft exactly
as it is, or describe in one or two sentences what you want changed and it will
be revised before sending.
```
![alt text](./img/image-26.png)

> 📬 **이 위에 무언가를 쌓기 전에 Human review에 대해 알아 둘 세 가지:**
> 1. **필드 이름이 규칙을 말해 줍니다** — *Assigned to (first to respond)*. 세 사람에게 할당해도 가장 먼저 제출한 것만 처리됩니다.
> 2. **요청은 테넌트 밖으로 보낼 수 없습니다.** 내부 주소로 할당하세요.
> 3. **`Channel` 은 Outlook 또는 Teams를 지원합니다.** 이 랩은 Outlook을 사용하는데, 이메일로 오는 양식에 전체 초안이 담겨 검토하기 더 쉽기 때문입니다. 카드를 선호한다면 Teams 전달도 가능합니다.

### 3c — 입력 정의

정의하는 각 입력은 사람이 답한 값을 담은 동적 콘텐츠 토큰이 됩니다.

1. **Add an input (입력 추가)** 을 선택하고 유형 **Text** 를 고릅니다.
   - 라벨 상자가 **`Text` 로 미리 채워진 채** 나타납니다. 클릭한 뒤 **Ctrl+A**, **Delete** 를 누르고, 다음을 입력합니다:
     ```
     Decision
     ```
   - 입력의 **⋯** 메뉴(*More options for Decision*)를 열고 **Add dropdown** 을 선택합니다.
   - **Option 1** 상자가 나타나는데 **`First option` 으로 미리 채워져** 있습니다. 클릭하고 **Ctrl+A**, **Delete** 를 누른 뒤 입력합니다:
     ```
     Approve
     ```
   - **Add new option** 을 클릭하고 입력합니다:
     ```
     Reject
     ```

2. 다시 **Add an input (입력 추가)** 을 선택하고 **Text** 를 고른 뒤, 미리 채워진 라벨을 지우고 이름을 지정합니다:
   ```
   ChangeRequest
   ```
   그 입력의 **⋯** 메뉴를 열고 **Make optional** 을 선택합니다.

3. **Save (저장)** 를 선택합니다.
![alt text](./img/image-27.png)

<details>
<summary>💡 <b>개념 — 검토 관문은 단순한 승인 버튼이 아니다</b></summary>

예/아니오 관문은 사람을 도장 찍는 기계로 만듭니다. 선택적 자유 텍스트 필드 하나를 더하면 같은 노드가 *협업* 단계로 바뀝니다: 검토자가 아무것도 다시 쓰지 않고도 결과를 이끌 수 있습니다. 그 필드 하나가 사람들이 받아들이는 자동화와 꺼 버리는 자동화의 차이를 만듭니다.

</details>

<details>
<summary>💡 <b>설계로 vs. 판단으로</b></summary>

여러분은 방금 이 관문을 의도적으로 배치했습니다 — *설계에 의한 human-in-the-loop*. 대안은 *판단에 의한* 방식입니다: agent 노드에서 **Request human assistance (사람의 도움 요청)** 를 켜서 에이전트가 스스로 에스컬레이션하게 하는 것입니다. 액션이 항상 위험이 클 때(여러분을 대신해 메일 보내기)는 *설계로* 를, 엣지 케이스에서만 그럴 때는 *판단으로* 를 쓰세요.

</details>

---

## Step 4 — 결정에 따라 분기

1. 검토 노드 아래에서 **Add a step (단계 추가)** 을 선택하고 **If/Else** 를 고릅니다.
2. 조건을 구성합니다:

   | 항목 | 값 |
   |---|---|
   | **Property (속성)** | **Approve the reply** 의 `Decision` 토큰을 삽입 |
   | **Operator (운영자)** | `Equals` |
   | **Value (값)** | `Approve` 입력 |

3. 노드 이름을 `Approved?` 로 바꿉니다.
![alt text](./img/image-28.png)
4. **Else** 분기에서 **Add a step (단계 추가) ▸ Microsoft Teams ▸ Post message in a chat or channel (채팅 또는 채널에서 메시지 게시)** 을 선택합니다:

   | 매개변수 | 값 |
   |---|---|
   | Post as | `Flow bot` |
   | Post in | `Chat with Flow bot` |
   | Recipient | 자신의 메일 주소 |
   | Message | `Reply suppressed by reviewer - ` 뒤에 `/Subject` 삽입 |

5. 이름을 `Tell me it was suppressed` 로 바꿉니다. **Save (저장)** 를 선택합니다.
![alt text](./img/image-29.png)

---

## Step 5 — 피드백을 반영한 뒤 회신

### 5a — 마무리 에이전트 (If 분기)

1. **If** 분기에서 **Add a step (단계 추가)** 을 선택하고 **Agent (에이전트)** 타일을 고릅니다.
2. **Agent (에이전트)** 를 **New agent for this workflow (이 워크플로의 새 에이전트)** 로 둡니다. 노드 이름을 `Apply reviewer feedback` 로 바꿉니다.
3. **Instructions (안내)** 에 다음을 입력합니다:

   ```
   You finalise an email reply just before it is sent.
   Return only the final email body. No preamble, no explanation, no subject line,
   no signature, no quotation marks around the result.

   DRAFTED REPLY:
   ⟨insert /Body / Response from Draft reply with Copilot⟩

   REVIEWER'S CHANGE REQUEST:
   ⟨insert /ChangeRequest from Approve the reply⟩

   Rules:
   - If the change request is empty, return the drafted reply completely unchanged.
   Do not "improve" it. Do not reword it.
   - If the change request has content, apply it faithfully and return the full
   revised reply.
   - Never add a fact that appears in neither the draft nor the change request.
   - Keep the language of the draft.
   ```
   ![alt text](./img/image-30.png)

4. **Output (출력)** 을 **Text response (텍스트 응답)** 로 둡니다. **도구는 추가하지 않습니다** — 이 에이전트는 읽고 추론하기만 하면 됩니다.
![alt text](./img/image-31.png)
5. **Save (저장)** 를 선택합니다.

<details>
<summary>💡 <b>개념 — 도구가 없는 agent node도 여전히 agent node입니다</b></summary>

도구는 에이전트가 *행동* 하게 해 줍니다. 도구가 없으면 읽고 추론만 할 수 있습니다. 여기서 필요한 것은 추론뿐입니다. 또한 지시문이 요청하지 않은 개선을 명시적으로 금지하고 있다는 점에 주목하세요 — 그 문장이 없으면 모델은 사람이 이미 승인한 회신을 친절하게 다시 써 버리고, 여러분의 승인 게이트는 조용히 아무 의미도 없어집니다.

</details>

### 5b — 회신 보내기

1. 같은 **If** 분기에서 에이전트 아래에 **Add a step (단계 추가) ▸ Office 365 Outlook ▸ Reply to email (메일에 회신)** 을 선택합니다.
2. 구성합니다:

   | 매개변수 | 값 |
   |---|---|
   | **Message ID** | `Message Id` *(New question email에서)* |
   | **To (받는 사람)** | `From` *(New question email에서)* |
   | **Body (본문)** | `Agent Response` *(Apply reviewer feedback에서)* |
   | Reply all | False (default) |

   ![alt text](./img/image-32.png)

3. 노드 이름을 `Send the approved reply` 로 바꿉니다. **Save (저장)** 를 선택합니다.

> 📤 **Text response로 설정된 에이전트는 토큰 하나를 반환합니다: `Agent Response`** ("The agent response text" 로 설명됨). 이 토큰에는 노드 이름이 접두어로 붙으므로 칩은 `Apply reviewer feedback.Agent Response` 로 표시됩니다.

---

## Step 6 — 게시, 실행, 승인, 검증

1. **Publish (게시)** 를 선택합니다.
2. 자신에게 테스트 메일을 보냅니다. **메일함에 실제로 존재하는 주제를 고르세요** — 그래야 Copilot 그라운딩이 뻔한 답이 아니라 눈에 보이게 드러납니다.

   **Test A — 그라운딩된 질문**
   ```
   Subject: [Ask] Where did we land on the Teams Phone migration timeline?

   Hi - could you confirm the current plan for the Seoul HQ cutover, and whether
   the pilot group feedback changed anything? I need to brief my team on Friday.
   ```

   **Test B — 그라운딩이 없는 질문, 지어내지 않음을 증명하기 위해**
   ```
   Subject: [Ask] Can you confirm the Q4 budget number for the Busan site?

   I need the approved figure before I submit the forecast.
   ```

3. **Activity (활동)** 를 지켜보세요. 실행은 검토 노드에 도달해 **Waiting** 을 표시합니다.
4. **Step 4에서 고른 채널을 여세요.** `Approve reply: [Ask] …` 라는 제목의 요청을 받게 되며, 여기에는 원본 메시지, 초안, 양식이 담겨 있습니다.

   > 🔒 **Outlook 한정:** Outlook이 **"blocked content"** 배너를 표시하면 **Show blocked content** 를 클릭하세요 — 그러기 전까지 대화형 양식이 렌더링되지 않습니다.
   >
   > ⏱️ **아무것도 오지 않아도 잘못 만들었다고 단정하지 마세요.** 노드는 **Waiting** 을 표시하고, 카드가 10초 만에 오든 아예 오지 않든 실행은 오류를 보고하지 않습니다 — 읽을 실패 자체가 없습니다.

5. 세 가지 경로를 모두 확인하려면 별도의 테스트 메일로 응답하세요. **반영되었음을 증명할 수 있도록 수정 요청을 작성하세요** — 측정 가능한 무언가 *와 함께* 초안 어디에도 나오지 않는 특정 단어를 요구하세요:
   - **Run 1** — `Decision` = `Approve`, `ChangeRequest` = *비움*. **Submit** 을 선택합니다.
   - **Run 2** — `Decision` = `Approve`, `ChangeRequest` = `Make it much shorter - two sentences maximum - and add that I will confirm the approved method by Wednesday.` **Submit** 을 선택합니다.
   - **Run 3** — `Decision` = `Reject`. `ChangeRequest` 는 비워 둡니다.
6. 워크플로는 각 제출 후 1분 이내에 재개됩니다.
![alt text](./img/image-34.png)
![alt text](./img/image-33.png)
![alt text](./img/image-35.png)
![alt text](./img/image-36.png)

> **Run 3:** 거부된 실행은 아무것도 보내지 않으므로 받은 편지함으로 다시 들어오는 것이 없고 추가 실행도 나타나지 않습니다.

### ✅ 검증

| 위치 | 보여야 하는 것 |
|---|---|
| **검토 채널** — 승인 요청 | 원본 메시지 *와* 초안이 담긴 양식, 그리고 여러분의 두 입력 |
| **Outlook** — Run 1 스레드 | 초안과 **단어 하나까지 일치** 하는 회신 |
| **Outlook** — Run 2 스레드 | 여러분이 요구한 길이로 줄어들고 **요청한 단어를 포함** 한 회신(`Wednesday`) — 에이전트가 재전송이 아니라 수정했다는 증거 |
| **Teams** — Run 3 | `Reply suppressed by reviewer - [Ask] …`, 그리고 Outlook 스레드에는 여전히 **정확히 한 개의 메시지** — 회신 없는 원본만 남음 |
| **Activity (활동)** 패널 | 게이트가 열려 있는 동안 **Waiting**, 그다음 **Succeeded** 를 보이는 실행 |

> **human-in-the-loop**: 양식을 제출할 때까지 실행이 **Waiting** 에 머무는 것을 통해 확인 가능합니다.

### 선택 확장

| 확장 |
|---|
| **감사 추적.** 회신 뒤에 **Excel Online (Business) ▸ Add a row into a table (테이블에 행 추가)** 를 추가해 `ReceivedAt`, `Subject`, `Decision`, `ChangeRequest` 를 로그 테이블에 기록합니다. 규제 환경에서는 대개 이 단계가 워크플로를 운영 승인받게 만드는 단계입니다. |
| **전문 에이전트를 지정.** M365 Copilot 노드에서 **M365 agent** 필드를 전문 에이전트로 설정하고 초안을 기본값과 비교합니다. |
| **주제별로 승인을 라우팅.** 검토 노드 앞에 If/Else 를 추가하고 주제마다 **Assigned to** 를 다르게 설정해, 가격 질문은 한 승인자에게, 기술 질문은 다른 승인자에게 가게 합니다. |
| **게이트를 Teams로 전환.** **Channel** 을 `Teams` 로 바꾸고 검토자 경험을 비교합니다. |

---

# 시나리오 3 — Daily Brief 8AM

**핵심 노드: Recurrence 트리거 · M365 Copilot · Agent · Teams**

### 이 시나리오가 해결하는 문제

업무일의 처음 25분은 하루를 재구성하는 데 쓰입니다. 오늘 어떤 회의가 있는지, 어제 답하지 못한 것은 무엇인지, 10:00 전에 무엇을 읽어 두어야 하는지. 실제로 일이긴 하지만, 매일 반복되고, 아무것도 만들어 내지 못합니다.

Microsoft 365 Copilot은 이미 그 모든 것에 답할 수 있습니다. 혼자서 하지 못하는 단 한 가지는 *시키지 않아도 스스로 나타나는 것* 입니다. 일정 기반 워크플로가 더해 주는 것이 바로 그것이며, 이 팩에서 챗 어시스턴트와 자율 워크플로의 차이를 가장 깔끔하게 보여 주는 사례입니다.

### 무엇을 만드는가

```
[Trigger]  Recurrence — every weekday at 08:00, (UTC+09:00) Seoul
    ▼
[M365 Copilot]  Read my day: meetings · unanswered mail · prep · free time
    │           Time zone: Asia/Seoul        → token: Body / Response
    ▼
[Agent]    "Format the brief"  (new inline agent, no tools)
    │      Output: Text response  →  a fixed, scannable layout + Top 3
    ▼
[Teams]    Post message  →  lands in chat before you open your laptop
```

---

## Step 1 — 워크플로와 일정 만들기

![Recurrence 트리거. Frequency를 먼저 설정한 다음 요일, 시, 분을 지정합니다. Time zone은 Advanced 구분선 아래에 있습니다.](./img/08-recurrence-config.png)
*Recurrence 트리거. Frequency를 먼저 설정한 다음 요일, 시, 분을 지정합니다. Time zone은 Advanced 구분선 아래에 있습니다.*


1. **Workflows (워크플로) ▸ New workflow (새 워크플로)**. 제목을 다음으로 바꿉니다:

   ```
   Daily Brief 8AM
   ```

2. **Start** 노드를 선택하고 **Trigger type (트리거 유형)** 을 **Recurrence (되풀이)**(*Run on a schedule*)로 설정합니다 — Manual과 Connector 사이에 있는 시계 옵션입니다.

3. 되풀이 실행을 **이 순서대로** 구성합니다. 필드들이 서로 의존하기 때문입니다:

   | # | 매개변수 | 값 | 참고 |
   |---|---|---|---|
   | 1 | **Frequency (빈도)** | `Week` | 이것을 **먼저** 설정 |
   | 2 | **Interval (간격)** | `1` | 이미 기본값 |
   | 3 | **On these days (선택한 요일)** | `Mon` `Tue` `Wed` `Thu` `Fri` 체크 | Frequency = Week일 때만 **표시됨** |
   | 4 | **At these hours (이 시간에는)** | `8` | |
   | 5 | **At these minutes (이 분에)** | `0` | |
   | 6 | **Advanced (고급) ▸ Time zone** | `(UTC+09:00) Seoul` | |

   > 📎 **필드가 실제로 어떻게 보이는가.** *On these days* 는 일곱 개의 **체크박스**(Sun–Sat) 행입니다 — `Sun` 이 기본으로 체크되어 있으니 해제하세요. *At these hours* 와 *At these minutes* 는 쉼표로 구분된 **텍스트 상자** 입니다. 흐릿하게 보이는 `9, 17` 과 `0, 30` 은 안내용 힌트일 뿐 값이 아닙니다. **Time zone** 과 **Start time (시작 시간)** 은 **Advanced (고급)** 구분선 아래에 있고, Time zone은 기본값이 *(UTC) Coordinated Universal Time* 입니다.

4. **Save (저장)** 를 선택합니다.
![alt text](./img/image-37.png)

<details>
<summary>💡 <b>개념 — 이것이 "트리거"의 나머지 절반입니다</b></summary>

시나리오 1과 2는 **이벤트 기반** 이었습니다. 무언가 일어났기 때문에 워크플로가 실행되었습니다. 이 시나리오는 **일정 기반** 입니다. 아무 일도 일어나지 않았지만 워크플로는 어쨌든 실행됩니다. 대부분의 팀은 먼저 이벤트 트리거로 손을 뻗었다가, 자신들의 실제 잡무 절반이 시계 위에 있다는 것을 뒤늦게 발견합니다 — 아침 브리핑, 금요일 보고서, 월말 점검, 라이선스 검토.

</details>

> ⏰ **이 시나리오에서 표준 시간대를 두 번, 서로 다른 형식으로 설정하게 됩니다.** 여기서는 표시 이름(`(UTC+09:00) Seoul`)이며 **워크플로가 언제 실행되는지** 를 제어합니다. 다음 노드에서는 IANA 식별자(`Asia/Seoul`)이며 **Copilot에게 "오늘"이 무엇을 의미하는지** 를 제어합니다. 하나는 맞고 다른 하나가 틀리면, 완벽해 보이지만 하루가 어긋난 브리핑이 만들어집니다.

---

## Step 2 — M365 Copilot으로 하루 읽기

1. 트리거 아래에서 **Add a step (단계 추가)** 을 선택하고 **M365 Copilot** 타일을 고릅니다.
2. 노드에 **Not connected** 가 표시되면 **chevron ⌄ ▸ Create new connection ▸ Create** 로 연결을 만듭니다(1.3절). 시나리오 2를 먼저 만들었다면 조용히 바인딩됩니다.
3. **Message** 필드에 다음을 정확히 입력합니다:

```
Prepare my morning brief for today.

1. MEETINGS
List every meeting on my calendar today. For each one give the start time, the
title, and who organised it. Add one short clause saying what it is actually
about, based on the invitation and any related mail or chat.

2. NEEDS A REPLY
List up to five emails from the last two working days that are waiting on me
and have not been answered. For each, give the sender, the subject, and in one
clause what they are actually asking me for.

3. PREPARE
Name up to three things I should read, decide or bring before my first meeting,
and say in a few words why each one matters.

4. QUIET TIME
Identify the longest uninterrupted gap in my calendar today, with its start and
end time.

Rules:
- If a section has nothing in it, write "Nothing today." and move on.
- Never invent a meeting, a sender, a subject or a time. Use only what you find
  in my Microsoft 365 content.
- Return plain text. No tables.
```

4. **Time zone**(**Advanced parameters (고급 매개 변수)** 아래, 이미 표시됨)을 다음으로 설정합니다:

   ```
   Asia/Seoul
   ```

5. 노드 이름을 `Read my day` 로 바꿉니다. **Save (저장)** 를 선택합니다.
![alt text](./img/image-38.png)

<details>
<summary>💡 <b>개념 — 핵심은 그라운딩입니다</b></summary>

어떤 프롬프트 엔지니어링으로도 범용 모델이 여러분의 10:00이 고객 에스컬레이션이라는 것을 알게 만들 수는 없습니다. 이 노드는 **연결된 Microsoft 365 사용자로서** 실행되며 그 사용자의 메일, 파일, 캘린더, 채팅을 읽습니다. 캘린더와 메일 데이터를 얻기 위해 커넥터 액션을 단 하나도 추가할 필요가 없었다는 점에 주목하세요 — 그것이 M365 Copilot 노드와, 같은 것을 개별 Outlook 액션으로 조립하는 것의 차이입니다.

</details>

### 지금 테스트하기

노드의 **Run node (노드 실행)** 탭을 열고 **Run** 을 선택합니다. Recurrence 트리거는 모의로 채울 입력이 없으므로 즉시 실행됩니다. 최대 1분 정도 걸릴 수 있습니다.

출력을 비판적으로 읽으세요:

| 증상 | 해결 |
|---|---|
| 잘못된 날짜를 보고함 | **Time zone** 이 틀렸습니다 — `(UTC+09:00) Seoul` 이나 기본값 `America/New_York` 이 아니라 반드시 `Asia/Seoul` 이어야 합니다 |
| 없는 회의를 반환함 | "never invent" 규칙을 강화하고, 연결 계정이 본인 것인지 확인하세요 |
| 섹션이 누락됨 | Message에서 섹션에 번호를 매기고(이미 되어 있음) 다시 실행하세요 |
| 너무 방대함 | `Keep each section to at most 5 lines.` 를 추가하세요 |
| *"I found no calendar events today…"* | **이것은 버그가 아니라 올바른 동작입니다** — 사서함에 정말로 아무것도 없는 것입니다. 회의가 있는 날로 테스트하거나, 빈 브리핑을 받아들이고 넘어가세요. |

> ✅ **응답의 날짜를 확인하세요.** 올바른 실행은 여러분의 표준 시간대 기준 오늘의 실제 날짜로 시작합니다. 그 한 줄이 전체 그라운딩 사슬이 작동하고 있음을 증명합니다.

---

## Step 3 — 에이전트로 브리핑 형식 다듬기

Copilot의 답변은 정확하지만 그 형태가 날마다 바뀝니다. 매일 아침 08:00에 읽는 브리핑은 *매일 아침 같은 형태* 여야 합니다 — 그렇지 않으면 훑는 대신 읽게 됩니다.

1. Copilot 노드 아래에서 **Add a step (단계 추가)** 을 선택하고 **Agent (에이전트)** 타일을 고릅니다.
2. **Agent (에이전트)** 를 **New agent for this workflow (이 워크플로의 새 에이전트)** 로 둡니다. 노드 이름을 `Format the brief` 로 바꿉니다.
3. **Instructions (안내)** 에 다음을 입력합니다:

```
You turn a raw morning brief into a short Teams message that a busy person
scans in fifteen seconds. Return only the message text.

RAW BRIEF:
⟨insert /Body / Response from Read my day⟩

Produce exactly this layout and nothing else:

TODAY
(one line per meeting: time - title - one clause on what it is about.
Maximum 6 lines. If there are more, keep the 6 that matter most and add a
final line "+N more".)

WAITING ON ME
(one line per email: sender - what they are asking. Maximum 4 lines.)

BEFORE YOUR FIRST MEETING
(up to 3 lines, each a single action starting with a verb.)

QUIET BLOCK
(one line: the start and end time of the longest free gap.)

TOP 3 FOR TODAY
(exactly three lines, most consequential first. Derive these yourself from
everything above - this is your judgement, not a copy of the lists.)

Rules:
- Never add a meeting, a sender, a time or a fact that is not in the raw brief.
- If the raw brief says "Nothing today." for a section, keep the heading and
  write "Nothing today." on one line beneath it.
- No markdown tables, no bold, no headings beyond the five above.
- Total length under 180 words. Shorter is better.
- Write in the same language as the raw brief.
```

4. **Output (출력)** 을 **Text response (텍스트 응답)** 로 둡니다 — 이 노드의 출력은 텍스트 한 덩어리입니다.
5. **도구는 추가하지 않습니다.** **Save (저장)** 를 선택합니다.
![alt text](./img/image-39.png)

> ✅ **나머지를 입력하기 전에 칩을 확인하세요.** 토큰을 삽입하고 나면 `Read my day.Body / Response` 라고 표시된 칩이 보여야 합니다. 삽입되지 않았다면 선택기가 계속 열린 채로 다음에 입력하는 모든 문자를 삼켜 버립니다 — 결국 "RAW BRIEF:"에서 멈춘 지시문과, 아무것도 없는 데서 브리핑을 지어내는 에이전트가 남습니다.

<details>
<summary>💡 <b>개념 — 두 개의 AI 노드, 두 가지 다른 역할, 그리고 순서가 중요합니다</b></summary>

M365 Copilot 노드는 *무엇을 아는가* 때문에 선택되었습니다. 이 에이전트 노드는 *어떻게 동작하는가* 때문에 선택됩니다: 고정된 레이아웃, 길이 제한, 그리고 진정으로 무언가를 더하는 하나의 지시 — **Top 3**, 원본 데이터에 이미 들어 있지 않은 브리핑의 유일한 줄입니다.

여기서 잠시 멈춰 볼 가치가 있습니다. 검색만으로는 더 긴 할 일 목록이 나올 뿐입니다. **우선순위 지정** 이 브리핑을 읽을 가치가 있게 만들며, 그것이 AI 단계에 실제로 결정하라고 요청해야 할 유일한 것입니다.

</details>

### 테스트하기

이 노드의 **Run node (노드 실행)** 탭을 열고 **Run** 을 선택합니다. Step 2의 원본 출력과 나란히 놓고 비교하세요. 같은 사실, 완전히 다른 유용성 — 그 대비가 이 시나리오에서 가장 좋은 교육 순간입니다.

---

## Step 4 — Teams로 전달하기

1. 에이전트 아래에서 **Add a step (단계 추가) ▸ Microsoft Teams ▸ Post message in a chat or channel (채팅 또는 채널에서 메시지 게시)** 를 선택합니다.
2. 다음과 같이 구성합니다:

   | 매개변수 | 값 |
   |---|---|
   | Post as (다음으로 게시) | `Flow bot` (흐름 봇) |
   | Post in (게시 위치) | `Chat with Flow bot` (흐름 봇과 채팅) |
   | Recipient | 본인 이메일 주소 |

3. **Message (메시지)** 에 헤더 줄을 입력하고, Enter를 두 번 누른 다음 토큰을 삽입합니다:

   ```
   Good morning - here is your day.

   ⟨insert /Agent Response from Format the brief⟩
   ```

4. 노드 이름을 `Send the brief` 로 바꾸고 **Save (저장)** 를 선택합니다.
![alt text](./img/image-40.png)

<details>
<summary>💡 <b>왜 이메일이 아니라 Teams인가</b></summary>

브리핑은 그것이 요약하고 있는 받은 편지함과 경쟁합니다. 받은 편지함이 아닌 다른 곳에 두는 것은 기술적 결정이 아니라 설계적 결정입니다.

</details>

---

## Step 5 — 게시하고 테스트를 실행하고 검증하기

1. **Publish (게시)** 를 선택하고 배지가 **Published (게시됨)** 로 바뀔 때까지 기다립니다.
2. 상단 명령 모음에서 **Run** 버튼을 선택합니다.

   > ⏱️ **일정 기반 트리거에서 일어나는 일.** 내일 아침까지 기다리지 않습니다. **Run** 를 누르면 즉시 실행이 시작됩니다 — 확인하는 메뉴나 대화 상자가 없습니다. 이것이 30분짜리 세션에서 일정 기반 워크플로를 시연하는 방법입니다.

3. **Activity (활동)** 탭을 엽니다. 실행이 나타나고 **Succeeded** 로 이동합니다. 처음부터 끝까지 대략 1~1.5분 정도 걸립니다 — Copilot 노드가 느린 부분이고(약 1분), 에이전트는 약 12초, Teams 게시는 약 2초입니다.
4. 실행을 선택해 캔버스에 로드하고 각 노드의 실제 입력과 출력을 살펴봅니다.

### ✅ 검증

| 어디서 | 무엇이 보여야 하는가 |
|---|---|
| **Teams** — 본인의 Flow bot 채팅 | 지정한 정확한 레이아웃으로, 다섯 섹션이 모두 담긴 180단어 미만의 브리핑 |
| **그 내용** | 오늘 실제로 캘린더에 있는 회의들이, 올바른 시간에, 오늘의 실제 날짜와 함께 |
| **TOP 3** | 위 목록의 처음 세 항목이 아니라 *우선순위가 매겨진* 세 항목 |
| **Activity (활동)** 패널 | **Succeeded** 실행 — **Read my day** 와 **Format the brief** 를 열어 두 출력을 비교 |

![alt text](./img/image-42.png)
![alt text](./img/image-41.png)

### 선택적 확장

| 확장 |
|---|
| **공유 전에 사람의 관문을 추가하기.** 에이전트 뒤에 **Human review (인적 검토)** 노드를 넣어 Yes/No 입력 `ShareWithTeam` 하나와 선택적 Text 입력 `AddNote` 하나를 두고, 이어서 If/Else로 여러분이 예라고 답할 때만 브리핑을 팀에 이메일로 보냅니다. 개인 브리핑을, 통제를 잃지 않으면서 팀 스탠드업 노트로 바꿔 줍니다. |
| **모든 브리핑을 보관하기.** **Excel Online (Business) ▸ Add a row into a table (테이블에 행 추가)** 를 추가해 날짜와 브리핑 텍스트를 기록합니다. 석 달 뒤면 매일 무엇이 중요했는지 검색 가능한 기록이 생깁니다. |
| **외부 맥락 추가하기.** 두 번째 M365 Copilot 노드를 추가해 오늘 만나는 고객에 대한 최근 뉴스를 요청하고, 그 **Body / Response** 를 브리핑에 덧붙입니다. |
| **하루 마감 버전.** 워크플로를 복제하고 일정을 17:30으로 바꾼 뒤, Message를 무엇이 진행되었고 무엇이 밀렸으며 무엇을 내일로 넘길지 묻도록 다시 작성합니다. |

---

# 시나리오 4 — Friday Project Roll-up

**핵심 노드: Recurrence 트리거 · Excel Online (Business) · Agent (custom structured output) · Human review · If/Else · Outlook · Teams · Excel**

### 이 시나리오가 해결하는 문제

프로젝트 추적표는 이미 최신 상태입니다. 매주 금요일 45분이 걸리는 일은 *번역* 입니다. 열두 개 행을 읽고, 그중 실제로 중요한 둘을 가려내고, 디렉터가 20초 만에 읽을 세 단락을 쓰는 일 말입니다. 그런 다음 같은 내용을 팀 채널용으로 다시 씁니다.

이 워크플로는 추적표를 읽고, 그 번역을 수행하며, 리더십 근처로 가기 전에 사람에게 승인을 요청합니다. 이 팩에서 가장 완성도 높은 패턴입니다 — 결정적 데이터가 들어오고, 중간에 AI의 판단이 있으며, 커밋 전에 사람이 통과 지점을 지키고, 구조화된 배포가 나갑니다.

### 무엇을 만드는가

![시나리오 4 완성본: 예약 트리거, Excel 읽기, 에이전트, 사람 통과 지점, 그리고 승인된 분기에서의 세 갈래 병렬 출력.](./img/04-canvas-zoomed.png)
*시나리오 4 완성본: 예약 트리거, Excel 읽기, 에이전트, 사람 통과 지점, 그리고 승인된 분기에서의 세 갈래 병렬 출력.*


```
[Trigger]  Recurrence — every Friday at 16:00, (UTC+09:00) Seoul
    ▼
[Excel]    List rows present in a table  →  ProjectTracker      → token: Value
    ▼
[Agent]    "Status Analyst"  (new inline agent, no tools)
    │      Output: Custom structured output
    │      → headline · exec_summary · at_risk_count · at_risk_detail
    │        · help_needed · stale_projects
    ▼
[Human review]  team lead approves or holds — the run sits at Waiting
    │           inputs: Decision · LeadNote · ReportDate · ApproverEmail
    ▼
[If/Else]  Decision  Equals  Approve
    ├── If ───▶ [Outlook] Send an email  →  leadership
    │           [Teams]   Post message   →  the team
    │           [Excel]   Add a row      →  ReportArchive
    └── Else ─▶ [Teams]  tell me it was held
```

> ✅ **사전 준비.** 섹션 1.4가 완료되어 있어야 합니다: OneDrive에 `Workflows-Lab.xlsx` 가 있고, `ProjectTracker` table에 여섯 개의 샘플 행이 채워져 있으며, 비어 있는 `ReportArchive` table이 있어야 합니다. 파일은 반드시 **닫혀** 있어야 합니다.

---

## Step 1 — 워크플로와 금요일 일정 만들기

1. **Workflows (워크플로) ▸ New workflow (새 워크플로)**. 제목을 다음으로 바꿉니다:

   ```
   Friday Project Roll-up
   ```

2. **Start** 노드를 선택하고, **Trigger type (트리거 유형)** 을 **Recurrence (되풀이)** 로 설정한 뒤, 다음 순서로 구성합니다:

   | # | Parameter | Value |
   |---|---|---|
   | 1 | **Frequency (빈도)** | `Week` |
   | 2 | **Interval (간격)** | `1` |
   | 3 | **On these days (선택한 요일)** | `Fri` 만 체크 |
   | 4 | **At these hours (이 시간에는)** | `16` |
   | 5 | **At these minutes (이 분에)** | `0` |
   | 6 | **Advanced (고급) ▸ Time zone** | `(UTC+09:00) Seoul` |

3. **Save (저장)** 를 선택합니다.
![alt text](./img/image-43.png)

---

## Step 2 — Excel에서 추적표 읽기

1. 트리거 아래에서 **Add a step (단계 추가)** 를 선택하고,  검색한 뒤, **Excel Online (Business)** 아래에서  `List rows present in a table` 을 선택합니다.
![alt text](./img/image-44.png)
2. 안내가 나오면 연결을 만듭니다.
3. 구성합니다 — 각 필드가 다음 필드를 로드합니다:

   | Parameter | Value |
   |---|---|
   | Location | `OneDrive for Business` |
   | Document library | `OneDrive` |
   | File | **Change (변경)** 를 클릭한 뒤, 트리에서 `Workflows-Lab.xlsx` 를 선택 |
   | Table | `ProjectTracker` |

4. 노드 이름을 `List project rows` 로 바꿉니다. **Save (저장)** 를 선택합니다.
![alt text](./img/image-45.png)
5. 노드의 **Run node (노드 실행)** 탭을 열고 **Run** 을 선택합니다. 여섯 개의 프로젝트 객체가 돌아와야 합니다.

> ⚠️ **이 테스트는 꼭 실행하세요.** 10초면 되고, 이것이 다음 노드의 테스트를 의미 있게 만듭니다 — 그래야 에이전트 테스트가 아무것도 없는 상태로 돌아가는 대신 실제 행을 재사용할 수 있습니다.

<details>
<summary>💡 <b>개념 — 이 단계는 완전히 결정적이며 그것은 의도된 것입니다</b></summary>

행을 읽는 것은 판단이 아니라 규칙입니다. 커넥터로 하세요: 더 빠르고, 무료이며, 항상 정확히 같은 것을 돌려줍니다. AI는 판단이 실제로 자리 잡은 다음 노드를 위해 아껴 두세요.

</details>

> 📐 **List rows present in a table (테이블에 있는 행 나열)** 은 기본적으로 제한된 한 페이지 분량의 행을 반환합니다; 그 이상은 페이지네이션을 켜야 합니다. 오늘은 여섯 개 샘플 행이면 충분하지만, 실제 포트폴리오 추적표는 이 한계에 부딪힙니다 — 그리고 조용히 잘려 나간 목록을 두고 추론하는 에이전트는 확신에 찬, 틀린 보고서를 만들어 냅니다.

---

## Step 3 — 에이전트로 포트폴리오 분석하기

### 3a — 노드를 추가하고 지시문 작성하기

1. Excel 노드 아래에서 **Add a step (단계 추가)** 를 선택하고 **Agent (에이전트)** 타일을 고릅니다.
2. **Agent (에이전트)** 를 **New agent for this workflow (이 워크플로의 새 에이전트)** 로 둡니다. 노드 이름을 `Status Analyst` 로 바꿉니다.
3. **Instructions (안내)** 에 다음을 입력합니다. 토큰 표시가 있는 곳에서는 `/` 를 입력하고, `Value` 로 필터링한 뒤, **List project rows** 의 **Value (값)** 를 선택합니다 — 이렇게 하면 전체 행 집합을 한 번에 에이전트에 넘깁니다.

```
You are the delivery lead's reporting assistant for an enterprise IT team.
You write the weekly project status roll-up.

Here is the current project tracker, one object per project:
⟨insert /Value from List project rows⟩

Each project has: Project, Owner, Status, PercentComplete, Risk, LastUpdate.

Produce the roll-up using these rules.

headline
One sentence, maximum 18 words, that a director can read and immediately know
whether this week was fine or not. Lead with the exception, never the average.
"Two of six projects are blocked on access approvals" - not "progress continues".

exec_summary
Three to five short lines as a single string, each line starting with "- ".
Line 1: overall portfolio progress with a number.
Then one line for every project whose Status is "Blocked" or "At risk", naming
the project and its owner. Give numbers, not adjectives.

at_risk_count
The number of projects whose Status is "At risk" or "Blocked".

at_risk_detail
For each "At risk" or "Blocked" project: the project name, the owner, the
percent complete, and the single most likely reason it is stuck given its
Status, Risk and PercentComplete. Anything you infer must end with "(inferred)".

help_needed
One sentence naming the single decision, approval or resource that would unblock
the most work across the portfolio. If nothing is blocked, write
"No escalation needed."

stale_projects
The names of any projects whose LastUpdate is more than 5 days before today,
or "None" if there are none. A tracker row nobody has touched is itself a risk.

Use only the data above. Never invent a project, an owner, a date or a number.
Never soften a status: if a project is Blocked, the roll-up says Blocked.
```
![alt text](./img/image-46.png)
> 📤 **행들은 `Value` 라는 하나의 토큰**(배열)으로 도착하며, **List project rows** 그룹 아래에 있습니다. 이 시점에는 소문자 `/value` 도, 열별 토큰도 없습니다 — 에이전트가 전체 컬렉션을 받아서 스스로 열을 읽습니다.

### 3b — 출력 형태 잡기

1. 패널 **맨 아래** 로 스크롤해 **Output (출력)** 을 열고 **Custom structured output (사용자 지정 구조적 출력)** 을 선택합니다.
2. 이 스키마를 **JSON Schema** 상자에 붙여 넣습니다:

   ```json
   {
   "type": "object",
   "properties": {
      "headline":       { "type": "string",  "description": "One sentence, maximum 18 words, leading with the exception" },
      "exec_summary":   { "type": "string",  "description": "3 to 5 lines, each starting with '- '" },
      "at_risk_count":  { "type": "integer", "description": "Count of projects that are At risk or Blocked" },
      "at_risk_detail": { "type": "string",  "description": "Project, owner, percent complete and likely reason for each at-risk project" },
      "help_needed":    { "type": "string",  "description": "One sentence naming the single most valuable unblock" },
      "stale_projects": { "type": "string",  "description": "Names of rows not updated in over 5 days, or 'None'" }
   },
   "required": ["headline", "exec_summary", "at_risk_count", "at_risk_detail", "help_needed", "stale_projects"]
   }
   ```
   ![alt text](./img/image-47.png)

3. **Tools (도구)** 는 비워 둡니다 — 이 에이전트가 필요로 하는 모든 사실은 지시문으로 이미 넘겨받았습니다.
4. **Save (저장)** 를 선택합니다.

### 3c — 테스트하기

**Run node (노드 실행)** 탭을 열고 **Run** 을 선택합니다.

여섯 개의 샘플 행에 대해 다음과 같은 결과가 나와야 합니다:

- `at_risk_count` = **3** — *Intune device compliance baseline* (At risk), *Entra ID Conditional Access refresh* (Blocked), *Purview DLP policy tuning* (At risk)
- `headline` 은 문제없는 프로젝트가 아니라 블록되었거나 리스크 있는 작업으로 시작
- `stale_projects` 는 **Entra ID Conditional Access refresh** 를 지목 — 샘플 데이터에서 가장 오래된 `LastUpdate`
- 모든 추론은 `(inferred)` 로 끝남

> 🧪 **`at_risk_count = 0` 이 나오고 추적표가 비어 있다는 headline이 나온다면**, 노드가 상위
> 데이터 없이 실행된 것입니다 — 돌아가서 **List project rows** 노드 테스트를 먼저 실행한 뒤, 이 노드를
> 다시 실행하세요. 이때 에이전트가 *프로젝트를 지어내기를 올바르게 거부했다* 는 점에 주목하세요. 여러분의 "never invent" 규칙이 작동하고 있는 것입니다.

<details>
<summary>💡 <b>개념 — 에이전트에 감탄하는 게 아니라 채점하는 것입니다</b></summary>

이 데이터셋에 대한 정답을 스스로 알고 있으므로, 지시문이 잘 작동하는지 즉시 판별할 수 있습니다. 프롬프트를 쓰기 *전에* 작고 정답이 알려진 테스트 세트를 만들어 두는 것이 AI 자동화에서 가장 유용한 습관 하나입니다.

</details>

---

## Step 4 — 팀 리드에게 승인 요청 보내기

1. 에이전트 아래에서 **Add a step (단계 추가)** 를 선택하고 **Human review (인적 검토)** 타일을 고릅니다. 이름을 `Team lead approval` 로 바꿉니다.
2. 필드를 채웁니다:

   | Field | 입력할 내용 |
   |---|---|
   | **Title** | `Approve the weekly project roll-up` |
   | **Message** | 아래 블록 — 표시된 곳에 토큰을 삽입 |
   | **Assigned to (first to respond)** | 여러분 본인의 이메일 주소(실제 버전에서는 팀 리드의 주소) |
   | **Channel** | `Outlook` 로 둠 |

   **Message:**

   ```
   The weekly project roll-up is ready for your approval.

   HEADLINE
   ⟨insert /Headline⟩

   SUMMARY
   ⟨insert /Exec_summary⟩

   AT RISK - ⟨insert /At_risk_count⟩ project(s)
   ⟨insert /At_risk_detail⟩

   BIGGEST UNBLOCK
   ⟨insert /Help_needed⟩

   NOT UPDATED RECENTLY
   ⟨insert /Stale_projects⟩

   Approve to send this to leadership and post it to the team channel.
   Hold to stop it here - nothing is sent.
   ```
   ![alt text](./img/image-48.png)
   > 🔤 **대문자로 시작하는 토큰 이름으로 필터링하세요** — `Headline`, `Exec_summary`, `At_risk_count`, `At_risk_detail`, `Help_needed`, `Stale_projects`. `At_risk_count` 와 `At_risk_detail` 은 접두어를 공유하므로, 충분한 글자(`At_risk_c` / `At_risk_d`)를 입력해 구분하고, 각 칩을 확인하세요.

3. 네 개의 입력을 추가합니다. 행마다 한 번씩 **Add an input (입력 추가)** 을 선택하되, **매번 미리 채워진 라벨을 지웁니다**:

   | # | Type | Name (공백 없이) | Configuration |
   |---|---|---|---|
   | 1 | **Text** | `Decision` | **⋯ ▸ Add dropdown**. **Option 1** 상자에서 `First option` 을 지우고 `Approve` 를 입력. **Add new option** 에 `Hold` 를 입력. |
   | 2 | **Text** | `LeadNote` | **⋯ ▸ Make optional** |
   | 3 | **Date** | `ReportDate` | — |
   | 4 | **Email** | `ApproverEmail` | — |
   
   ![alt text](./img/image-49.png)
4. **Save (저장)** 를 선택합니다.

<details>
<summary>💡 <b>개념 — 방금 지원되는 다섯 가지 입력 유형 중 4개를 사용했습니다</b></summary>

Human review는 **Text**, **Yes/No**, **Email**, **Number**, **Date** 를 지원하며, 텍스트 입력은 단일 선택 또는 다중 선택 드롭다운이 될 수 있습니다. 검토 통과 지점은 버튼이 아니라 *양식(form)* 입니다 — 즉 사람이 단순히 허용하거나 막는 데 그치지 않고, 워크플로가 이후에 사용할 구조화된 데이터를 제공할 수 있다는 뜻입니다.

</details>

---

## Step 5 — 분기, 배포, 보관

### 5a — 조건

1. review 노드 아래에서 **Add a step (단계 추가) ▸ If/Else**:

   | 항목 | 값 |
   |---|---|
   | **Property (속성)** | **Team lead approval** 의 `Decision` |
   | **Operator (운영자)** | `Equals` |
   | **Value (값)** | `Approve` |

2. 이름을 `Approved?` 로 바꿉니다.
![alt text](./img/image-50.png)

### 5b — If 분기: 리더십에 이메일 보내기

1. **Add a step (단계 추가)** 에서 `Send an email` 을 검색하고, **Office 365 Outlook** 제목 아래에 있는 것을 고릅니다.

   > ⚠️ **여기서 두 액션이 똑같아 보입니다.** 검색 결과에는 **Mail** 커넥터의 **"Send an email notification"** 도 함께 나옵니다. 이것을 고르면 별도의 *Connect to Mail* 연결이 필요하고, 여러분의 Outlook 신원을 사용하지 않습니다. 클릭하기 전에 그룹 제목을 확인하세요.

2. 다음과 같이 구성합니다:

   | Parameter | 값 |
   |---|---|
   | To | 자신의 주소(실제 버전에서는 관리자의 주소) |
   | Subject | `Weekly project roll-up - ` 다음에 `/Headline` 삽입 |
   | Body | 아래 블록 |

   ```
   ⟨insert /LeadNote⟩

   ⟨insert /Exec_summary⟩

   AT RISK - ⟨insert /At_risk_count⟩ project(s)
   ⟨insert /At_risk_detail⟩

   BIGGEST UNBLOCK
   ⟨insert /Help_needed⟩

   Questions to ⟨insert /ApproverEmail⟩.
   Report date: ⟨insert /ReportDate⟩
   ```

3. 이름을 `Email leadership` 로 바꿉니다.
![alt text](./img/image-51.png)

### 5c — If 분기: 팀에 게시하기

1. **Add a step (단계 추가) ▸ Microsoft Teams ▸ Post message in a chat or channel (채팅 또는 채널에서 메시지 게시)**:

   | Parameter | 값 |
   |---|---|
   | Post as (다음으로 게시) | `Flow bot` (흐름 봇) |
   | Post in (게시 위치) | `Chat with Flow bot` (흐름 봇과 채팅) *(또는 `Channel` (채널) ▸ `Workflow Lab` ▸ `Alerts`)* |
   | Recipient | 자신의 이메일 주소 |

2. **Message (메시지)** 에는:

   ```
   Weekly roll-up

   ⟨insert /Headline⟩

   ⟨insert /Exec_summary⟩

   Needs a decision: ⟨insert /Help_needed⟩
   ```

3. 이름을 `Post to the team` 으로 바꿉니다.
![alt text](./img/image-52.png)

### 5d — If 분기: 보고서 보관하기

1. **Add a step (단계 추가) ▸ Excel Online (Business) ▸ Add a row into a table (테이블에 행 추가)**:

   | Parameter | 값 |
   |---|---|
   | Location | `OneDrive for Business` |
   | Document library | `OneDrive` — 목록의 첫 번째가 **아니라는** 점에 유의하세요. 보통 `PersonalCacheLibrary` 가 첫 번째입니다 |
   | File | **Change (변경)** 를 클릭한 뒤 `Workflows-Lab.xlsx` 선택 |
   | Table | `ReportArchive` |
   | GeneratedAt | `ReportDate` *(Team lead approval에서)* |
   | Headline | `Headline` *(Status Analyst에서)* |
   | AtRiskCount | `At_risk_count` *(Status Analyst에서)* |
   | ApprovedBy | `ApproverEmail` *(Team lead approval에서)* |

2. 이름을 `Archive the roll-up` 으로 바꿉니다.
![alt text](./img/image-53.png)

### 5e — Else 분기

1. **Add a step (단계 추가) ▸ Microsoft Teams ▸ Post a message to myself (자신에게 메시지 게시)** 로 자신에게 게시하며, 메시지는:

   ```
   Weekly roll-up held by the team lead. Nothing was sent.
   ```

2. 이름을 `Tell me it was held` 로 바꿉니다. **Save (저장)** 를 선택합니다.
![alt text](./img/image-54.png)

<details>
<summary>💡 <b>어떤 노드가 어느 분기에 있는지 확인하세요</b></summary>

이메일, Teams 게시물, *그리고* 보관 행 모두가 승인 뒤에 놓입니다. 애초에 보내지지도 않은 보고서에 대한 보관 항목은 아예 보관이 없는 것보다 더 나쁩니다 — 감사 추적은 초안이 아니라 실제로 일어난 일을 기록해야 합니다.

</details>

---

## Step 6 — 게시, 테스트 실행, 검증

1. **Review (검토)** 에서 문제를 확인한 뒤 **Publish (게시)** 를 선택합니다.
2. 상단 명령 모음의 **Run** 버튼을 선택합니다. Recurrence 트리거가 즉시 한 번 실행됩니다.
3. **Activity (활동)** 를 지켜봅니다: `List project rows`(~3초) → `Status Analyst`(~20–30초) → 그다음 실행은 `Team lead approval` 에서 **Waiting** 상태로 머뭅니다.
4. **Outlook을 확인합니다.** `Approve the weekly project roll-up` 을 엽니다. Outlook이 양식을 차단했다면 **Show blocked content** 를 클릭한 뒤 채워 넣습니다:
   - `Decision` = `Approve`
   - `LeadNote` = `Two items need a decision from the security board this week.`
   - `ReportDate` = 오늘(달력 선택기 사용)
   - `ApproverEmail` = 자신의 주소
   - **Submit** 을 선택합니다.
5. 워크플로는 1분 이내에 다시 진행됩니다. Activity의 소요 시간에는 승인자의 생각 시간이 포함됩니다 — 20분을 기다리면 20분짜리 실행으로 표시됩니다.
6. **한 번 더 실행** 하고 이번에는 `Hold` 을 골라 Else 분기를 확인합니다.
![alt text](./img/image-55.png)
![alt text](./img/image-56.png)
![alt text](./img/image-57.png)
![alt text](./img/image-58.png)
![alt text](./img/image-59.png)
![alt text](./img/image-60.png)

> 📬 **응답할 수 있는 유일한 방법은 이메일로 온 카드입니다.** Human review 요청은 Power Automate Approvals 포털에는 **나타나지 않으므로**, 거기서 찾지 마세요.

### ✅ 검증

| 위치 | 확인해야 할 것 |
|---|---|
| **Outlook** — 승인 메일 | 드롭다운, 선택형 메모 상자, 날짜 선택기, 이메일 필드가 있는 완전한 roll-up |
| **Outlook** — 받은 편지함 | 리더십 이메일, 맨 위의 `LeadNote`, 헤드라인을 담은 제목 줄 |
| **Teams** | 짧은 버전 — 헤드라인, 요약, 필요한 결정 하나 |
| **Excel** — `ReportArchive` | 승인된 실행마다 새 행 하나, 보류된 실행에는 **행 없음** |
| **Activity (활동)** 패널 | 제출할 때까지 **Waiting** 에 머물렀다가 이후 **Succeeded** 로 끝난 실행 |

> 🔎 **실행이 Succeeded라고 나오지만 아무것도 보내지지 않았고 `ReportArchive` 가 비어 있다면**, **Else**
> 분기를 탄 것입니다. 로드된 실행에서 **Team lead approval** 노드를 열고 돌아온 `Decision` 값을 확인하세요.

> 그런 다음 `ProjectTracker` 의 행 하나를 바꿔 봅니다 — *Teams Phone migration* 을 `Blocked` 로 설정 — 그리고 다시 실행합니다. 헤드라인, 개수, 에스컬레이션이 모두 바뀝니다. **워크플로가 아닌 데이터를 바꿨기 때문에, 전달되는 결과도 다릅니다.**

### 선택 확장

| 확장 |
|---|
| **추세 맥락 추가.** Excel 단계 뒤에 **M365 Copilot** 노드를 추가해, 이번 주 퍼센트를 최근 메일·문서와 비교하도록 요청하고, 그 **Body / Response** 를 Status Analyst의 지시문에 추가 맥락으로 넣습니다. |
| **담당자 재촉.** 승인 후, at-risk 프로젝트에 대해 **Loop** 를 돌리고 각 `Owner` 에게 **Office 365 Outlook ▸ Send an email (메일 보내기)** 로 한 줄 업데이트를 요청합니다. roll-up이 보고서에 그치지 않고 프로세스가 됩니다. |
| **개수에 따라 에스컬레이션.** `At_risk_count` 에 대해 연산자 `is greater than`, 값 `2` 인 두 번째 If/Else를 추가하고, 그런 주는 다른 수신자에게 보냅니다. |
| **오래된 행 추적.** `Stale_projects` `Does not equal` `None` 조건의 If/Else를 추가하고 별도의 Teams 알림을 게시합니다. |

---

# 문제 해결

![Activity 패널은 모든 실행을 상태 및 소요 시간과 함께 나열합니다. 실행을 선택하면 실제 입력과 출력이 담긴 채로 캔버스에 로드됩니다.](./img/13-activity-runs.png)
*Activity 패널은 모든 실행을 상태 및 소요 시간과 함께 나열합니다. 실행을 선택하면 실제 입력과 출력이 담긴 채로 캔버스에 로드됩니다.*


도움을 요청하기 전에 이 표를 위에서부터 훑어보세요 — 앞의 여덟 행이 랩에서 발생하는 실패의 열에 아홉 정도를 다룹니다.

| 증상 | 가장 유력한 원인 | 해결 |
|---|---|---|
| **어떤 단계가 "동작"은 했는데 잘못된 데이터를 씀** | 엉뚱한 노드의 토큰을 삽입한 것입니다. Excel의 *Add a row* 단계가 생긴 뒤에는 그 액션이 자신이 만든 행을 반환하기 때문에 선택기에 **이름이 중복된 항목**(`Category`, `Subject`, `Summary`…)이 나타납니다. | 칩을 클릭해 읽어 보세요: **`NodeName.FieldName`** 형태로 표시됩니다. 올바른 그룹에서 다시 삽입하세요. |
| **노드에 "Not connected"라고 표시됨** | 이 환경에 그 커넥터의 연결이 아직 없습니다. 새로 프로비저닝된 랩 환경에서는 Outlook과 Teams를 포함해 **모든** 커넥터에서 처음 사용할 때 이 일이 발생합니다. | 만드세요: **Not connected** ▸ **Create new connection** ▸ **Create** ▸ 계정 선택. 1.3 섹션에 전체 절차가 있습니다. 커넥터당 한 번만 하면 됩니다. |
| **텍스트 상자처럼 보이는데 입력이 안 됨**(Folder, File, Table) | 이들은 텍스트 필드가 아니라 선택기입니다. 상자 자체를 클릭해도 아무 일도 일어나지 않습니다. | 필드 오른쪽의 작은 **Change (변경)** 버튼을 클릭해 선택기를 열고, 항목을 고른 뒤 **Escape** 를 눌러 닫으세요. |
| Location / Document Library / File에 **"Could not load options. You can enter a value manually."** 표시 | 노드에 아직 연결이 없어 OneDrive를 조회할 수 없습니다. 권한 오류가 아닙니다. | 연결을 만드세요(1.3 섹션). 메시지가 사라지고 드롭다운이 채워집니다. |
| **필드에 "Fill in dependent fields first…"라고 표시됨** | Excel의 네 위치 필드는 연쇄됩니다: **Location → Document Library → File → Table**. 각 필드는 바로 위 필드가 설정된 뒤에야 로드됩니다. | 반드시 위에서 아래 순서로 설정하세요. 하나가 비어 있다면 그 위 필드가 실제로는 설정되지 않은 것입니다. |
| **분기가 잘못된 경로로 갔는데 실행은 Succeeded라고 표시됨** | 드롭다운 옵션이나 입력 라벨이 미리 채워진 안내 텍스트를 그대로 유지했습니다. 예: `First optionApprove` 또는 `TextDecision`. 비교가 절대 매칭되지 않아 흐름이 오류 없이 **Else** 로 빠집니다. | 완료된 실행을 열고 If/Else 노드를 선택해 입력을 읽으세요 — 비교가 출력됩니다. 예: `Reject is equal to Approve → False`. 그런 다음 **Build (빌드)** 탭에서 옵션/라벨 상자를 고치고(**Ctrl+A + Delete**, 다시 입력), 게시한 뒤 다시 실행하세요. |
| **마지막 단계에서 *"A message needs to have at least one recipient"* 오류로 실행 실패** | **Reply to email** 의 **To** 가 비어 있습니다. 답장이 자동으로 주소를 채워 주는 것은 신뢰할 수 없으며, 자기 자신에게 메일을 보내 테스트할 때는 절대 채워지지 않습니다. | **To** 를 트리거의 `From` 토큰에 바인딩하고, 게시한 뒤 **새** 테스트 메일을 보내세요(이미 소진된 승인은 재사용할 수 없습니다). |
| **실행이 *"…is required to be of type 'String/email'. The runtime value `"a@b.com\n"`…"* 오류로 실패** | 토큰과 함께 **To** 상자에 줄바꿈 하나가 들어가 저장되었습니다. 토큰 필드는 리치 편집기라, 남아 있던 빈 줄이 값의 일부가 됩니다. | **To** 를 클릭해 **Ctrl+A**, 상자가 완전히 빌 때까지 **Delete** 를 반복한 다음, **Insert dynamic content** 버튼으로 토큰을 다시 삽입하고 다른 것은 입력하지 말고 저장하세요. |
| **성공적인 답장 뒤 약 1분 후에 별도의 실행이 나타남** | 답장이 제목에 `[Ask]` 를 그대로 유지한 채 트리거가 감시하는 받은 편지함으로 다시 도착해, 워크플로가 자신의 출력에 트리거됩니다. | 자기 테스트에서는 예상되는 현상입니다. 남는 **Waiting** 실행을 취소하거나, 트리거에 **From** 필터를 설정해 자신의 주소를 무시하게 하세요. |
| **승인 요청이 도착하지 않는데 오류도 나타나지 않음** | 카드가 전달되었든 아니든 노드는 **Waiting** 에 머무릅니다. 읽을 실패가 없는 것입니다. 체험 테넌트에서는 Outlook 전송이 몇 분씩 지연될 수 있습니다. | 노드의 **Channel** 을 **Teams** 로 바꾸고 다시 게시하세요. Power Automate의 **Approvals** 포털은 확인하지 마세요 — 대기 중인 human-review 요청은 거기에 절대 나타나지 않습니다. |
| **토큰 뒤로 지시문이 잘려 나감** | 토큰 삽입에 실패한 것입니다. 선택기가 열린 채로 남아 그 뒤에 입력한 모든 글자를 삼켰습니다. | 필드를 지우고 다시 만드세요. `/` 를 입력하고 **잠시 멈춘 뒤** 필터링하고 클릭한 다음, **칩이 나타났는지 확인** 하고 계속하세요. |
| **토큰이 `/Frmo` 같은 문자 그대로 나옴** | 필터를 너무 빨리 입력해 글자가 뒤섞여 아무것도 매칭되지 않은 것입니다. | 텍스트를 지우세요. `/` 를 입력하고 *Insert dynamic content* 가 뜰 때까지 기다린 뒤 천천히 입력하세요. |
| **테스트 메일을 보내도 워크플로가 실행되지 않음** | 게시된 적이 없습니다. 워크플로는 게시한 **뒤에야** 트리거를 수신합니다. | **Save (저장)** 하고 **Publish (게시)** 하세요. 그런 다음 *새* 테스트 메일을 보내세요 — 게시 전에 보낸 것은 사라졌습니다. |
| **Publish가 회색으로 비활성화되거나 실패함** | 워크플로에 오류가 있습니다. | 명령 모음의 **Review (검토)** 버튼이 개수를 보여 줍니다. 열어서 하나씩 해결하세요. |
| **Excel 단계의 Table 드롭다운이 비어 있음** | 시트에 헤더는 있지만 **서식이 지정된 Excel Table** 이 없습니다. | 헤더 행을 선택 ▸ **Insert ▸ Table** ▸ *My table has headers* 체크, 그런 다음 **Table Design** 에서 **Table Name** 을 설정하세요. 브라우저에서 파일도 닫으세요. |
| **Folder나 File을 선택할 수 없음** | 둘 다 드롭다운이 아니라 **트리** 선택기입니다. | 항목을 **더블클릭** 하세요. 한 번 클릭은 강조 표시만 합니다. |
| **Subject 필터를 찾을 수 없음** | 숨겨진 고급 매개변수 중 하나입니다. | **Advanced parameters (고급 매개 변수)**(*Showing 4 of 9*) 아래에서 **Show all (모두 보기)** 을 클릭하세요. |
| **agent 노드에서 Output / JSON schema를 찾을 수 없음** | 패널 **맨 아래** 에 있습니다. | Tools, Knowledge, Request human assistance, Web search를 지나 스크롤하세요. |
| **노드의 ⋯ 메뉴에 Rename이 없음** | Rename은 그 메뉴에 없습니다(Settings와 Code view만 있습니다). | **구성 패널 헤더의 노드 제목을 더블클릭** 해 덮어쓰세요. |
| **"Condition" 노드를 찾을 수 없음** | 이름이 **If/Else** 입니다. | `If/Else` 를 검색하거나 **Add (추가)** 대화 상자에서 타일을 직접 고르세요. |
| **분기 뒤에 단계를 놓을 수 없음** | **If/Else** 는 다시 합쳐지지 않습니다 — 각 분기는 그냥 끝납니다. | 공통 단계는 분기 **앞** 에 두거나, 양쪽에 복제하세요. |
| **Excel 노드에 "Not connected"라고 표시됨** | Excel Online (Business)과 M365 Copilot은 자동으로 바인딩되지 않습니다. | Connection 필드의 **꺾쇠 ⌄** 클릭 ▸ **Create new connection** ▸ **Create** ▸ 팝업에서 계정 선택. 패널 본문의 안내 텍스트를 클릭해도 아무 일도 일어나지 않습니다. |
| **실행은 성공했는데 Excel 행이 없음** | 쓰기 지연이거나, 2행을 보고 있는 것입니다. | 약 30초 뒤 통합 문서를 새로 고치세요. 처음 쓰인 행은 **3행** 에 들어간다는 점을 기억하세요 — 2행은 Table의 빈 시작 행입니다. |
| **승인 메일이 도착하지 않음** | 외부 주소에 지정되었거나 정크함에 있습니다. | Human review 요청은 **테넌트 외부로 보낼 수 없습니다**. 내부 주소를 쓰고 정크함을 확인하세요. |
| **승인 메일은 왔는데 양식이 없음** | Outlook이 활성 콘텐츠를 차단했습니다. | 메시지 배너에서 **Show blocked content** 를 클릭하세요. |
| **Power Automate에서 내 승인을 찾을 수 없음** | Human review는 Approvals 포털을 사용하지 않습니다. | 메일로 온 카드에서 응답하세요. 그것이 유일한 경로입니다. |
| **여러 사람을 지정했는데 한 명의 답만 사용됨** | 의도된 동작입니다 — 필드 이름이 문자 그대로 *Assigned to (first to respond)* 입니다. | 한 사람에게 지정하거나, 먼저 응답한 사람이 이긴다는 규칙을 받아들이세요. |
| **M365 Copilot이 잘못된 날짜를 반환함** | **Time zone** 이 여전히 기본값 `America/New_York` 입니다. | **노드** 에서 `Asia/Seoul`(IANA 형식)로 설정하세요. *Recurrence 트리거* 는 다른 형식인 `(UTC+09:00) Seoul` 을 쓴다는 점을 기억하세요. |
| **M365 Copilot이 "I could not find…"를 반환함** | 그 메일함에 그 주제에 대한 내용이 정말로 없는 것입니다. | 버그가 아니라 올바른 동작입니다. 메일에 실제로 존재하는 주제로 테스트하세요. |
| **에이전트가 프로젝트, 회의, 사람을 지어냄** | 실제 데이터가 전달되지 않았거나 "지어내지 말라"는 규칙이 빠졌습니다. | `/` 토큰이 실제로 칩인지 확인하세요 — 텍스트로 *입력된* 토큰은 그냥 텍스트입니다. 그런 다음 `Use only the data above. Never invent…` 규칙을 명시적으로 추가하세요. |
| **워크플로 이름이 저장되지 않음** | 숫자로 시작합니다. | 워크플로 이름은 **반드시 문자로 시작** 해야 합니다. |
| **내 토큰이 선택기에 없음** | 상위 노드가 저장되지 않았거나, 데이터가 도달하지 않는 분기에 있습니다. | 상위 노드를 **Save (저장)** 하고 선택기를 다시 여세요. |
| **모든 노드 필드가 회색으로 비활성화됨** | 캔버스에 과거 실행이 로드되어 있습니다 — 그 뷰는 읽기 전용입니다. | **Build (빌드)** 탭으로 돌아가세요. |
| **새로 고쳤더니 캔버스가 비어 있음** | 디자이너는 다른 곳으로 이동하기 전까지 URL `.../flows/new` 를 유지합니다. 그것을 새로 고치면 빈 워크플로가 새로 열립니다. | 작업은 저장되어 있습니다. **Workflows (워크플로)** 목록에서 다시 여세요. |
| **예약된 워크플로가 요청 시 실행되지 않음** | 시계를 기다리고 있는 것입니다. | 상단 명령 모음에서 **Run** 를 누르세요. Recurrence 트리거는 즉시 한 번 실행됩니다. |
| **Activity에 아무것도 나타나지 않음** | 커넥터 트리거는 폴링합니다. | 1~2분 기다렸다가 새로 고치세요. Outlook 트리거는 보통 빨리 발동하지만, 커넥터 문서는 드물게 최악의 경우 최대 한 시간까지 걸린다고 명시합니다. |

---

### 참가자가 막히는 지점, 가능성이 높은 순서대로

| # | 막히는 지점 | 이렇게 미리 말해 두세요 |
|---|---|---|
| 1 | 토큰을 삽입하지 않고 `/Subject` 를 텍스트로 입력 | "슬래시를 입력하고, **기다린 다음**, 목록에서 고르세요. 색이 있는 칩이 아니면 토큰이 아닙니다." |
| 2 | 미리 채워진 라벨과 옵션 상자에 덧입력 | "그 상자들에는 이미 텍스트가 들어 있습니다. Ctrl+A, Delete, *그런 다음* 입력하세요 — 안 그러면 드롭다운이 조용히 망가집니다." |
| 3 | Excel 노드 뒤에 중복된 토큰을 선택 | "칩을 읽으세요. 어느 노드에서 왔는지 적혀 있습니다." |
| 4 | Folder와 File 선택기에서 더블클릭이 필요함 | 설정 중에 한 번 시연하세요. |
| 5 | Excel Table 서식이 지정되지 않음 | 설정 중에 서식이 지정된 Table과 지정되지 않은 것을 나란히 보여 주세요. |
| 6 | 테스트 전에 게시를 잊음 | "Publish는 배포가 아닙니다. 트리거가 수신을 시작하게 만드는 것입니다." |
| 7 | If/Else 뒤에 단계를 찾음 | "분기는 다시 합쳐지지 않습니다. 공통 단계는 분기 위로 갑니다." |
| 8 | 트리거 폴링을 참지 못함 | "폴링합니다. 2분 주세요. 고장 난 것이 아닙니다." |

### 예약이 실제로 발동했는지 검증하기

Recurrence 트리거는 테스트로 증명할 수 없습니다 — 수동 **Run** 은 예약을 완전히 무시하며, 빈도·요일·시각·표준 시간대에 대해 아무것도 알려 주지 않습니다. 이것들은 다음 실제 발생 시점에만 드러나며, 그때는 대개 모두가 퇴근한 뒤입니다.

랩 테넌트를 소유하고 있다면 다음 근무일에 실행 기록을 확인하세요. **Activity ▸ 실행 목록** 은 예약된 실행의 실제 시작 시각을 보여 줍니다:

| 확인 항목 | 올바른 모습 |
|---|---|
| 시작 시각 | 시나리오 3은 정확히 `08:00`, 시나리오 4는 `16:00` — UTC가 아니라 **여러분의** 로컬 표준 시간대 기준 |
| 나타나는 요일 | 시나리오 3은 월~금, 시나리오 4는 금요일만 |
| 나타나지 않는 요일 | **토요일이나 일요일 실행 없음** |

마지막 행이 확인할 가치가 있는 항목입니다. 반복 편집기에서 **일요일이 기본으로 체크되어 있어서**, 미처 알아채지 못한 일요일 체크는 한 주 내내 완벽하게 동작하다가 주말에 한 번 발동하는 워크플로를 만들어 냅니다. 기록에 남은 주말 실행이 유일한 증상입니다.

### 세션 이후 정리

랩 환경이 공유되거나 오래 유지되는 것이라면, 참가자가 떠나기 전에 이렇게 하도록 하세요:

1. 각 워크플로를 열어 **끄거나** 삭제하세요 — 그러지 않으면 메일 트리거형은 실제 메일에 계속 발동하고, 예약형은 매일 아침 계속 실행됩니다.
2. 테스트 메일과 승인 요청을 삭제하세요.
3. `Workflows-Lab.xlsx` 는 보관하세요 — 나중에 이 중 무엇이든 다시 만드는 가장 빠른 방법입니다.

### 비용과 용량 — 사람들이 꼭 묻는 그 슬라이드

- 워크플로는 **실행하는 액션마다 Copilot Studio capacity** 를 소비하며, 이 harness의 기능은 **사용량 기반 Copilot Credits** 로 과금됩니다.
- 환경의 선불 용량이 완전히 소진되면, 용량이 확보될 때까지 **새 flow 실행이 차단됩니다**. 이미 진행 중인 실행은 정상적으로 완료됩니다.
- 관리자는 **Power Platform 관리 센터 ▸ Licensing ▸ Copilot Studio** 에서 agent flow 소비량을 검토할 수 있습니다.

---

# 부록 A — 이 환경의 노드 레퍼런스

### Add 팔레트

왼쪽 레일과 **Add (추가)** 대화 상자는 다음을 노출합니다: **Agent · Classify · M365 Copilot · Human review · Connector · Function · Variable · If/Else · Loop · Note**. **Add (추가)** 대화 상자는 추가로 **Switch · Scope · End · Respond to the agent** 를 제공하며, 검색을 통해 모든 커넥터 액션도 제공합니다.

### AI 기능 노드

| 노드 | 사용할 때 | 주요 설정 |
|---|---|---|
| **Agent (에이전트)**(inline) | 단계에 판단, 다단계 추론, 또는 워크플로와 함께 이동하는 통제된 출력 형태가 필요할 때 | **Agent (에이전트)**: `New agent for this workflow` · **Instructions (안내)**(실행별 프롬프트 역할 겸함) · Instructions 헤더 *안* 의 모델 드롭다운 · **Tools (도구)** · **Knowledge (지식)** · **Request human assistance (사람의 도움 요청)** · **Web search (웹 검색)** · **Output (출력)** *(맨 아래)*: Text response / Structured output / Custom structured output |
| **Agent (에이전트)**(기존) | 같은 에이전트를 여러 워크플로가 공유하거나 다른 팀이 소유할 때 | **Agent (에이전트)**: 게시된 에이전트 선택 · 실행별 프롬프트용 **Message** 필드 |
| **M365 Copilot** | 단계에 실행 중인 사용자 본인의 Microsoft 365 맥락 — 메일, 파일, 캘린더, 채팅 — 이 필요할 때 | **M365 agent** *(선택 — 대화할 특정 Copilot 에이전트)* · **Message** · **Advanced parameters (고급 매개 변수) ▸ Time zone** *(IANA, 기본값 `America/New_York`)* · **Prefer async** |
| **Classify (분류)** | 단순 라우팅만 — 텍스트 한 조각을 여러분이 정의한 범주로 분류 | 분류할 텍스트 · 여러분의 범주 목록 |

**출력 토큰 한눈에 보기**

| 노드 | 출력 설정 | 다운스트림에서 사용하는 토큰 |
|---|---|---|
| Agent | Text response | `Agent Response` |
| Agent | Custom structured output | 스키마 필드마다 하나씩, **첫 글자 대문자**: `Category`, `Owner_team`, `At_risk_count`… |
| M365 Copilot | — | `Body / Response` *(그 외 Body, Body / Conversation ID, Body / Citations, See More URL, Type)* |
| Excel · List rows | — | `Value` *(행 객체의 배열)* |
| Human review | — | 정의한 입력마다 하나씩: `Decision`, `ChangeRequest`, `ReportDate`… |

> **두 AI 노드 중 선택하기:** M365 Copilot node는 **Microsoft 365가 이미 아는 것을 재활용** 합니다 — 그라운딩이 내장되어 있고 연결된 사용자로 실행됩니다. agent node는 **자동화에 특화된 동작을 구성** 합니다 — 지시문과 출력 형태를 노드 안에서 설정합니다. 시나리오 2와 3은 둘을 순서대로 사용하며, 맥락 *과* 통제가 둘 다 필요할 때 권장되는 패턴입니다.

### Human review

- **필수 필드:** **Title**(보내는 메시지의 제목), **Message**(함께 보내는 안내문), **Assigned to (first to respond)**, **Channel**, 그리고 최소 하나의 **Input (입력)**.
- **Channel:** `Outlook`(기본) 또는 `Teams` — 정확히 두 옵션뿐입니다. Outlook 전송은 **일관성이 없습니다**: 한 경우에는 1분 만에 관측되었고 다른 두 경우에는 아예 전달되지 않았으며, 어디에도 오류가 나타나지 않았습니다. Teams는 관측된 모든 경우에 안정적으로 전달했습니다. 시간이 정해진 세션에서는 **Teams** 를 쓰세요.
- **지속성:** 대기 중인 요청은 발생 후 **71시간** 뒤에도 처리 가능했습니다. 즉 요청은 주말 동안 만료되지 않습니다. 그 대가로 실행은 그동안 내내 **Running** 에 머무릅니다.
- **입력 유형:** Text, Yes/No, Email, Number, Date. Text 입력은 추가로 **Add dropdown** 과 **Add multi-select** 를 지원합니다.
- **입력별 옵션**(**⋯** 메뉴): **Make optional · Add multi-select · Add dropdown · Delete**.
- **모든 입력은 사람이 답한 값을 담은 동적 콘텐츠 토큰이 됩니다.**
- **제약:** **먼저 응답한 사람이 이깁니다**. 요청은 **테넌트 외부 사용자에게 보낼 수 없습니다**. 입력 이름에는 공백이 들어가면 안 됩니다. 응답은 전달된 카드를 통해 돌아오며, Power Automate Approvals 포털을 **통하지 않습니다** — 요청이 실제로 열려 있는 동안에도 그 페이지는 *"You don't have any pending approvals"* 라고 표시합니다.
- **미리 채워진 상자:** 입력 라벨은 `Text` / `Date` / `Email` 로, 첫 드롭다운 옵션은 `First option` 으로 들어옵니다. 입력하기 전에 지우세요.

### 이 팩에서 사용하는 제어 노드

| 노드 | 사용 위치 | 참고 |
|---|---|---|
| **If/Else** | 시나리오 1, 2, 4 | 조건 행은 **Property / Operator / Value** 이며 AND/OR 그룹 선택기가 있습니다. 같음 연산자는 **Equals (다음 값과 같음)** 입니다. 분기 이름은 **If** 와 **Else** 이며, **Else** 는 자동으로 생성됩니다. **분기는 다시 합쳐지지 않습니다.** |
| **Loop** | 시나리오 4 확장 | Excel의 `Value` 컬렉션 같은 배열을 반복 |

### 이 팩에서 사용하는 커넥터

| 커넥터 | 사용하는 액션 | 연결 동작 |
|---|---|---|
| **Office 365 Outlook** | *When a new email arrives*(트리거) · *Send an email* · *Reply to email* | 조용히 바인딩됨 |
| **Microsoft Teams** | *Post message in a chat or channel* | 조용히 바인딩됨 |
| **Excel Online (Business)** | *List rows present in a table* · *Add a row into a table* | **직접 만들어야 함** |
| **M365 Copilot** | M365 Copilot node | **직접 만들어야 함** |
| **Human review (인적 검토)** | Human review node | 조용히 바인딩됨 |
| **Agents (에이전트)** | Agent node | 조용히 바인딩됨 |

> 커넥터 액션을 검색하면 다른 커넥터의 같은 이름 액션이 나올 수 있습니다 — 특히 **Send an email (메일 보내기)**(Office 365 Outlook)과 **Send an email notification**(Mail)이 그렇습니다. 클릭하기 전에 항상 액션 위의 그룹 헤딩을 확인하세요.

---

# 부록 B — 복사해서 쓰는 레퍼런스

### Excel 통합 문서 — `Workflows-Lab.xlsx` (OneDrive for Business)

| 시트 | Table 이름 | 열 |
|---|---|---|
| `RequestLog` | `RequestLog` | ReceivedAt · FromAddress · Subject · Category · Priority · Summary · OwnerTeam · SLAHours · Status |
| `ProjectTracker` | `ProjectTracker` | Project · Owner · Status · PercentComplete · Risk · LastUpdate |
| `ReportArchive` | `ReportArchive` | GeneratedAt · Headline · AtRiskCount · ApprovedBy |

### 샘플 트래커 행 (시나리오 4)

```
Project                              | Owner       | Status   | PercentComplete | Risk   | LastUpdate
M365 Copilot rollout — Wave 2        | Jihoon Park | On track | 72              | Low    | 2026-08-18
Intune device compliance baseline    | Mina Seo    | At risk  | 40              | High   | 2026-08-14
Teams Phone migration (Seoul HQ)     | Daniel Cho  | On track | 88              | Low    | 2026-08-19
Entra ID Conditional Access refresh  | Hyewon Lim  | Blocked  | 25              | High   | 2026-08-11
SharePoint archive cleanup           | Jun Kang    | On track | 60              | Medium | 2026-08-17
Purview DLP policy tuning            | Sora Yoon   | At risk  | 35              | Medium | 2026-08-15
```

이 행들에 대한 예상 분석: `at_risk_count` = **3**; `stale_projects` 는 **Entra ID Conditional Access refresh** 를 지목합니다.

### 워크플로 이름과 트리거

| 시나리오 | 워크플로 이름 | 트리거 | 필터 / 일정 |
|---|---|---|---|
| 1 | `IT Request Triage Desk` | Connector ▸ Outlook ▸ When a new email arrives | 받은 편지함 · Subject 필터 `[REQ]` |
| 2 | `Reply Desk with Approval` | Connector ▸ Outlook ▸ When a new email arrives | 받은 편지함 · Subject 필터 `[Ask]` |
| 3 | `Daily Brief 8AM` | Recurrence | Week / Mon–Fri / 08 / 00 / `(UTC+09:00) Seoul` |
| 4 | `Friday Project Roll-up` | Recurrence | Week / Fri / 16 / 00 / `(UTC+09:00) Seoul` |

### 테스트 메일

| 시나리오 | Subject | 예상 결과 |
|---|---|---|
| 1 | `[REQ] Cannot sign in to Teams - MFA prompt keeps looping` | Access · High · Identity · SLA 4 · Teams 에스컬레이션 발동 |
| 1 | `[REQ] How do I share an Excel file with an external partner?` | Low · Collaboration · 에스컬레이션 **없음** |
| 1 | `[REQ] 노트북 배터리가 30분 만에 방전됩니다` | Endpoint · 확인 응답이 한국어로 작성됨 |
| 2 | `[Ask] Where did we land on the Teams Phone migration timeline?` | 실제 메일에 근거한 초안 |
| 2 | `[Ask] Can you confirm the Q4 budget number for the Busan site?` | 숫자를 지어내는 대신 후속 확인하겠다고 말하는 초안 |

### 표준 시간대 필드 — 헷갈리지 마세요

| 위치 | 형식 | 이 팩에서 쓰는 값 |
|---|---|---|
| **Recurrence 트리거 ▸ Advanced ▸ Time zone** | 표시 이름 | `(UTC+09:00) Seoul` |
| **M365 Copilot node ▸ Advanced (고급) ▸ Time zone** | IANA 식별자 | `Asia/Seoul` |

---

# 부록 C — 다음으로 해 볼 것

각 항목은 여러분이 이미 만든 패턴을 조금 변형한 것입니다. 좋은 심화 과제가 되고, 더 좋은 후속 세션이 됩니다.

| 아이디어 | 재사용하는 패턴 | 노드 |
|---|---|---|
| **회의 요청 분류** — 초대가 도착하면 에이전트가 여러분에게 필요한 회의인지 판단하고, 대리 참석자를 제안하는 거절 초안을 작성 | 시나리오 1 | Outlook 트리거 · Agent · Human review · Outlook |
| **온보딩 체크리스트** — 신규 입사자 행이 Excel에 추가되면 에이전트가 역할별 30일 계획을 생성하고, 관리자가 승인하면 메일로 보내고 Teams에 게시 | 시나리오 1 + 4 | Excel · Agent · Human review · Outlook · Teams |
| **주간 라이선스 검토** — 라이선스 할당을 읽고, 에이전트가 사용되지 않아 보이는 것을 지목하고, 회수 전에 관리자에게 확인 요청 | 시나리오 4 | Recurrence · Excel/Dataverse · Agent · Human review |
| **고객 에스컬레이션 다이제스트** — 모든 에스컬레이션 메일을 분류해 누적 Excel 로그에 추가하고, 금요일에 에이전트가 추세 요약을 작성 | 시나리오 1 + 4 | Outlook 트리거 · Agent · Excel · Recurrence |
| **변경 요청 접수** — 변경 요청이 메일로 도착하면 에이전트가 구조화된 필드를 추출하고, CAB 위원이 승인하면 Dataverse에 기록 | 시나리오 1 + 2 | Outlook · Agent(custom structured output) · Human review · Dataverse |
| **워크플로를 에이전트 도구로 노출** — 네 가지 중 무엇이든 *When an agent calls the workflow* 트리거로 다시 만든 뒤, 도구로 추가해 사람들이 물어보는 것만으로 호출할 수 있게 함 | 전체 | Agent-call 트리거 · Respond to the agent |

---

## 출처

- [Workflows overview — Microsoft Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview)
- [Add an agent node to a workflow](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/agent-node-workflow)
- [Add a Microsoft 365 Copilot node to a workflow](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/microsoft-365-copilot-node-workflow)
- [Request information from human review in workflows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-request-for-information)
- [Edit and manage your workflow in the designer](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-designer)

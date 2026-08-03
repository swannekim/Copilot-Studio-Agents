# Hands-On Lab (L200–L300): Contoso AP Invoice Checker

**선수 조건:** Copilot Studio 입문 세션을 이수했을 것.

> 📄 이 문서는 `04-Hands-On-Lab-L200-Intern-Brief.md`의 한국어 버전입니다. 제품 UI 명칭, 기술 용어, 데이터셋 값은 실제 화면과 일치하도록 영문 그대로 두었습니다.

---

## 1. 무엇을 만드는가

Contoso Manufacturing의 accounts payable 팀은 supplier invoice를 사람이 직접 열어보고, 해당하는 purchase order를 찾고, 가격과 수량을 확인한 뒤, 지급하거나 누군가에게 메일을 보냅니다. 대부분의 invoice는 문제가 없습니다. 문제가 있는 소수의 invoice에서 돈이 샙니다.

여러분은 invoice를 읽고, Contoso의 ERP와 대조한 뒤, 자동으로 지급할 수 있는지 아니면 사람이 봐야 하는지를 판단하는 agent를 만들게 됩니다.

실습을 마치면 다음을 모두 사용해 본 상태가 됩니다.

- invoice PDF를 읽는 **AI Builder**
- ERP를 조회하는 **custom connector**
- 검증 로직을 담는 **agent flow**
- 처리 결과를 기록하는 **Dataverse**
- 이들을 하나로 묶는 **classic Copilot Studio agent**

그다음 같은 개념을 **new experience**에서 **Agent node를 포함한 Workflow**로 다시 만들어, 두 방식의 차이를 직접 느껴봅니다.

---

## 2. 구현해야 할 규칙

모두 Contoso 정책 **AP-EXC-2026**(`policy/AP-EXC-2026-Invoice-Matching-Policy.md`)에서 가져온 것입니다. 이 실습에서는 그중 **6개**의 검사를 사용합니다. **아래 순서대로** 실행하고, **첫 번째 실패에서 중단**하세요.

| 순서 | 검사 | Exception code | 규칙 |
|---|---|---|---|
| 1 | invoice 금액이 맞는가 | `TOTAL_MISMATCH` | 인쇄된 total이 인쇄된 subtotal과 **USD 0.05**를 초과해 차이 남 |
| 2 | 중복이 아닌가 | `DUPLICATE_INVOICE` | 해당 invoice 번호가 이미 ledger에 존재함 |
| 3 | PO가 존재하는가 | `PO_NOT_FOUND` | 기재된 PO 번호에 대해 ERP가 **404**를 반환함 |
| 4 | supplier가 승인 상태인가 | `SUPPLIER_ON_HOLD` | supplier status가 `Approved`가 아님 |
| 5 | 수량 | `QTY_OVER_RECEIPT` | 청구 수량이 실제 입고 수량보다 많음 |
| 6 | 가격 | `PRICE_VARIANCE` | 청구 단가가 PO 단가와 **2%**를 초과해 차이 나거나, 해당 line에서 **USD 50.00**을 초과해 차이 남 |

6개를 모두 통과하면 결과는 **`AUTO_CLEAR`**입니다. 그렇지 않으면 **`EXCEPTION`**이며, 가장 먼저 실패한 검사의 code가 붙고 **AP Manager**의 승인으로 넘어갑니다.

> **순서가 중요합니다.** `INV-2026-0007`은 가격과 수량이 완벽하게 일치하지만 supplier가 hold 상태입니다. supplier 확인을 매칭 *뒤에* 하면 이 invoice를 정상으로 보고하게 되고, Contoso는 지급해서는 안 되는 supplier에게 대금을 지급하게 됩니다.

> **두 가지 가격 테스트가 모두 적용됩니다.** 어떤 line은 2% 미만이면서도 USD 50 상한을 넘을 수 있고, 2%를 넘으면서도 금액은 작을 수 있습니다. 둘 다 확인하세요.

---

## 3. 시작하기 전에

**ERP mock**은 facilitator가 이미 배포해 두었습니다. 다음 두 가지를 받으세요.

- ERP mock의 **host name**
- **API key**

직접 mock을 세워보고 싶다면 L300–L400 브리프에 방법이 있습니다. 이 실습에서는 필요 없습니다.

나머지는 모두 `lab-assets` 폴더에 있습니다.

| 경로 | 내용 |
|---|---|
| `invoices/*.pdf` | supplier invoice. 이 중 **8건**을 사용합니다 — §9 참고 |
| `api/contoso-erp-openapi.json` | import할 connector 정의 |
| `policy/AP-EXC-2026-Invoice-Matching-Policy.md` | 전체 정책. 이 실습은 §2의 6개 검사만 사용합니다 |
| `schemas/exception-ledger-schema.md` | 전체 ledger 스키마. 이 실습은 축약 버전을 씁니다 — §5 참고 |

---

## 4. Step 1 — custom connector import

1. **make.powerapps.com** → 환경 선택 → **Data** → **Custom connectors**로 이동합니다.
2. **+ New custom connector** → **Import an OpenAPI file**.
3. 이름을 `Contoso ERP`로 하고 `api/contoso-erp-openapi.json`을 선택한 뒤 **Continue**.
4. **General** 페이지에서 **Host**를 facilitator에게 받은 host name으로 설정합니다.
5. **Security** 페이지의 API key 설정은 그대로 둡니다.
6. **Create connector**를 선택합니다.
7. **2~3분 기다리세요.** connector는 즉시 준비되지 않으며, 너무 일찍 테스트하면 원인을 알기 어려운 실패가 납니다.
8. **Test** 페이지 → **New connection** → facilitator에게 받은 API key 입력 → **Create connection**.
9. 다시 **Test**로 돌아와 connection 목록을 새로고침하고, **`GetPurchaseOrder`** operation을 선택한 뒤 **Purchase order number** 필드에 `PO-45001`을 입력하고 **Test operation**을 누릅니다.

supplier `SUP-1001`, status `Partially Received`, 그리고 2개의 line이 반환되어야 합니다.

이제 실패 경로도 확인하세요. `GetPurchaseOrder`를 **`PO-99999`**로 다시 실행하면 **404**가 나와야 합니다. 이것은 버그가 아닙니다. 여러분의 invoice 중 하나가 존재하지 않는 PO를 기재하고 있으며, flow가 이를 처리해야 합니다.

> `PO-45001`은 필드에 입력하는 purchase order **번호**이지 파일이 아닙니다. 이 팩에 PO 파일은 없습니다. purchase order는 ERP 안에 있으며 connector를 통해 조회합니다.

---

## 5. Step 2 — ledger 테이블 만들기

**make.powerapps.com** → **Tables** → **New table** → **Start from blank**. 이름은 `Invoice Check`로 합니다.

다음 열을 추가하세요.

| 열 | 형식 |
|---|---|
| Invoice Number | Text — primary column으로 사용 |
| Supplier Name | Text |
| PO Number | Text |
| Invoice Total | Currency |
| Outcome | Choice: `Auto cleared`, `Exception` |
| Exception Code | Text |
| Reason | Multiline text |
| Checked At | Date and time |

처리한 모든 invoice가 한 행씩 기록되어야 합니다. 통과한 건도 포함입니다. 실패만 기록하는 로그는 로그가 아닙니다.

---

## 6. Step 3 — agent flow 만들기

Copilot Studio, classic experience: **Workflows** → **New agent flow**.

디자이너가 trigger와 response가 이미 배치된 상태로 열립니다. 그 사이를 채워 나가면 됩니다.

### 6.1 Trigger

**When an agent calls the flow.** **File** 형식의 입력을 하나 추가하고 이름을 `Invoice`로 합니다.

### 6.2 invoice 읽기 — AI Builder

액션을 추가합니다. **AI Builder**를 검색해 **Extract information from invoices**를 선택하세요.

**Invoice file**에 trigger의 `Invoice` 입력을 지정합니다.

이것은 Microsoft가 invoice에 특화해 학습시킨 모델입니다. 여러 필드 중 다음을 반환합니다.

| 필요한 값 | AI Builder가 주는 필드 |
|---|---|
| invoice 번호 | `Invoice ID` |
| PO 번호 | `Purchase order` |
| supplier 이름 | `Vendor name` |
| subtotal | `Subtotal (number)` |
| total | `Invoice total (number)` |
| line item | `Product code`, `Quantity`, `Unit price`, `Amount` |

모든 필드에는 0과 1 사이의 **confidence score**가 함께 옵니다. 모델이 그 값을 얼마나 확신하는지를 나타냅니다. 이 실습에서 반드시 사용할 필요는 없지만, 테스트하면서 한 번 살펴보세요. confidence 0.4로 돌아온 필드를 사람 확인 없이 지급 근거로 삼고 싶지는 않을 것입니다.

> 금액은 text 버전이 아니라 **number** 버전을 사용하세요. `Invoice total (number)`는 `1380.00`을 주지만, `Invoice total (text)`는 `"$1380.00"`을 주며 이것으로는 계산할 수 없습니다.

### 6.3 검사 1 — invoice 금액이 맞는가?

**Condition**을 추가합니다. `Invoice total (number)`와 `Subtotal (number)`의 차이의 절대값이 `0.05`보다 큰가?

**예**라면 → `TOTAL_MISMATCH`입니다. 판정 작성 단계로 건너뜁니다.

> 왜 0이 아니라 0.05일까요? 반올림이 존재하기 때문입니다. 테스트 세트의 어떤 invoice는 정확히 1센트 차이가 나지만 그럼에도 정상으로 처리되어야 합니다.

### 6.4 검사 2 — 전에 본 invoice인가?

Dataverse 액션을 추가합니다. `Invoice Check`에 대해 **List rows**를 실행하고, AI Builder가 반환한 invoice 번호로 필터링합니다.

행이 하나라도 돌아오면 → `DUPLICATE_INVOICE`.

> 이 검사를 ERP 호출 **전에** 하세요. 중복 invoice가 승인자에게 도달해서는 안 됩니다. 이미 한 번 처리된 건이기 때문입니다.

### 6.5 검사 3 — PO가 존재하는가?

**Contoso ERP** connector 액션 **GetPurchaseOrder**를 추가하고, AI Builder가 준 `Purchase order` 값을 전달합니다.

404를 처리하세요. 존재하지 않는 PO는 오류가 아니라 **비즈니스 결과**(`PO_NOT_FOUND`)입니다. flow는 중단되지 않고 이 결과를 보고해야 합니다.

### 6.6 검사 4 — supplier가 승인 상태인가?

connector 액션 **GetSupplier**를 추가하고, 방금 받은 **purchase order 응답에 들어 있는** `supplierId`를 사용합니다.

> supplier 코드는 invoice에 인쇄되어 있지 않습니다. supplier의 이름만 있습니다. 그래서 PO를 먼저 조회하고 거기서 supplier 코드를 읽어오는 것입니다.

반환된 `status`가 `Approved`가 아니면 → `SUPPLIER_ON_HOLD`.

### 6.7 검사 5와 6 — 수량과 가격

AI Builder가 반환한 invoice line item에 대해 **Apply to each**를 추가합니다. 각 line마다 같은 **SKU**(`Product code`)를 가진 PO line을 찾은 뒤,

- 청구 **수량**이 해당 PO line의 **`qtyReceived`**보다 크면 → `QTY_OVER_RECEIPT`
- 청구 **단가**가 해당 PO line의 **`unitPrice`**와,
  - **2%**를 초과해 다르거나, **또는**
  - 그 line의 수량 기준으로 **USD 50.00**을 초과해 다르면

  → `PRICE_VARIANCE`

> `qtyOrdered`가 아니라 **`qtyReceived`**와 비교하세요. Contoso는 발주한 수량이 아니라 도착한 수량에 대해 지급합니다. 테스트 세트에는 바로 이 실수를 잡아내도록 만든 invoice가 있습니다.

### 6.8 판정과 ledger 행 작성

다음 필드로 판정을 구성한 뒤 `Invoice Check`에 행을 만듭니다.

```
outcome        AUTO_CLEAR 또는 EXCEPTION
exceptionCode  가장 먼저 실패한 검사의 code, 없으면 빈 값
reason         어느 line인지, 얼마가 청구되었는지, 기대값은 얼마였는지
```

`"variance found"` 수준의 사유로는 부족합니다. 재무 담당자가 다른 자료를 열어보지 않고도 조치할 수 있도록 쓰세요.

> `Line 1 (TL-FRT-STD): invoiced 415.80 against PO price 385.00 — 8.00% over.`

### 6.9 agent에 응답하기

**Respond to the agent** 액션이 판정을 반환합니다. `outcome`, `exceptionCode`, `reason`을 각각 별도의 출력으로 돌려보내세요.

그다음 flow를 **저장하고 publish**합니다. publish되지 않은 flow는 tool로 사용할 수 없습니다.

---

## 7. Step 4 — agent 만들기

Copilot Studio, classic experience에서 `Contoso AP Agent`라는 이름의 새 agent를 만듭니다.

1. **Knowledge** — `policy/AP-EXC-2026-Invoice-Matching-Policy.md`를 업로드합니다. 누군가 왜 이 invoice가 보류되었는지 물었을 때 agent가 규칙을 설명할 수 있게 해줍니다. 검증을 수행하는 것은 **아닙니다.** 검증은 여러분의 flow가 합니다.
2. **Tools** — **Add a tool** → publish한 agent flow를 선택합니다. `Check supplier invoice` 같은 명확한 이름과, *"Checks a supplier invoice against its purchase order and returns whether it can be paid automatically."* 같은 설명을 붙이세요.
3. **Instructions** — 사용자가 invoice를 제공하면 이 tool을 사용하고, 결과와 code와 사유를 알기 쉬운 표현으로 보고하도록 지시합니다.

> generative orchestration에서 agent는 tool의 **이름과 설명**을 보고 선택합니다. `Check supplier invoice`는 선택되고 `Flow 1`은 선택되지 않습니다. 설명보다 이름의 비중이 더 크므로 이름에 잠깐 공을 들이세요.

**tolerance 수치를 agent instructions에 넣지 마세요.** 2%, USD 50, USD 0.05는 모두 flow 안에 있어야 합니다. instructions는 감사자가 검사할 수 있는 통제 수단이 아니며, 모델은 스스로 그 지침에서 벗어날 수 있습니다.

---

## 8. Step 5 — new experience에서 다시 만들기

같은 개념, 다른 구성 요소입니다. 이 부분은 더 짧습니다. 전체를 다시 만드는 것이 아니라 추출과 판정 경로만 다시 만듭니다.

Copilot Studio에서 **New experience**를 켜거나 classic 홈 화면의 **Try it now**로 진입한 뒤, **Workflows** → **New workflow**.

다음과 같이 구성합니다.

| 노드 | 역할 |
|---|---|
| **Trigger** | 수동 실행, 또는 메일 수신 시 |
| **Agent node** — **New agent for this workflow** 선택 | invoice를 읽습니다. **Output**을 **Custom structured output**으로 설정하고 `invoiceNumber`, `poNumber`, `subtotal`, `invoiceTotal`, `lines` 필드를 정의합니다 |
| **일반 workflow 노드** | §2의 6개 검사. 같은 규칙, 같은 순서 |
| **Connector 노드** | `GetPurchaseOrder`, 그다음 `GetSupplier` |
| **Agent node** — 두 번째 | 판정을 사람이 조치할 수 있는 문장으로 바꿉니다 |
| **Condition** | `outcome`으로 분기 |

전체를 실행하기 전에 **Test this node**로 각 노드를 개별 테스트하세요. 새 디자이너에서 확실히 나아진 부분 중 하나입니다.

### AI Builder와 Agent node는 같은 것이 아닙니다

비슷해 보이기 때문에 정확히 짚고 넘어갈 가치가 있습니다.

| | AI Builder invoice model | Agent node |
|---|---|---|
| 정체 | invoice에 특화해 학습된 모델 | 자연어로 지시하는 범용 AI 단계 |
| 실행 위치 | flow 안의 액션 | new experience workflow 안의 노드 |
| 출력 | 문서화된 고정 필드 목록 | 여러분이 정의한 형태 |
| Confidence score | **있음, 필드별로** | 없음 |
| 강점 | 표준적인 상업 문서 | 잘 설명하기만 하면 무엇이든 |

Part A에서는 전문가를 썼고, Part B에서는 범용 도구에 원하는 바를 설명해서 씁니다. 둘 다 유효합니다. 어느 쪽이 더 안정적인 필드 이름을 주었고 어느 쪽이 더 유연했는지 눈여겨보세요.

---

## 9. 테스트 세트

다음 **8건**을 이 순서대로 실행하고, agent가 어떻게 판정했는지 기록하세요.

| # | Invoice | 기록할 항목 |
|---|---|---|
| 1 | `INV-2026-0001` | outcome, code, reason |
| 2 | `INV-2026-0003` | outcome, code, reason |
| 3 | `INV-2026-0004` | outcome, code, reason |
| 4 | `INV-2026-0005` | outcome, code, reason |
| 5 | `INV-2026-0007` | outcome, code, reason |
| 6 | `INV-2026-0014` | outcome, code, reason |
| 7 | `INV-2026-0015` | outcome, code, reason |
| 8 | `INV-2026-0001-DUPLICATE` | outcome, code, reason |

**8번을 마지막에 실행하세요.** 원본이 이미 ledger에 있어야 중복 판정이 의미를 갖습니다.

**8건 중 6건이 exception으로 나와야 하며**, 각각 서로 다른 code를 가집니다. §2의 검사 하나당 하나씩입니다. 나머지 2건은 정상 통과해야 합니다. 다른 비율이 나온다면 어딘가 잘못된 것이고, 그것을 찾아내는 것이 이 실습입니다.

---

## 10. 리뷰에 가져올 것

1. **결과 표** — 8건 전체의 outcome, code, reason.
2. **동작하는 데모** — auto-clear 1건과 exception 1건.
3. **flow 구조 스케치** — 검사가 실행되는 순서. 화이트보드도 좋습니다.
4. **한 번에 되지 않았던 것 하나**와 그것을 어떻게 해결했는지.

---

## 11. 잘 안 될 때

| 증상 | 유력한 원인 |
|---|---|
| connector를 만들자마자 테스트가 실패한다 | 너무 빨리 테스트했습니다. 2~3분 기다리세요 |
| `Missing or invalid x-api-key header`와 함께 `401` | API key가 일치하지 않습니다. facilitator에게 확인하세요 |
| 디자이너에서는 되는데 agent가 flow를 호출하지 않는다 | flow가 publish되지 않았거나, tool 이름과 설명이 너무 모호합니다 |
| 계산 결과가 이상하다 | 금액의 number 버전이 아니라 text 버전을 쓰고 있습니다 |
| 전부 exception으로 나온다 | 검사 순서가 잘못되었거나, 엉뚱한 두 필드를 비교하고 있을 가능성이 큽니다 |
| `INV-2026-0015`가 exception으로 나온다 | total 검사에 tolerance가 없습니다. 1센트 차이는 허용됩니다 |
| `INV-2026-0004`가 정상으로 나온다 | `qtyReceived`가 아니라 `qtyOrdered`와 비교했습니다 |

---

## 12. 일찍 끝났다면

- AI Builder의 **confidence score**를 활용해 보세요. 주요 필드 중 하나라도 0.65 미만이면 검사 결과와 무관하게 사람 검토 대상으로 표시합니다.
- **idempotent**하게 만들어 보세요. `INV-2026-0001`을 세 번 실행했을 때 ledger 행이 3개가 아니라 1개여야 합니다.
- **Approvals** 단계를 추가해 exception이 실제로 사람에게 가도록 만들어 보세요.
- 이 실습에서 빠진 4개의 검사와, 그것을 확인하는 7건의 추가 invoice를 facilitator에게 요청하세요. 그것이 L300–L400 실습입니다.

---

## 13. 참고 자료

- 같은 팩의 `01-Copilot-Studio-Agents-Classic-vs-New.md`
- [Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)
- [Invoice processing prebuilt AI model](https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing)
- [Use the invoice processing prebuilt model in Power Automate](https://learn.microsoft.com/en-us/ai-builder/flow-invoice-processing)
- [Add an agent node to a workflow](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/agent-node-workflow)
- [Add a workflow as a tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-agent)

만드는 도중에 질문하세요. 세 시간 동안 혼자 막혀 있는 것은 이 실습의 목적이 아닙니다.

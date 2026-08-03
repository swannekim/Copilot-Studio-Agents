"""
Contoso ERP mock - Azure Functions (Python v2 programming model).

Implements the contract in contoso-erp-openapi.json exactly, including the 404s and
the 409 duplicate response that the lab's error-handling requirements depend on.

Deploy
------
1. Put this file, host.json, requirements.txt and erp-seed.json in one folder.
2. Set the app setting  ERP_API_KEY  to a value of your choice.
3. Deploy with the Azure Functions extension for VS Code, or:
       func azure functionapp publish <your-function-app-name>
4. The base URL is then:
       https://<your-function-app-name>.azurewebsites.net/api/erp/v1
   Put the host name into the "host" field of the OpenAPI file before importing it
   as a custom connector.

Auth: every route expects the header  x-api-key.  Anonymous auth level is used at the
Functions layer so that the API key is the single, connector-visible credential.
"""
import json
import os
import pathlib
import datetime
import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

_SEED = json.loads((pathlib.Path(__file__).parent / "erp-seed.json").read_text())
SUPPLIERS = {s["supplierId"]: s for s in _SEED["suppliers"]}
POS = {p["poNumber"]: p for p in _SEED["purchaseOrders"]}
POSTED: dict[tuple[str, str], dict] = {}          # in-memory posting ledger

API_KEY = os.environ.get("ERP_API_KEY", "contoso-lab-key")


def _json(body: dict, status: int = 200) -> func.HttpResponse:
    return func.HttpResponse(json.dumps(body), status_code=status,
                             mimetype="application/json")


def _err(code: str, message: str, status: int) -> func.HttpResponse:
    return _json({"code": code, "message": message}, status)


def _auth(req: func.HttpRequest):
    if req.headers.get("x-api-key") != API_KEY:
        return _err("unauthorized", "Missing or invalid x-api-key header.", 401)
    return None


@app.route(route="erp/v1/suppliers/{supplierId}", methods=["GET"])
def get_supplier(req: func.HttpRequest) -> func.HttpResponse:
    if (bad := _auth(req)):
        return bad
    sid = req.route_params.get("supplierId")
    sup = SUPPLIERS.get(sid)
    if sup is None:
        return _err("supplier_not_found", f"No supplier with ID '{sid}'.", 404)
    return _json(sup)


@app.route(route="erp/v1/purchaseorders/{poNumber}", methods=["GET"])
def get_purchase_order(req: func.HttpRequest) -> func.HttpResponse:
    if (bad := _auth(req)):
        return bad
    pon = req.route_params.get("poNumber")
    po = POS.get(pon)
    if po is None:
        return _err("po_not_found", f"No purchase order with number '{pon}'.", 404)
    return _json(po)


@app.route(route="erp/v1/purchaseorders", methods=["GET"])
def list_purchase_orders(req: func.HttpRequest) -> func.HttpResponse:
    if (bad := _auth(req)):
        return bad
    supplier_id = req.params.get("supplierId")
    if not supplier_id:
        return _err("missing_parameter", "Query parameter 'supplierId' is required.", 400)
    status = req.params.get("status")
    hits = [p for p in POS.values()
            if p["supplierId"] == supplier_id and (status is None or p["poStatus"] == status)]
    return _json({"value": hits})


@app.route(route="erp/v1/invoicepostings", methods=["POST"])
def post_invoice(req: func.HttpRequest) -> func.HttpResponse:
    if (bad := _auth(req)):
        return bad
    try:
        body = req.get_json()
    except ValueError:
        return _err("invalid_body", "Request body must be valid JSON.", 400)

    for field in ("supplierId", "supplierInvoiceNumber", "poNumber", "currency", "totalAmount"):
        if body.get(field) in (None, ""):
            return _err("missing_field", f"Field '{field}' is required.", 400)

    key = (body["supplierId"], body["supplierInvoiceNumber"])
    if key in POSTED:
        return _err("already_posted",
                    f"Invoice {body['supplierInvoiceNumber']} for supplier "
                    f"{body['supplierId']} was already posted as "
                    f"{POSTED[key]['postingId']}.", 409)

    seq = len(POSTED) + 1
    due = datetime.date.today() + datetime.timedelta(days=30)
    posting = {"postingId": f"AP-{seq:06d}",
               "status": "Scheduled",
               "scheduledPaymentDate": due.isoformat()}
    POSTED[key] = posting
    return _json(posting, 201)

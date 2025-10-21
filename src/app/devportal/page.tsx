import Link from "next/link";

export default function DevPortalPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-text-light-primary">
        ZeroPay API Documentation
      </h1>
      <p className="mb-8 text-text-light-secondary">
        Welcome to the ZeroPay developer portal. Here you can find interactive
        API docs, code samples, and authentication guides to help you integrate
        with our payment gateway.
      </p>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Authentication</h2>
          <p className="mb-2">
            Authenticate using your merchant API key in the{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">Authorization</code>{" "}
            header:
          </p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-2">
            Authorization: Bearer &lt;your-api-key&gt;
          </pre>
          <Link href="/merchant/apikeys" className="text-accent underline">
            View your API keys
          </Link>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Endpoints</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <b>POST</b>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                /api/merchant/payment/create
              </code>{" "}
              <br />
              Initiate a payment.{" "}
              <Link href="#payment-create" className="text-accent underline">
                See details
              </Link>
            </li>
            <li>
              <b>POST</b>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                /api/merchant/payment/refund
              </code>{" "}
              <br />
              Refund a transaction.{" "}
              <Link href="#payment-refund" className="text-accent underline">
                See details
              </Link>
            </li>
            <li>
              <b>GET</b>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                /api/merchant/transactions/latest
              </code>{" "}
              <br />
              List recent transactions.
            </li>
            <li>
              <b>POST</b>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                /api/merchant/webhooks
              </code>{" "}
              <br />
              Register a webhook endpoint.
            </li>
            <li>
              <b>DELETE</b>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                /api/merchant/webhooks/[id]
              </code>{" "}
              <br />
              Delete a webhook endpoint.
            </li>
          </ul>
        </section>
        <section id="payment-create">
          <h3 className="text-lg font-semibold mb-2">Create Payment</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-2">{`POST /api/merchant/payment/create\nContent-Type: application/json\nAuthorization: Bearer <your-api-key>\n{\n  "amount": 1000,\n  "currency": "INR",\n  "method": "upi", // card, upi, wallet, netbanking\n  "customer": {\n    "name": "John Doe",\n    "email": "john@example.com"\n  }\n}`}</pre>
        </section>
        <section id="payment-refund">
          <h3 className="text-lg font-semibold mb-2">Refund Payment</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-2">{`POST /api/merchant/payment/refund\nContent-Type: application/json\nAuthorization: Bearer <your-api-key>\n{\n  "transactionId": "...",\n  "amount": 500 // optional for partial refund\n}`}</pre>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Webhooks</h2>
          <p className="mb-2">
            Receive real-time notifications for payment events. Subscribe to
            events like{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              payment.success
            </code>
            ,{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              payment.failed
            </code>
            , and{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              payment.refunded
            </code>
            .
          </p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-2">{`{\n  "event": "payment.success",\n  "data": {\n    "transactionId": "...",\n    "amount": 1000,\n    "currency": "INR"\n  }\n}`}</pre>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Code Samples</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">cURL</h4>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-2">{`curl -X POST https://zeropay.dev/api/merchant/payment/create \\\n  -H "Authorization: Bearer <your-api-key>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"amount":1000,"currency":"INR","method":"upi"}'`}</pre>
            </div>
            <div>
              <h4 className="font-semibold">Node.js (fetch)</h4>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-2">{`await fetch("/api/merchant/payment/create", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer <your-api-key>",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({ amount: 1000, currency: "INR", method: "upi" })\n});`}</pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

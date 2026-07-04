import NewInvoiceForm from "../NewInvoiceForm";

export default function NewInvoicePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create an invoice</h1>
      <p className="text-neutral-500 text-sm mb-8">
        Generates a Razorpay order and a shareable payment link for a new or existing client.
      </p>
      <NewInvoiceForm />
    </div>
  );
}

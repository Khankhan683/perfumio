import { useLocation, Link } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-801/355 text-white">
        <div className="text-center">
          <h1 className="text-2xl text-amber-300">No Order Found</h1>

          <Link to="/" className="mt-4 inline-block text-amber-300 underline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-neutral-801/355 px-4 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-amber-500/30 bg-zinc-950 p-8 text-center">
        <h1 className="text-3xl font-bold text-amber-300">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-gray-300">
          Thank you, {order.customer.fullName}!
        </p>

        <p className="mt-2 text-gray-400">
          Your order will be delivered to {order.customer.city}.
        </p>

        <p className="mt-5 text-xl font-bold text-amber-300">
          Total: Rs. {order.total.toLocaleString("en-PK")}
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Payment: {order.paymentMethod}
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded-full bg-amber-300 px-7 py-3 font-bold text-black transition hover:bg-amber-100"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

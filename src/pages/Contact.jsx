import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      setStatus("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [status]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setStatus("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: "New Contact Message - Perfumio",
          message: formData.message,
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  const contactDetails = [
    {
      icon: "✉",
      title: "EMAIL US",
      value: "hello@perfumio.com",
    },
    {
      icon: "☎",
      title: "CALL US",
      value: "Add your phone number",
    },
    {
      icon: "⌖",
      title: "LOCATION",
      value: "Add your business address",
    },
  ];

  const inputClass =
    "w-full min-w-0 rounded-xl border border-neutral-700 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-300 focus:border-amber-300 focus:bg-black/70 focus:ring-2 focus:ring-amber-300/10 sm:text-base";

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10">
      <style>{`
        @keyframes contactFadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes contactFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .contact-enter {
          animation: contactFadeUp 0.8s ease-out both;
        }

        .contact-details-enter {
          animation-delay: 0.15s;
        }

        .contact-form-enter {
          animation-delay: 0.3s;
        }

        .contact-success-enter {
          animation: contactFadeIn 0.35s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-enter,
          .contact-success-enter {
            animation: none;
          }
        }
      `}</style>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <div className="contact-enter mb-10 text-center sm:mb-14">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-amber-300 sm:text-xs sm:tracking-[0.5em]">
            PERFUMIO · GET IN TOUCH
          </p>

          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Contact
            <span className="ml-3 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
              Us
            </span>
          </h1>

          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-neutral-300 sm:text-base">
            Have a question or need assistance? We'd love to hear from you. Our
            team is always ready to help.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid items-start gap-5 md:grid-cols-[0.9fr_1.1fr] md:gap-8 lg:gap-14">
          {/* Contact Details */}
          <div className="contact-enter contact-details-enter min-w-0 rounded-2xl border border-amber-400/20 bg-neutral-801/355 p-4 shadow-2xl backdrop-blur-md sm:p-7 lg:p-8">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-amber-300 sm:text-xs sm:tracking-[0.3em]">
              A PERSONAL TOUCH
            </p>

            <h2 className="mt-4 font-serif text-2xl leading-snug sm:mt-5 sm:text-4xl lg:text-5xl">
              Let's Create
              <span className="block text-amber-300">Something Memorable.</span>
            </h2>

            <div className="mt-6 h-px w-16 bg-amber-300" />

            <p className="mt-6 text-sm leading-7 text-neutral-300 sm:text-base">
              Whether you need assistance, have a question, or want to share
              your thoughts, we're always here to help you. Your experience
              matters to us.
            </p>

            {/* Contact Information */}
            <div className="mt-8 space-y-5">
              {contactDetails.map((item, index) => (
                <div
                  key={item.title}
                  className="group flex min-w-0 items-center gap-4 rounded-xl border border-transparent p-3 transition-all duration-300 hover:border-amber-400/20 hover:bg-amber-400/5 sm:p-4"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-xl text-amber-300 transition duration-300 group-hover:scale-110 group-hover:bg-amber-300 group-hover:text-black">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.25em] text-amber-300 sm:text-xs">
                      {item.title}
                    </p>

                    <p className="mt-1 break-words text-sm text-neutral-200 sm:text-base">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-neutral-800 pt-6">
              <p className="text-xs tracking-[0.25em] text-neutral-500">
                PERFUMIO
              </p>

              <p className="mt-2 font-serif text-lg italic text-amber-300">
                Luxury You Can Feel.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="contact-enter contact-form-enter min-w-0 rounded-2xl border border-amber-400/30 bg-neutral-801/3550 p-4 shadow-2xl shadow-black/40 backdrop-blur-md transition duration-300 hover:border-amber-400/50 sm:p-7 lg:p-9"
          >
            <div className="mb-5 border-b border-neutral-800 pb-4 sm:mb-7 sm:pb-5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-amber-300 sm:text-xs sm:tracking-[0.3em]">
                SEND US A MESSAGE
              </p>

              <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
                Get in Touch
              </h2>

              <p className="mt-2 text-sm text-neutral-400">
                Fill out the form below and we'll get back to you.
              </p>
            </div>

            {/* Name */}
            <div className="mb-3 sm:mb-5">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Your Name <span className="text-amber-300">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={inputClass}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Your Email <span className="text-amber-300">*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={inputClass}
                required
              />
            </div>

            {/* Message */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Your Message <span className="text-amber-300">*</span>
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className={`${inputClass} resize-y`}
                required
              />
            </div>

            {/* Success Message */}
            {status === "success" && (
              <div
                role="status"
                className="contact-success-enter mb-5 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4"
              >
                <span className="text-lg text-green-400">✓</span>

                <p className="text-sm leading-6 text-green-400">
                  Your message has been sent successfully! Thank you for
                  contacting Perfumio.
                </p>
              </div>
            )}

            {/* Error Message */}
            {status === "error" && (
              <div
                role="alert"
                className="contact-success-enter mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
              >
                <span className="text-lg text-red-400">✕</span>

                <p className="text-sm leading-6 text-red-400">
                  Message could not be sent. Please check your connection and
                  try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-5 py-4 text-sm font-bold tracking-wider text-black shadow-lg shadow-amber-400/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:text-base"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  SENDING MESSAGE...
                </>
              ) : (
                <>
                  SEND MESSAGE
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-neutral-500">
              Thank you for choosing Perfumio. We're happy to assist you.
            </p>
          </form>
        </div>

        {/* Footer Text */}
        <p className="mt-12 text-center text-[10px] tracking-[0.3em] text-neutral-300 sm:mt-16 sm:text-xs sm:tracking-[0.4em]">
          PERFUMIO · LUXURY YOU CAN FEEL
        </p>
      </div>
    </section>
  );
}

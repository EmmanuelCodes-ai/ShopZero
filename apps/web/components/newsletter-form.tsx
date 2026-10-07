"use client";

export function NewsletterForm() {
  return (
    <form
      className="newsletter-form"
      onSubmit={(e) => {
        e.preventDefault();
        const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
        if (input?.value) {
          alert(`Thanks! We'll send deals to ${input.value}`);
          input.value = "";
        }
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        aria-label="Email for newsletter"
        required
      />
      <button type="submit">Subscribe</button>
    </form>
  );
}

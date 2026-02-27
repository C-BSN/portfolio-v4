import { Metadata } from "next"
import ContactForm from "./contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Corentin Basson pour vos projets de communication, graphisme et photographie.",
}

export default function ContactPage() {
  return <ContactForm />
}

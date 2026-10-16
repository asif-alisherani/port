export const CONTACT_FORM_EVENT = 'asif:open-contact-form';

/** Ask the ContactForm (mounted once in App) to open itself. */
export function openContactForm() {
  window.dispatchEvent(new CustomEvent(CONTACT_FORM_EVENT));
}

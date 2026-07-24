import {
  Form as InternalForm,
  FormControl as InternalFormControl,
  FormDescription as InternalFormDescription,
  FormField as InternalFormField,
  FormItem as InternalFormItem,
  FormLabel as InternalFormLabel,
  FormMessage as InternalFormMessage,
  useFormField as useInternalFormField
} from "../internal/form";

/**
 * Form, sourced from shadcn/ui's `react-hook-form` integration and
 * adapted to Lumen's token system — see packages/ui/src/components/internal/form.tsx
 * for the adaptation notes. Promoted to this plain name 2026-07-24,
 * dropping the `Shadcn` prefix from every symbol except one: `FormField`
 * keeps the `ShadcnFormField` name because it's the one genuine collision
 * in this family — Lumen's existing hand-built `FormField` composite (a
 * simple label/hint/error wrapper, no `react-hook-form`) stays in place
 * for callers that don't need full form-state management (e.g.
 * `AuthForm.tsx`), so both can coexist under distinct names rather than
 * forcing every consumer onto `react-hook-form`. `Form`/`FormItem`/
 * `FormLabel`/`FormControl`/`FormDescription`/`FormMessage`/
 * `useFormField` don't collide with anything Lumen has, so they dropped
 * the prefix entirely.
 *
 * Kept as a plain re-export (not wrapped in a non-generic function
 * component, unlike every other component in this integration): `Form` is
 * `react-hook-form`'s own generic `FormProvider`, and wrapping it in a
 * fixed-signature function erases that generic, breaking type inference
 * for any caller passing a concretely-typed `useForm<TSchema>()` result.
 *
 * This public module is the only supported import path; the internal
 * implementation may change without notice.
 */
export const Form = InternalForm;
export const ShadcnFormField = InternalFormField;
export const FormItem = InternalFormItem;
export const FormLabel = InternalFormLabel;
export const FormControl = InternalFormControl;
export const FormDescription = InternalFormDescription;
export const FormMessage = InternalFormMessage;
export const useFormField = useInternalFormField;

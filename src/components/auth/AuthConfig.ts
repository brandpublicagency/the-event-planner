import { ThemeMinimal } from "@supabase/auth-ui-shared";

export const authAppearance = {
  theme: ThemeMinimal,
  variables: {
    default: {
      colors: {
        brand: '#18181B',
        brandAccent: '#27272A',
        inputBackground: 'white',
        inputBorder: '#E4E4E7',
        inputBorderFocus: '#18181B',
        inputBorderHover: '#71717A',
        inputPlaceholder: '#A1A1AA',
      },
      space: {
        inputPadding: '0.75rem',
        buttonPadding: '0.75rem',
      },
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: '0.5rem',
        buttonBorderRadius: '0.5rem',
        inputBorderRadius: '0.5rem',
      },
    },
  },
  className: {
    container: 'w-full space-y-6',
    button: 'w-full bg-zinc-900 text-white hover:bg-zinc-800 text-left',
    input: 'w-full',
    label: 'hidden',
    divider: 'my-6',
    anchor: 'hidden',
    message: 'text-left',
  },
};

export const authLocalization = {
  variables: {
    sign_in: {
      email_label: '',
      password_label: '',
      email_input_placeholder: 'Email address',
      password_input_placeholder: 'Password',
      button_label: 'Sign in with email',
      link_text: '',
    },
    sign_up: {
      email_label: '',
      password_label: '',
      email_input_placeholder: 'Email address',
      password_input_placeholder: 'Password',
      button_label: 'Sign up with email',
      link_text: '',
    },
    forgotten_password: {
      link_text: '',
    },
  },
};
// src/app/sign-in/[[...sign-in]]/page.tsx

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1A1D]">
      <SignIn
        appearance={{
          elements: {
            card: {
              borderRadius: '12px',
              background: '#282A31',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              border: '1px solid #3A3D44',
            },
            headerTitle: {
              color: '#E0E0E0',
              fontWeight: 'bold', // Texto en negrita
            },
            headerSubtitle: {
              color: '#B0B0B0',
            },
            formFieldLabel: {
              color: '#B0B0B0',
              fontWeight: 'bold', // Texto de las etiquetas en negrita
            },
            formFieldInput: {
              background: '#3F4147',
              borderRadius: '8px',
              color: '#E0E0E0',
              border: '1px solid transparent',
              outline: 'none',
              "&:focus": {
                borderColor: '#008CFF',
                boxShadow: '0 0 0 1px #008CFF',
              }
            },
            formButtonPrimary: {
              background: '#008CFF',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              fontWeight: 'bold', // Texto del botón en negrita
              textTransform: 'none',
              letterSpacing: 'normal',
              "&:hover": {
                opacity: '0.9',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
              }
            },
            footerActionText: {
              color: '#B0B0B0',
              fontWeight: 'bold', // Texto del pie de página en negrita
            },
            footerActionLink: {
              color: '#008CFF',
              fontWeight: 'bold', // Enlace del pie de página en negrita
              "&:hover": {
                color: '#00A0FF',
                textDecoration: 'none',
              }
            },
            dividerLine: {
                background: '#4F525B',
            },
            dividerText: {
                color: '#B0B0B0',
            },
            socialButtons: {
                background: '#3F4147',
                border: '1px solid #4F525B',
                borderRadius: '8px',
                "&:hover": {
                    background: '#4F525B',
                }
            },
            socialButtonsIconButton: {
                color: '#E0E0E0',
            },
            socialButtonsText: {
                color: '#E0E0E0',
            }
          },
          variables: {
            colorText: '#E0E0E0',
            colorPrimary: '#008CFF',
            colorBackground: '#1A1A1D',
            colorDanger: '#EF4444',
            colorSuccess: '#4CAF50',
          }
        }}
      />
    </div>
  );
}

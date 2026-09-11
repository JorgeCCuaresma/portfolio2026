  # Portfolio de Jorge Cuesta

  Portfolio personal de Jorge Cuesta, Backend Developer. La web presenta experiencia trabajando con APIs, microservicios, sistemas distribuidos y comunicación en tiempo real, con una interfaz inspirada en una terminal.

  ## Qué incluye

  - Presentación personal y experiencia.
  - Stack técnico organizado por categorías: backend, datos, mensajería, Azure y herramientas.
  - Proyectos y áreas de trabajo: machine backend, microservicios, comunicación real-time y herramientas internas.
  - Terminal interactiva con comandos como `ls`, `cd`, `cat`, `pwd`, `whoami` y `help`.
  - Formulario de contacto con validación y envío mediante EmailJS.
  - Diseño responsive para escritorio y móvil.

  ## Stack

  - React 19
  - TypeScript
  - Vite
  - React Hook Form
  - EmailJS
  - ESLint

  ## Requisitos

  - Node.js 20 o superior.
  - npm.

  ## Desarrollo local

  ```bash
  npm install
  npm run dev
  ```

  Vite mostrará en la terminal la URL local de desarrollo.

  ## Scripts

  | Comando | Descripción |
  | --- | --- |
  | `npm run dev` | Inicia el servidor de desarrollo con HMR. |
  | `npm run build` | Ejecuta TypeScript y genera la build de producción. |
  | `npm run lint` | Comprueba el código con ESLint. |
  | `npm run preview` | Sirve localmente la build generada. |

  ## Configuración del formulario

  El formulario de contacto utiliza [EmailJS](https://www.emailjs.com/). Para activarlo, añade estas variables en un archivo `.env` o `.env.local` en la raíz del proyecto:

  ```env
  VITE_EMAILJS_SERVICE_ID=tu_service_id
  VITE_EMAILJS_TEMPLATE_ID=tu_template_id
  VITE_EMAILJS_PUBLIC_KEY=tu_public_key
  ```

  Estas variables se leen en tiempo de compilación por Vite. Reinicia el servidor de desarrollo después de modificarlas. Ambos archivos están ignorados por Git; no subas sus valores al repositorio.

  ## Estructura principal

  ```text
  src/
  ├── components/       # Secciones y componentes de la interfaz
  │   ├── Hero.tsx
  │   ├── About.tsx
  │   ├── Stack.tsx
  │   ├── Projects.tsx
  │   ├── Contact.tsx
  │   ├── ContactFormModal.tsx
  │   └── Terminal.tsx
  ├── hooks/            # Hooks reutilizables
  ├── App.tsx           # Composición principal de la página
  ├── App.css           # Estilos de componentes
  └── index.css         # Tokens y estilos globales
  ```

  ## Build de producción

  ```bash
  npm run lint
  npm run build
  npm run preview
  ```

import type { Dispatch, SetStateAction } from "react";

interface FsNode {
  [key: string]: string | FsNode;
}

export const fileSystem: FsNode = {
  skills: {
    "backend.txt":
      "BACKEND\n───────\nTS TypeScript        — daily\n⬢ Node.js            — daily\n⚡ Express          — daily\n◈ REST APIs          — daily\n⇄ SSE                — used",

    "database.txt":
      "DATOS Y ALMACENAMIENTO\n───────────────────────\n🐘 PostgreSQL         — daily\n◇ TypeORM             — used\n🍃 MongoDB            — daily\n◆ Azure Table Storage — used\n▣ Azure Blob Storage  — used",

    "messaging.txt":
      "MENSAJERÍA\n───────────\n◌ MQTT                — used\n⇢ Azure Service Bus   — used\n◆ Azure Managed Redis — used",

    "cloud.txt":
      "CLOUD (AZURE)\n─────────────\n☁ Azure              — daily\n◇ Azure Kubernetes Service — used\n> Azure CLI           — used\n⟳ Azure Pipelines     — used\n🐳 Docker             — used",

    "tools.txt":
      "HERRAMIENTAS\n────────────\n⑂ Git                — daily\n▶ Postman            — daily\n✓ Jest / Vitest      — used",
  },
  "some-work": {
    "machine.md":
      "# Machine Backend\n\nBackend para software que se ejecuta\ndirectamente en máquinas.\n\nDesarrollo de APIs, validaciones de datos,\ncomunicación con servicios cloud y envío\nde información al frontend en tiempo real.\n\nTech: TypeScript, Node.js, Express,\nPostgreSQL, MQTT, SSE",
    "microservices.md":
      "# Microservices\n\nParticipación en la evolución de un backend\nmonolítico hacia una arquitectura basada\nen microservicios.\n\nTrabajo con nuevos servicios, modelos de datos,\ncomunicación entre componentes y decisiones\nsobre cómo estructurar los diferentes flujos.\n\nTech: TypeScript, Node.js, MongoDB,\nAzure Service Bus, Redis",
    "realtime.md":
      "# Real-time Communication\n\nDesarrollo de flujos para llevar información\ndesde las máquinas hasta el cliente.\n\nTrabajo con mensajería, almacenamiento y\ncomunicación en tiempo real, conectando\ndiferentes partes del sistema.\n\nTech: MQTT, Azure Service Bus,\nAzure Table Storage, Redis Pub/Sub, SSE",
    "internal.md":
      "# Internal Tool\n\nAplicación interna desarrollada desde cero\npara resolver una necesidad concreta del equipo.\n\nParticipación en el planteamiento de los flujos,\nel modelo de datos y el desarrollo de la aplicación.\n\nTech: TypeScript, Node.js, Express,\nPostgreSQL",
  },
  "about.txt":
    "JORGE CUESTA — Backend Developer\n═══════════════════════════════════\n\nSoy una persona curiosa, inquieta y con ganas\nde seguir aprendiendo constantemente.\n\nMe gusta entender cómo funcionan las cosas,\nenfrentarme a problemas nuevos y buscar la mejor\nmanera de resolverlos.\n\nDisfruto especialmente diseñando flujos completos,\nexplorando diferentes posibilidades y convirtiendo\nideas en algo real.\n\nTambién me gusta compartir ideas, contrastar\npuntos de vista y aprender de los demás.\n\n> keep_learning();",
  "contact.txt":
    "CONTACTO\n════════\n\n✉ Email:     jorgecuesta.90@gmail.com\n⑂ GitHub:     @jorgecuesta\nLinkedIn:     /in/jorgecuesta\n\nSi has llegado hasta aquí, ya tenemos algo en común.\nSi quieres hablar de tecnología, compartir ideas o simplemente\nsaludar, escríbeme."
};

export type Line = { prompt: string; text: string };

export function resolvePath(cwd: string, target: string): string {
  if (target === "/") return "/";
  if (target === "~") return "/";

  const base = target.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  const parts = target.split("/").filter(Boolean);

  for (const part of parts) {
    if (part === "..") base.pop();
    else if (part !== ".") base.push(part);
  }

  return "/" + base.join("/");
}

function getNode(path: string): string | FsNode | undefined {
  if (path === "/") return fileSystem;
  const parts = path.split("/").filter(Boolean);
  let current: string | FsNode = fileSystem;
  for (const part of parts) {
    if (typeof current === "string") return undefined;
    if (!(part in current)) return undefined;
    current = current[part];
  }
  return current;
}

export function executeCommand(
  input: string,
  cwd: string,
  setCwd: Dispatch<SetStateAction<string>>,
): Line[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const [cmd, ...args] = trimmed.split(/\s+/);
  const arg = args.join(" ");

  switch (cmd) {
    case "help":
      return [
        { prompt: "", text: "Comandos disponibles:" },
        { prompt: "", text: "  ls [dir]       — listar contenido" },
        { prompt: "", text: "  cd <dir>       — cambiar directorio" },
        { prompt: "", text: "  cat <archivo>  — ver contenido" },
        { prompt: "", text: "  pwd            — directorio actual" },
        { prompt: "", text: "  whoami         — sobre mí" },
        { prompt: "", text: "  clear          — limpiar terminal" },
        { prompt: "", text: "  help           — mostrar esta ayuda" },
      ];

    case "ls": {
      const target = arg ? resolvePath(cwd, arg) : cwd;
      const node = getNode(target);
      if (!node || typeof node === "string") {
        return [
          {
            prompt: "",
            text: `ls: no se puede acceder a '${arg || target}': No es un directorio`,
          },
        ];
      }
      const entries = Object.keys(node).map((key) =>
        typeof node[key] === "object" ? key + "/" : key,
      );
      return [{ prompt: "", text: entries.join("  ") }];
    }

    case "cd": {
      if (!arg || arg === "~") {
        setCwd("/");
        return [];
      }
      const target = resolvePath(cwd, arg);
      const node = getNode(target);
      if (!node || typeof node === "string") {
        return [{ prompt: "", text: `cd: ${arg}: No existe ese directorio` }];
      }
      setCwd(target);
      return [];
    }

    case "cat": {
      if (!arg) return [{ prompt: "", text: "cat: falta el archivo" }];
      const target = resolvePath(cwd, arg);
      const node = getNode(target);
      if (node === undefined) {
        return [{ prompt: "", text: `cat: ${arg}: No existe ese archivo` }];
      }
      if (typeof node !== "string") {
        return [{ prompt: "", text: `cat: ${arg}: Es un directorio` }];
      }
      return node.split("\n").map((line) => ({ prompt: "", text: line }));
    }

    case "pwd":
      return [{ prompt: "", text: cwd === "/" ? "~" : "~" + cwd }];

    case "whoami":
      return [
        { prompt: "", text: "Jorge Cuesta — Backend Developer" },
        { prompt: "", text: "Curious by nature. Backend by choice." },
        { prompt: "", text: "Always learning, always building." },
      ];

    case "clear":
      return [{ prompt: "__CLEAR__", text: "" }];

    default:
      return [
        { prompt: "", text: `${cmd}: comando no encontrado. Escribe 'help'` },
      ];
  }
}

export function getCompletions(input: string, cwd: string): string[] {
  const trimmed = input.trimStart();
  const parts = trimmed.split(/\s+/);

  if (parts.length <= 1) {
    const commands = ["ls", "cd", "cat", "pwd", "whoami", "clear", "help"];
    const partial = parts[0] || "";
    return commands.filter((c) => c.startsWith(partial) && c !== partial);
  }

  const partial = parts[parts.length - 1];
  const slashIdx = partial.lastIndexOf("/");
  const dirPart = slashIdx >= 0 ? partial.slice(0, slashIdx + 1) : "";
  const filePart = slashIdx >= 0 ? partial.slice(slashIdx + 1) : partial;

  const resolvedDir = dirPart ? resolvePath(cwd, dirPart) : cwd;
  const node = getNode(resolvedDir);

  if (!node || typeof node === "string") return [];

  return Object.keys(node)
    .filter((key) => key.startsWith(filePart) && key !== filePart)
    .map((key) => {
      const isDir = typeof node[key] === "object";
      return dirPart + key + (isDir ? "/" : "");
    });
}

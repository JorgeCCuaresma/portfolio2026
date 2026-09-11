import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { executeCommand, getCompletions, type Line } from "./terminalFs";

const introLines = [
    {
        prompt: "~$",
        command: "SELECT * FROM developer WHERE name = 'Jorge';",
        delay: 35,
    },
    { prompt: "", command: "", delay: 300 },

    { prompt: "", command: " field           | value", delay: 0 },
    { prompt: "", command: "-----------------+-------------", delay: 0 },
    { prompt: "", command: " role            | backend", delay: 0 },
    { prompt: "", command: " curiosity       | high", delay: 0 },
    { prompt: "", command: " problem solving | daily", delay: 0 },
    { prompt: "", command: " learning        | continuous", delay: 0 },
    { prompt: "", command: " coffee          | required", delay: 0 },

    { prompt: "", command: "", delay: 200 },

    {
        prompt: "~$",
        command: "npm run build",
        delay: 45,
    },
    { prompt: "", command: "Building something useful...", delay: 0 },
];

function buildPrompt(cwd: string) {
    return cwd === "/" ? "~$" : "~" + cwd + "$";
}

export default function Terminal() {
    const [history, setHistory] = useState<Line[]>(() => [
        ...introLines.map((line) => ({ prompt: line.prompt, text: line.command })),
        { prompt: "", text: "" },
        { prompt: "", text: "Terminal interactiva. Escribe 'help' para ver comandos." },
    ]);
    const [currentLine, setCurrentLine] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [animLines, setAnimLines] = useState<
        { prompt: string; text: string; typing: boolean }[]
    >([]);

    // Interactive state
    const animDone = currentLine >= introLines.length;
    const [input, setInput] = useState("");
    const [cwd, setCwd] = useState("/");
    const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLPreElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);
    const [suggestStyle, setSuggestStyle] = useState<React.CSSProperties>({});

    // === INTRO ANIMATION ===
    useEffect(() => {
        if (animDone) {
            return;
        }

        const line = introLines[currentLine];

        if (line.delay === 0) {
            const timer = setTimeout(() => {
                setAnimLines((prev) => [
                    ...prev,
                    { prompt: line.prompt, text: line.command, typing: false },
                ]);
                setCurrentLine((l) => l + 1);
            }, 0);
            return () => clearTimeout(timer);
        }

        if (charIndex < line.command.length) {
            const timer = setTimeout(() => {
                setAnimLines((prev) => {
                    if (charIndex === 0) {
                        return [
                            ...prev,
                            {
                                prompt: line.prompt,
                                text: line.command.slice(0, 1),
                                typing: true,
                            },
                        ];
                    }
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    updated[updated.length - 1] = {
                        ...last,
                        text: line.command.slice(0, charIndex + 1),
                    };
                    return updated;
                });
                setCharIndex((c) => c + 1);
            }, line.delay);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setAnimLines((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                updated[updated.length - 1] = { ...last, typing: false };
                return updated;
            });
            setCharIndex(0);
            setCurrentLine((l) => l + 1);
        }, 200);
        return () => clearTimeout(timer);
    }, [currentLine, charIndex, animDone]);

    const suggestions = useMemo(
        () => (
            !suggestionsDismissed && animDone && input.trim()
                ? getCompletions(input, cwd).slice(0, 5)
                : []
        ),
        [suggestionsDismissed, animDone, input, cwd],
    );

    // Scroll to bottom
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [history, animLines, suggestions]);

    // Decide suggestion position based on available space
    useLayoutEffect(() => {
        if (!suggestions.length || !inputRef.current || !terminalRef.current) return;

        const termRect = terminalRef.current.getBoundingClientRect();
        const inputRect = inputRef.current.getBoundingClientRect();

        const left = inputRect.left - termRect.left;
        const spaceAbove = inputRect.top - termRect.top;
        const sugHeight = suggestionsRef.current?.offsetHeight ?? 120;

        if (spaceAbove >= sugHeight + 4) {
            setSuggestStyle({
                left: `${left}px`,
                bottom: `${termRect.bottom - inputRect.top + 4}px`,
                top: "auto",
            });
        } else {
            setSuggestStyle({
                left: `${left}px`,
                top: `${inputRect.bottom - termRect.top + 4}px`,
                bottom: "auto",
            });
        }
    }, [suggestions]);

    const applySuggestion = useCallback(
        (suggestion: string) => {
            const parts = input.trimStart().split(/\s+/);
            parts[parts.length - 1] = suggestion;
            setInput(parts.join(" "));
            setSuggestionsDismissed(false);
            setSelectedSuggestion(0);
            inputRef.current?.focus();
        },
        [input],
    );

    const runCommand = useCallback(() => {
        const prompt = buildPrompt(cwd);
        const newLines: Line[] = [{ prompt: prompt, text: input }];

        if (input.trim() === "clear") {
            setHistory([]);
            setInput("");
            setSuggestionsDismissed(false);
            setSelectedSuggestion(0);
            if (input.trim()) {
                setCmdHistory((prev) => [...prev, input.trim()]);
            }
            setHistoryIdx(-1);
            return;
        }

        const output = executeCommand(input, cwd, setCwd);
        newLines.push(...output);

        setHistory((prev) => [...prev, ...newLines]);
        if (input.trim()) {
            setCmdHistory((prev) => [...prev, input.trim()]);
        }
        setHistoryIdx(-1);
        setInput("");
        setSuggestionsDismissed(false);
        setSelectedSuggestion(0);
    }, [input, cwd]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            runCommand();
        } else if (e.key === "Tab") {
            e.preventDefault();
            if (suggestions.length > 0) {
                applySuggestion(suggestions[selectedSuggestion]);
            }
        } else if (e.key === "ArrowDown") {
            if (suggestions.length > 0) {
                e.preventDefault();
                setSelectedSuggestion((s) =>
                    s < suggestions.length - 1 ? s + 1 : 0,
                );
            }
        } else if (e.key === "ArrowUp") {
            if (suggestions.length > 0) {
                e.preventDefault();
                setSelectedSuggestion((s) =>
                    s > 0 ? s - 1 : suggestions.length - 1,
                );
            } else if (cmdHistory.length > 0) {
                e.preventDefault();
                const newIdx =
                    historyIdx === -1
                        ? cmdHistory.length - 1
                        : Math.max(0, historyIdx - 1);
                setHistoryIdx(newIdx);
                setInput(cmdHistory[newIdx]);
            }
        } else if (e.key === "Escape") {
            setSuggestionsDismissed(true);
            setSelectedSuggestion(0);
        }
    };

    const focusInput = () => {
        if (animDone) inputRef.current?.focus();
    };

    return (
        <div
            className="terminal"
            ref={terminalRef}
            role="application"
            aria-label="Terminal interactiva del portfolio"
            onClick={focusInput}
        >
            <div className="terminal-header">
                <span className="terminal-dot terminal-dot--red" />
                <span className="terminal-dot terminal-dot--yellow" />
                <span className="terminal-dot terminal-dot--green" />
                <span className="terminal-title">jorge@portfolio:{cwd === "/" ? "~" : "~" + cwd}</span>
            </div>
            <pre className="terminal-body" ref={bodyRef}>
                {/* Intro animation */}
                {!animDone &&
                    animLines.map((line, i) => (
                        <div key={"a" + i} className="terminal-line">
                            {line.prompt && (
                                <span className="terminal-prompt">{line.prompt} </span>
                            )}
                            <span className={line.prompt ? "terminal-command" : "terminal-output"}>
                                {line.text}
                            </span>
                            {line.typing && <span className="terminal-cursor">▋</span>}
                        </div>
                    ))}

                {/* Interactive history */}
                {animDone &&
                    history.map((line, i) => (
                        <div key={"h" + i} className="terminal-line">
                            {line.prompt && (
                                <span className="terminal-prompt">{line.prompt} </span>
                            )}
                            <span className={line.prompt ? "terminal-command" : "terminal-output"}>
                                {line.text}
                            </span>
                        </div>
                    ))}

                {/* Input line */}
                {animDone && (
                    <div className="terminal-input-line">
                        <span className="terminal-prompt">{buildPrompt(cwd)} </span>
                        <div className="terminal-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                className="terminal-input"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setSuggestionsDismissed(false);
                                    setSelectedSuggestion(0);
                                }}
                                onKeyDown={handleKeyDown}
                                aria-label="Entrada de comandos de terminal"
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                )}
            </pre>

            {/* Suggestions rendered outside <pre> to avoid scroll clipping */}
            {animDone && suggestions.length > 0 && (
                <ul
                    ref={suggestionsRef}
                    className="terminal-suggestions"
                    style={suggestStyle}
                    role="listbox"
                    aria-label="Sugerencias de autocompletado"
                >
                    {suggestions.map((s, i) => (
                        <li
                            key={s}
                            role="option"
                            aria-selected={i === selectedSuggestion}
                            className={`terminal-suggestion ${i === selectedSuggestion ? "terminal-suggestion--active" : ""}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                applySuggestion(s);
                            }}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

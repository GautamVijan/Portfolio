import React, { useState, useEffect, useRef } from 'react';

const StarryBackground = React.memo(() => {
  return (
    <>
      {/* Static Stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Shooting Stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`shooting-star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
          style={{
            top: `${Math.random() * 50}%`,
            left: '-2px',
            animationDuration: '4s',
            animationDelay: `${i * 8}s`,
            animationIterationCount: 'infinite'
          }}
        />
      ))}
    </>
  );
});

const BigBangEffect = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      {/* Central explosion */}
      <div className="absolute w-4 h-4 bg-white rounded-full animate-explosion-core" />
      
      {/* Initial blast wave */}
      <div className="absolute w-8 h-8 bg-yellow-500 rounded-full animate-blast-wave opacity-75" />
      
      {/* Outer energy ring */}
      <div className="absolute w-12 h-12 border-4 border-orange-500 rounded-full animate-energy-ring" />
      
      {/* Fast particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`fast-${i}`}
          className="absolute w-1 h-8 bg-gradient-to-t from-red-500 via-yellow-400 to-transparent animate-fast-particle"
          style={{
            transform: `rotate(${i * (360 / 20)}deg)`,
          }}
        />
      ))}
      
      {/* Medium particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`medium-${i}`}
          className="absolute w-2 h-2 rounded-full animate-medium-particle"
          style={{
            backgroundColor: ['#ff4444', '#ffbb33', '#ff8800'][i % 3],
            transform: `rotate(${i * (360 / 30)}deg)`,
            animationDelay: `${Math.random() * 0.2}s`
          }}
        />
      ))}
      
      {/* Slow debris */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`debris-${i}`}
          className="absolute w-1 h-1 bg-orange-300 rounded-full animate-slow-particle opacity-80"
          style={{
            transform: `rotate(${i * (360 / 40)}deg)`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to my portfolio terminal!' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
  const [showBigBang, setShowBigBang] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const commands = {
    help: [
      'Available commands:',
      '- about: Display personal information',
      '- skills: Show technical skills',
      '- projects: List of project highlights',
      '- contact: Get contact information',
      '- clear: Clear the terminal screen',
      '- bigbang: Watch the universe explode! 🌌'
    ],
    about: [
      'Name: Gautam Vijan',
      'Role: STEM Mentor',
      'Location: Pune, India',
      "I'm a passionate developer with expertise in web technologies and a love for creating innovative solutions."
    ],
    skills: [
      'Languages: JavaScript, Python, TypeScript',
      'Frontend: React, Vue, Next.js',
      'Backend: Node.js, Express, Django',
      'Tools: Git, Docker, AWS',
      'Database: MongoDB, PostgreSQL'
    ],
    projects: [
      '1. Smart Home Automation Platform',
      '   - IoT-based home control system',
      '   - Technologies: React, Node.js, MQTT',
      '',
      '2. E-commerce Analytics Dashboard',
      '   - Real-time sales and user behavior tracking',
      '   - Technologies: Vue.js, D3.js, Firebase'
    ],
    contact: [
      'Email: gtmvijan@gmail.com',
      'LinkedIn: /in/gautamvijan',
      'GitHub: @gautamvijan',
      'Phone: 8279436251'
    ],
    bigbang: ['🌌 Initiating Big Bang sequence...'],
    clear: 'clear'
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return [];
    }
    if (trimmedCmd === 'bigbang') {
      setShowBigBang(true);
      return commands.bigbang;
    }
    if (commands[trimmedCmd]) {
      return commands[trimmedCmd];
    }
    return trimmedCmd === '' 
      ? [] 
      : [`Command not found: ${trimmedCmd}. Type "help" for available commands.`];
  };

  const processCommand = () => {
    if (input.trim() === '') return;
  
    const trimmedCmd = input.trim().toLowerCase();
  
    if (trimmedCmd === 'clear') {
      setHistory([]); 
      setInput('');  
      setCommandHistoryIndex(-1);
      return;
    }
  
    const newCommandHistory = [...commandHistory];
    if (input.trim() !== '') {
      newCommandHistory.push(input.trim());
      setCommandHistory(newCommandHistory);
    }
  
    const newHistory = [
      ...history,
      { type: 'input', text: `> ${input}` },
      ...handleCommand(input).map(line => ({ type: 'output', text: line }))
    ];
  
    setHistory(newHistory);
    setInput('');
    setCommandHistoryIndex(-1);
  
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistoryIndex < commandHistory.length - 1) {
        const newIndex = commandHistoryIndex + 1;
        setCommandHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistoryIndex > -1) {
        const newIndex = commandHistoryIndex - 1;
        setCommandHistoryIndex(newIndex);
        setInput(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-900 text-green-400 font-mono flex flex-col overflow-hidden">
      <StarryBackground />
      {showBigBang && <BigBangEffect onComplete={() => setShowBigBang(false)} />}
      
      {/* Terminal Header */}
      <div className="bg-gray-800 p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-300">Terminal - Gautam Vijan</div>
        <div></div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto z-10">
        {history.map((item, index) => (
          <div
            key={index}
            className={`${
              item.type === "input" ? "text-yellow-300" : "text-green-400"
            }`}
          >
            {item.text}
          </div>
        ))}
        <div className="flex items-center">
          <span className="mr-2">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none text-green-400 w-full"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default App;
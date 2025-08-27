import { Module, UserProgress, LessonNote } from "@/types/lesson";

// Mock data for demonstration
export const getMockModules = (): Module[] => [
  {
    id: "embedded-fundamentals",
    title: "Embedded Systems Fundamentals",
    description: "Learn the basics of embedded programming and microcontrollers",
    completed: false,
    progress: 45,
    unlocked: true,
    lessons: [
      {
        id: "intro-microcontrollers",
        moduleId: "embedded-fundamentals",
        title: "Introduction to Microcontrollers",
        description: "Understand what microcontrollers are and how they work",
        estimatedTime: 25,
        difficulty: "beginner",
        completed: true,
        progress: 100,
        xpReward: 50,
        subLessons: [
          {
            id: "what-is-mcu",
            title: "What is a Microcontroller?",
            content: `# What is a Microcontroller?

A **microcontroller** is a compact integrated circuit designed to govern a specific operation in an embedded system. It contains a processor core, memory, and programmable input/output peripherals.

## Key Components

### CPU (Central Processing Unit)
The brain of the microcontroller that executes instructions and performs calculations.

### Memory
- **Flash Memory**: Stores your program code
- **RAM**: Temporary storage for variables and data
- **EEPROM**: Non-volatile storage for settings

### Peripherals
- GPIO pins for digital input/output
- ADC for analog-to-digital conversion
- Timers for precise timing operations
- Communication interfaces (UART, I2C, SPI)

## Common Applications
- Home appliances (washing machines, microwaves)
- Automotive systems (engine control, airbags)
- IoT devices (smart sensors, wearables)
- Industrial automation

Understanding these fundamentals is crucial for embedded systems development.`,
            estimatedTime: 10,
            completed: true,
            videoUrl: "https://example.com/mcu-intro.mp4"
          },
          {
            id: "mcu-architecture",
            title: "MCU Architecture",
            content: `# Microcontroller Architecture

Understanding the internal structure of microcontrollers helps you write more efficient code.

## Harvard vs Von Neumann Architecture

### Harvard Architecture
- Separate memory spaces for instructions and data
- Allows simultaneous access to both
- Used in most modern microcontrollers

### Von Neumann Architecture
- Single memory space for both instructions and data
- Simpler but potentially slower

## Memory Organization
\`\`\`c
// Memory regions in a typical microcontroller
Flash Memory:    0x08000000 - 0x0807FFFF  (512KB)
SRAM:           0x20000000 - 0x2001FFFF  (128KB)
Peripherals:    0x40000000 - 0x5FFFFFFF
\`\`\`

This layout is crucial for understanding memory mapping and programming.`,
            estimatedTime: 15,
            completed: true,
            quiz: {
              id: "mcu-arch-quiz",
              question: "What is the main advantage of Harvard architecture?",
              options: [
                "Uses less memory",
                "Allows simultaneous access to instructions and data",
                "Is simpler to implement",
                "Costs less to manufacture"
              ],
              correctAnswer: 1,
              explanation: "Harvard architecture allows the CPU to fetch instructions and access data simultaneously, improving performance."
            }
          }
        ]
      },
      {
        id: "gpio-programming",
        moduleId: "embedded-fundamentals",
        title: "GPIO Programming",
        description: "Learn to control digital pins for input and output operations",
        estimatedTime: 30,
        difficulty: "beginner",
        completed: false,
        progress: 60,
        xpReward: 75,
        subLessons: [
          {
            id: "gpio-basics",
            title: "GPIO Basics",
            content: `# GPIO (General Purpose Input/Output)

GPIO pins are the primary way to interface with the external world in embedded systems.

## Pin Modes

### Output Mode
Configure a pin to drive external devices:

\`\`\`c
// STM32 HAL example
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_5;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

// Turn LED on
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);
\`\`\`

### Input Mode
Read external signals:

\`\`\`c
// Configure pin as input with pull-up
GPIO_InitStruct.Pin = GPIO_PIN_0;
GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
GPIO_InitStruct.Pull = GPIO_PULLUP;
HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

// Read button state
GPIO_PinState buttonState = HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_0);
\`\`\`

## Common GPIO Operations
- Digital output (LED control)
- Digital input (button reading)
- PWM output (motor control)
- Interrupt input (event detection)`,
            estimatedTime: 20,
            completed: true,
            resources: [
              {
                id: "gpio-datasheet",
                title: "STM32 GPIO Reference",
                type: "pdf",
                url: "/resources/stm32-gpio-reference.pdf",
                size: "2.3 MB"
              },
              {
                id: "gpio-examples",
                title: "GPIO Code Examples",
                type: "code",
                url: "/resources/gpio-examples.zip",
                size: "156 KB"
              }
            ]
          },
          {
            id: "advanced-gpio",
            title: "Advanced GPIO Features",
            content: `# Advanced GPIO Features

Beyond basic input/output, GPIO pins offer advanced functionality.

## Alternate Functions
GPIO pins can serve multiple purposes:

\`\`\`c
// Configure pin for UART TX
GPIO_InitStruct.Pin = GPIO_PIN_2;
GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
GPIO_InitStruct.Alternate = GPIO_AF7_USART2;
HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
\`\`\`

## Interrupt Configuration
Handle external events efficiently:

\`\`\`c
// Configure external interrupt
GPIO_InitStruct.Pin = GPIO_PIN_13;
GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
GPIO_InitStruct.Pull = GPIO_PULLUP;
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

// Enable interrupt
HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
\`\`\`

## Best Practices
- Always configure pull-up/pull-down for inputs
- Use appropriate drive strength for outputs
- Consider power consumption in pin configuration
- Group related pins for efficient register access`,
            estimatedTime: 10,
            completed: false,
            quiz: {
              id: "advanced-gpio-quiz",
              question: "When should you use pull-up resistors on GPIO inputs?",
              options: [
                "Only with buttons",
                "To prevent floating inputs",
                "To increase current",
                "Only in output mode"
              ],
              correctAnswer: 1,
              explanation: "Pull-up resistors prevent inputs from floating, ensuring a defined logic level when no external signal is applied."
            }
          }
        ]
      }
    ]
  },
  {
    id: "rtos-advanced",
    title: "Real-Time Operating Systems",
    description: "Master RTOS concepts for complex embedded applications",
    completed: false,
    progress: 0,
    unlocked: false,
    lessons: [
      {
        id: "rtos-intro",
        moduleId: "rtos-advanced",
        title: "RTOS Introduction",
        description: "Understand when and why to use an RTOS",
        estimatedTime: 35,
        difficulty: "intermediate",
        completed: false,
        progress: 0,
        xpReward: 100,
        subLessons: []
      }
    ]
  }
];

export const getUserProgress = (): UserProgress => {
  const stored = localStorage.getItem("user_progress");
  if (stored) {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      lastStudyDate: new Date(parsed.lastStudyDate)
    };
  }
  
  return {
    currentModuleId: "embedded-fundamentals",
    currentLessonId: "gpio-programming",
    currentSubLessonId: "advanced-gpio",
    totalXP: 125,
    badges: ["First Steps", "GPIO Master"],
    notes: [],
    completedLessons: ["intro-microcontrollers"],
    streakDays: 3,
    lastStudyDate: new Date()
  };
};

export const saveUserProgress = (progress: UserProgress): void => {
  localStorage.setItem("user_progress", JSON.stringify(progress));
};

export const addNote = (note: Omit<LessonNote, "id" | "timestamp">): void => {
  const progress = getUserProgress();
  const newNote: LessonNote = {
    ...note,
    id: Date.now().toString(),
    timestamp: new Date()
  };
  progress.notes.push(newNote);
  saveUserProgress(progress);
};

export const completeSubLesson = (moduleId: string, lessonId: string, subLessonId: string): void => {
  const progress = getUserProgress();
  // Update completion status and XP
  progress.totalXP += 25; // XP for completing a sub-lesson
  progress.lastStudyDate = new Date();
  
  // Update streak
  const today = new Date();
  const lastStudy = new Date(progress.lastStudyDate);
  const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    progress.streakDays += 1;
  } else if (diffDays > 1) {
    progress.streakDays = 1;
  }
  
  saveUserProgress(progress);
};
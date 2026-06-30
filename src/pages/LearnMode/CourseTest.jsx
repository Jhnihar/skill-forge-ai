import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { callGemini } from '../../services/gemini';

const STATIC_QUESTIONS = {
  python: {
    easy: [
      { q: 'What is the correct way to print in Python?', options: ['print()', 'console.log()', 'echo', 'printf'], correct: 0 },
      { q: 'Which data type stores whole numbers?', options: ['float', 'int', 'string', 'bool'], correct: 1 },
      { q: 'Which symbol starts a comment in Python?', options: ['//', '#', '/*', '--'], correct: 1 },
      { q: 'What is the output type of input() in Python?', options: ['int', 'float', 'string', 'bool'], correct: 2 },
      { q: 'Which keyword is used to define a class?', options: ['def', 'class', 'struct', 'object'], correct: 1 },
      { q: 'How do you create a variable named x with value 5?', options: ['x = 5', 'var x = 5', 'int x = 5', 'let x = 5'], correct: 0 },
      { q: 'Which operator is used for exponentiation?', options: ['^', '**', 'exp()', '%%'], correct: 1 },
      { q: 'Which keyword is used to import a module?', options: ['include', 'import', 'require', 'using'], correct: 1 },
      { q: 'What does the modulo operator (%) return?', options: ['Quotient', 'Remainder', 'Power', 'Square root'], correct: 1 },
      { q: 'Which of these is a valid Python boolean value?', options: ['true', 'True', 'TRUE', '1=True'], correct: 1 },
      { q: 'How do you check the type of a variable?', options: ['typeof(x)', 'type(x)', 'x.type()', 'gettype(x)'], correct: 1 },
      { q: 'Which loop runs a fixed number of times using a range?', options: ['while loop', 'for loop', 'do-while loop', 'repeat loop'], correct: 1 }
    ],
    medium: [
      { q: 'How do you create a list in Python?', options: ['[]', '{}', '()', '<>'], correct: 0 },
      { q: 'What keyword defines a function?', options: ['func', 'def', 'function', 'define'], correct: 1 },
      { q: 'Which method adds an item to the end of a list?', options: ['push()', 'append()', 'add()', 'insert()'], correct: 1 },
      { q: 'How do you access the second item in a list?', options: ['list[0]', 'list[1]', 'list[2]', 'list(1)'], correct: 1 },
      { q: 'What does len() return?', options: ['The last item', 'The total number of items', 'A sorted list', 'The data type'], correct: 1 },
      { q: 'Which data structure uses key-value pairs?', options: ['list', 'tuple', 'dictionary', 'set'], correct: 2 },
      { q: 'What does the slice list[1:3] return?', options: ['Items at index 1 and 2', 'Items at index 1, 2, and 3', 'Item at index 3 only', 'Items at index 0 and 1'], correct: 0 },
      { q: 'Which keyword handles exceptions in Python?', options: ['catch', 'except', 'rescue', 'error'], correct: 1 },
      { q: 'How do you create a tuple?', options: ['[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '<1, 2, 3>'], correct: 2 },
      { q: 'What is the difference between a list and a tuple?', options: ['No difference', 'Tuples are mutable, lists are not', 'Lists are mutable, tuples are not', 'Tuples can only store numbers'], correct: 2 },
      { q: 'Which method removes whitespace from both ends of a string?', options: ['trim()', 'strip()', 'clean()', 'remove()'], correct: 1 },
      { q: 'What does the "in" keyword check for in a list?', options: ['Data type', 'Membership', 'Length', 'Index position'], correct: 1 }
    ],
    hard: [
      { q: 'What is list comprehension?', options: ['A loop', 'A concise way to create lists', 'A function', 'An error'], correct: 1 },
      { q: 'What does *args do?', options: ['Multiplication', 'Variable arguments', 'Pointer', 'Comment'], correct: 1 },
      { q: 'What is a generator in Python?', options: ['A file writer', 'An iterator that yields values lazily', 'A loop optimizer', 'A list shortcut'], correct: 1 },
      { q: 'What does the with statement help manage?', options: ['Loops', 'Exceptions only', 'Context managers and resources', 'Imports'], correct: 2 },
      { q: 'What is the purpose of __init__ in a class?', options: ['Destroy objects', 'Initialize object state', 'Import modules', 'Create variables globally'], correct: 1 },
      { q: 'What does **kwargs allow a function to accept?', options: ['Positional arguments only', 'A variable number of keyword arguments', 'A single dictionary argument', 'No arguments'], correct: 1 },
      { q: 'What is a decorator in Python?', options: ['A CSS-like styling tool', 'A function that modifies another function', 'A type of loop', 'A comment syntax'], correct: 1 },
      { q: 'What does the Global Interpreter Lock (GIL) restrict?', options: ['Memory allocation', 'True parallel execution of threads', 'Variable scope', 'Module imports'], correct: 1 },
      { q: 'What is the difference between deep copy and shallow copy?', options: ['No difference', 'Shallow copy duplicates nested objects too', 'Deep copy duplicates nested objects, shallow copy does not', 'Deep copy only works on strings'], correct: 2 },
      { q: 'What does the @staticmethod decorator do?', options: ['Makes a method run faster', 'Defines a method that does not access instance or class state', 'Converts a method into a property', 'Prevents method overriding'], correct: 1 },
      { q: 'What is a Python lambda function?', options: ['A class method', 'An anonymous, single-expression function', 'A built-in module', 'A type of loop'], correct: 1 },
      { q: 'What does the yield keyword do inside a function?', options: ['Stops execution permanently', 'Returns a value and pauses state for the next call', 'Raises an exception', 'Imports a module'], correct: 1 }
    ]
  },
  html: {
    easy: [
      { q: 'What does HTML stand for?', options: ['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], correct: 0 },
      { q: 'Which tag creates a paragraph?', options: ['<p>', '<para>', '<text>', '<pg>'], correct: 0 },
      { q: 'Which tag creates the largest heading?', options: ['<h6>', '<head>', '<h1>', '<title>'], correct: 2 },
      { q: 'Which tag inserts an image?', options: ['<img>', '<image>', '<src>', '<pic>'], correct: 0 },
      { q: 'Which tag makes a line break?', options: ['<lb>', '<br>', '<break>', '<newline>'], correct: 1 },
      { q: 'Which tag is used to create an unordered list?', options: ['<ol>', '<ul>', '<list>', '<li>'], correct: 1 },
      { q: 'Which tag defines the document title shown in the browser tab?', options: ['<header>', '<head>', '<title>', '<meta>'], correct: 2 },
      { q: 'Which tag creates a table row?', options: ['<td>', '<tr>', '<table>', '<row>'], correct: 1 },
      { q: 'What is the correct file extension for an HTML file?', options: ['.html', '.htm1', '.hml', '.tag'], correct: 0 },
      { q: 'Which tag is used to create a button?', options: ['<button>', '<btn>', '<click>', '<input-button>'], correct: 0 },
      { q: 'Which tag defines a list item?', options: ['<item>', '<li>', '<list>', '<ul>'], correct: 1 },
      { q: 'Which attribute opens a link in a new tab?', options: ['target="_blank"', 'new="tab"', 'open="newtab"', 'tab="new"'], correct: 0 }
    ],
    medium: [
      { q: 'How do you create a link?', options: ['<a>', '<link>', '<href>', '<url>'], correct: 0 },
      { q: 'Which attribute specifies image source?', options: ['href', 'src', 'link', 'url'], correct: 1 },
      { q: 'Which tag groups navigation links?', options: ['<section>', '<nav>', '<menu>', '<aside>'], correct: 1 },
      { q: 'Which element is best for a self-contained article?', options: ['<article>', '<div>', '<span>', '<main>'], correct: 0 },
      { q: 'What is the purpose of the alt attribute?', options: ['Style the image', 'Provide alternate text', 'Set image size', 'Create a caption'], correct: 1 },
      { q: 'Which input type validates an email address format?', options: ['type="text"', 'type="email"', 'type="mail"', 'type="validate"'], correct: 1 },
      { q: 'What does the required attribute do on a form input?', options: ['Hides the field', 'Prevents form submission until the field is filled', 'Auto-fills the field', 'Disables the field'], correct: 1 },
      { q: 'Which tag is used to embed a video?', options: ['<media>', '<video>', '<embed-video>', '<movie>'], correct: 1 },
      { q: 'What is the purpose of the <form> action attribute?', options: ['Styles the form', 'Specifies where form data is sent', 'Validates inputs', 'Sets the form language'], correct: 1 },
      { q: 'Which tag is used to define a dropdown list?', options: ['<dropdown>', '<select>', '<list>', '<menu>'], correct: 1 },
      { q: 'What does the colspan attribute do in a table?', options: ['Adds a column border', 'Merges a cell across multiple columns', 'Sets column color', 'Hides a column'], correct: 1 },
      { q: 'Which meta tag is used to make a page responsive on mobile?', options: ['<meta name="responsive">', '<meta name="viewport" content="width=device-width">', '<meta charset="mobile">', '<meta name="mobile-friendly">'], correct: 1 }
    ],
    hard: [
      { q: 'What is semantic HTML?', options: ['Styled HTML', 'HTML with meaning', 'JavaScript in HTML', 'CSS framework'], correct: 1 },
      { q: 'Which tag defines navigation?', options: ['<navigation>', '<nav>', '<menu>', '<links>'], correct: 1 },
      { q: 'What does the <section> element represent?', options: ['A generic wrapper only', 'The document header', 'A thematic grouping of content', 'A footer area'], correct: 2 },
      { q: 'Which tag is most appropriate for the main content of a page?', options: ['<main>', '<aside>', '<header>', '<footer>'], correct: 0 },
      { q: 'Why use label with form inputs?', options: ['For styling only', 'To improve accessibility and input focus', 'To submit forms', 'To hide placeholders'], correct: 1 },
      { q: 'What is the purpose of ARIA attributes?', options: ['Add animations', 'Improve accessibility for assistive technologies', 'Speed up page load', 'Validate forms'], correct: 1 },
      { q: 'What does the defer attribute do on a script tag?', options: ['Deletes the script', 'Delays script execution until after HTML parsing', 'Runs the script immediately', 'Minifies the script'], correct: 1 },
      { q: 'What is the difference between <div> and <span>?', options: ['No difference', 'div is inline, span is block-level', 'div is block-level, span is inline', 'span cannot hold text'], correct: 2 },
      { q: 'What does the <template> tag do?', options: ['Renders content immediately', 'Holds client-side content that is not rendered until activated by script', 'Defines a page layout', 'Imports external HTML files'], correct: 1 },
      { q: 'Why are data-* attributes used?', options: ['To style elements', 'To store custom data private to the page or application', 'To create new HTML tags', 'To validate forms'], correct: 1 },
      { q: 'What is the shadow DOM used for?', options: ['Adding shadows to elements visually', 'Encapsulating a component\'s markup and styles from the rest of the page', 'Improving SEO', 'Compressing HTML'], correct: 1 },
      { q: 'What does the rel="noopener" attribute prevent on a link?', options: ['SEO penalties', 'The new page from accessing the opening window via window.opener', 'Caching', 'Broken links'], correct: 1 }
    ]
  },
  css: {
    easy: [
      { q: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 0 },
      { q: 'How do you select an ID?', options: ['.id', '#id', 'id', '*id'], correct: 1 },
      { q: 'Which property changes text color?', options: ['font-style', 'text-color', 'color', 'foreground'], correct: 2 },
      { q: 'Which property changes background color?', options: ['background-color', 'bg-color', 'color-background', 'fill'], correct: 0 },
      { q: 'Which symbol is used for a class selector?', options: ['#', '.', ':', '*'], correct: 1 },
      { q: 'Which property controls text size?', options: ['text-size', 'font-size', 'size', 'text-style'], correct: 1 },
      { q: 'Which property makes text bold?', options: ['font-weight', 'text-bold', 'bold', 'font-style'], correct: 0 },
      { q: 'How do you link an external CSS file in HTML?', options: ['<style src="file.css">', '<link rel="stylesheet" href="file.css">', '<css>file.css</css>', '<import>file.css</import>'], correct: 1 },
      { q: 'Which property adds space outside an element\'s border?', options: ['padding', 'margin', 'spacing', 'border-spacing'], correct: 1 },
      { q: 'Which property controls the visibility of an element while still occupying space?', options: ['display: none', 'visibility: hidden', 'opacity: none', 'hide: true'], correct: 1 },
      { q: 'How do you make text italic?', options: ['font-style: italic', 'text-style: italic', 'font: italic', 'text-decoration: italic'], correct: 0 },
      { q: 'Which property changes the font family?', options: ['font-type', 'font-family', 'text-font', 'family'], correct: 1 }
    ],
    medium: [
      { q: 'What is flexbox used for?', options: ['Colors', 'Layout', 'Fonts', 'Borders'], correct: 1 },
      { q: 'How do you center a div?', options: ['center: true', 'align: center', 'margin: auto', 'position: center'], correct: 2 },
      { q: 'Which property controls the spacing inside an element?', options: ['margin', 'padding', 'border-spacing', 'gap'], correct: 1 },
      { q: 'Which display value enables flex layout?', options: ['display: block', 'display: grid', 'display: flex', 'display: inline'], correct: 2 },
      { q: 'Which unit is relative to the root font size?', options: ['px', 'rem', 'em', '%'], correct: 1 },
      { q: 'Which property is used to position an element relative to its normal position?', options: ['position: absolute', 'position: relative', 'position: fixed', 'position: static'], correct: 1 },
      { q: 'What does justify-content do in a flex container?', options: ['Aligns items vertically', 'Aligns items along the main axis', 'Sets font alignment', 'Changes text direction'], correct: 1 },
      { q: 'Which pseudo-element is used to insert content before an element?', options: ['::before', ':before-content', '::pre', ':first'], correct: 0 },
      { q: 'What does the transition property animate?', options: ['Only colors', 'Changes between CSS property values smoothly over time', 'Page navigation', 'Image loading'], correct: 1 },
      { q: 'Which property creates rounded corners?', options: ['corner-radius', 'border-radius', 'round-corner', 'corner-round'], correct: 1 },
      { q: 'What does the CSS Grid property grid-template-columns define?', options: ['Row heights', 'The number and size of columns in a grid', 'Font spacing', 'Element stacking order'], correct: 1 },
      { q: 'Which property hides overflowing content and adds a scrollbar?', options: ['overflow: hidden', 'overflow: scroll', 'overflow: auto', 'clip: scroll'], correct: 2 }
    ],
    hard: [
      { q: 'What is specificity?', options: ['CSS speed', 'Rule priority', 'Color intensity', 'Font weight'], correct: 1 },
      { q: 'What does z-index control?', options: ['Width', 'Height', 'Stack order', 'Opacity'], correct: 2 },
      { q: 'What does the box model include?', options: ['Text only', 'Content, padding, border, margin', 'Only margin and padding', 'Grid and flex items'], correct: 1 },
      { q: 'What is the purpose of media queries?', options: ['Add animations', 'Apply styles based on device conditions', 'Compress CSS', 'Create variables'], correct: 1 },
      { q: 'Which pseudo-class targets an element when hovered?', options: ['::hover', ':hover', ':active-hover', ':focus-hover'], correct: 1 },
      { q: 'What is the difference between em and rem units?', options: ['No difference', 'em is relative to parent, rem is relative to root', 'rem is relative to parent, em is relative to root', 'Both are fixed units'], correct: 1 },
      { q: 'What does the CSS cascade determine when multiple rules conflict?', options: ['Random rule wins', 'Specificity, source order, and importance decide which rule applies', 'The shortest rule wins', 'The last loaded file always wins'], correct: 1 },
      { q: 'What does will-change hint to the browser?', options: ['An element will be deleted', 'An element is about to change, allowing the browser to optimize rendering', 'A CSS variable will update', 'A media query will trigger'], correct: 1 },
      { q: 'What is the purpose of CSS custom properties (variables)?', options: ['To define animations only', 'To store reusable values referenced with var()', 'To replace JavaScript variables', 'To minify CSS'], correct: 1 },
      { q: 'What does the clamp() function do in CSS?', options: ['Rounds numbers', 'Sets a value that scales between a minimum and maximum based on a preferred value', 'Hides overflow', 'Clips images'], correct: 1 },
      { q: 'How does grid-template-areas help with layout?', options: ['It sets font areas', 'It lets you name and visually arrange grid regions as a template', 'It only works with flexbox', 'It hides grid lines'], correct: 1 },
      { q: 'What is the difference between visibility: hidden and display: none?', options: ['No difference', 'visibility: hidden still occupies layout space, display: none removes it entirely', 'display: none keeps space, visibility: hidden removes it', 'Both remove the element from the DOM'], correct: 1 }
    ]
  }
};

const getStaticQuestion = (courseName, difficulty) => {
  const courseQuestions = STATIC_QUESTIONS[courseName]?.[difficulty] || STATIC_QUESTIONS.python.easy;
  return courseQuestions[Math.floor(Math.random() * courseQuestions.length)];
};

const normalizeQuestion = (response) => {
  if (!response || typeof response !== 'object') return null;

  const { question, options, correctAnswerIndex, explanation } = response;

  if (typeof question !== 'string' || !Array.isArray(options) || typeof correctAnswerIndex !== 'number') {
    return null;
  }

  if (options.length !== 4 || options.some(option => typeof option !== 'string')) {
    return null;
  }

  if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
    return null;
  }

  return {
    q: question,
    options,
    correct: correctAnswerIndex,
    explanation: typeof explanation === 'string' ? explanation : ''
  };
};

const generateQuestionWithAI = async (courseName, difficulty, previousQuestions = []) => {
  const prompt = `You are an adaptive test generator for a learning app.
Return ONLY JSON in this exact shape:
{  "question": "...",  "options": ["A", "B", "C", "D"],  "correctAnswerIndex": 0,  "explanation": "short explanation of the correct answer"}

Course: ${courseName}
Difficulty: ${difficulty}
Previous questions and outcomes:
${previousQuestions.length > 0
    ? previousQuestions.map((item, index) => `${index + 1}. ${item.question} | answeredCorrectly: ${item.answeredCorrectly}`).join('\n')
    : 'None'}

Do not repeat any question from the previous questions list.
Do not paraphrase an earlier question into a near-duplicate.
If you cannot create a new question, return a different one from the same topic.

Requirements:
- Avoid repeating previous questions.
- Keep the question appropriate for the difficulty level.
- Return valid JSON only.
- The options array must contain exactly four strings.
`;

  try {
    const response = await callGemini(prompt, { json: true });
    const normalized = normalizeQuestion(response);

    if (normalized) {
      return normalized;
    }

    console.error('Invalid Gemini question payload:', response);
  } catch (error) {
    console.error('AI question generation failed:', error);
    throw error;
  }
};

const CourseTest = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  
  const [stage, setStage] = useState('pre-test'); // pre-test, learning, final-test, results
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const stageRef = useRef(stage);
  const difficultyRef = useRef(difficulty);
  const totalQuestionsRef = useRef(totalQuestions);
  const questionHistoryRef = useRef(questionHistory);
  const askedQuestionsRef = useRef(new Set());

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    totalQuestionsRef.current = totalQuestions;
  }, [totalQuestions]);

  useEffect(() => {
    questionHistoryRef.current = questionHistory;
  }, [questionHistory]);

  // Learning resources - real video and documentation links
  const learningResources = {
    python: {
      videos: [
        {
          title: 'Python for Beginners - Full Course',
          url: 'https://www.youtube.com/watch?v=rfscVS0vtbw'
        },
        {
          title: 'Python Tutorial - Programming Tutorial',
          url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc'
        },
        {
          title: 'Learn Python - Full Course for Beginners',
          url: 'https://www.youtube.com/watch?v=eWRfhZUzrAc'
        }
      ],
      docs: [
        {
          title: 'Official Python Tutorial',
          url: 'https://docs.python.org/3/tutorial/'
        },
        {
          title: 'Python Documentation',
          url: 'https://docs.python.org/3/'
        }
      ]
    },
    html: {
      videos: [
        {
          title: 'HTML Full Course - Build a Website Tutorial',
          url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg'
        },
        {
          title: 'HTML Tutorial for Beginners',
          url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU'
        },
        {
          title: 'HTML Crash Course For Absolute Beginners',
          url: 'https://www.youtube.com/watch?v=UB1O30fR-EE'
        }
      ],
      docs: [
        {
          title: 'MDN HTML Documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
        },
        {
          title: 'HTML Element Reference',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element'
        }
      ]
    },
    css: {
      videos: [
        {
          title: 'CSS Crash Course For Absolute Beginners',
          url: 'https://www.youtube.com/watch?v=yfoY53QXEnI'
        },
        {
          title: 'CSS Tutorial - Zero to Hero',
          url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc'
        },
        {
          title: 'Learn CSS in 20 Minutes',
          url: 'https://www.youtube.com/watch?v=1PnVor36_40'
        }
      ],
      docs: [
        {
          title: 'MDN CSS Documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
        },
        {
          title: 'CSS Reference Guide',
          url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference'
        }
      ]
    }
  };

  useEffect(() => {
    if (stage === 'pre-test' || stage === 'final-test') {
      loadNewQuestion();
    }
  }, [stage]);

  const getUniqueStaticQuestion = (courseName, difficulty, excludedQuestions = []) => {
    const courseQuestions = STATIC_QUESTIONS[courseName]?.[difficulty] || STATIC_QUESTIONS.python.easy;
    const availableQuestions = courseQuestions.filter((question) => !excludedQuestions.includes(question.q));

    if (availableQuestions.length > 0) {
      return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }

    return courseQuestions[Math.floor(Math.random() * courseQuestions.length)];
  };

  const loadNewQuestion = async () => {
    setIsLoadingQuestion(true);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowFeedback(false);

    const previousQuestions = questionHistoryRef.current.slice(-20);
    const excludedQuestions = Array.from(new Set([
      ...previousQuestions.map((item) => item.question),
      ...Array.from(askedQuestionsRef.current)
    ]));

    try {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const question = await generateQuestionWithAI(courseName, difficultyRef.current, previousQuestions);

        if (question && !askedQuestionsRef.current.has(question.q) && !excludedQuestions.includes(question.q)) {
          askedQuestionsRef.current.add(question.q);
          setCurrentQuestion(question);
          return;
        }
      }

      const fallback = getUniqueStaticQuestion(courseName, difficultyRef.current, excludedQuestions);
      askedQuestionsRef.current.add(fallback.q);
      setCurrentQuestion({
        q: fallback.q,
        options: fallback.options,
        correct: fallback.correct,
        explanation: ''
      });
    } catch (error) {
      const fallback = getUniqueStaticQuestion(courseName, difficultyRef.current, excludedQuestions);
      askedQuestionsRef.current.add(fallback.q);
      setCurrentQuestion({
        q: fallback.q,
        options: fallback.options,
        correct: fallback.correct,
        explanation: ''
      });
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correct;
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    setQuestionHistory(prev => {
      const nextHistory = [
        ...prev,
      {
        question: currentQuestion.q,
        answeredCorrectly: isCorrect
      }
      ];

      questionHistoryRef.current = nextHistory;
      return nextHistory;
    });

    if (isCorrect) {
      setScore(prev => prev + 1);
      setWrongCount(0);
      
      // Increase difficulty on correct answer
      if (difficultyRef.current === 'easy') setDifficulty('medium');
      else if (difficultyRef.current === 'medium') setDifficulty('hard');
      
      setTimeout(() => {
        if (stageRef.current === 'pre-test' && totalQuestionsRef.current >= 3) {
          setStage('learning');
        } else if (stageRef.current === 'final-test' && totalQuestionsRef.current >= 8) {
          calculateResults();
        } else {
          loadNewQuestion();
        }
      }, 1500);
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      
      // Exit test if wrong twice at same level (pre-test only)
      if (stageRef.current === 'pre-test' && newWrongCount >= 2) {
        setTimeout(() => setStage('learning'), 1500);
      } else {
        setTimeout(() => loadNewQuestion(), 1500);
      }
    }
  };

  const calculateResults = async () => {
    const accuracy = Math.round((score / totalQuestions) * 100);
    
    try {
      // Store completion in Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        completedCourses: arrayUnion({
          courseName: courseName,
          accuracy: accuracy,
          completedAt: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error saving course completion:', error);
    }

    setStage('results');
    setAnswers({ accuracy, score, totalQuestions });
  };

  const getProgressPercentage = () => {
    const max = stage === 'pre-test' ? 4 : 9;
    return Math.min(100, Math.round(((totalQuestions) / max) * 100));
  };

  if (stage === 'learning') {
    return (
      <div className="min-h-screen p-8 md:p-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-extrabold mb-3 capitalize font-display">{courseName} Learning Hub</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Review these curated visual tutorials and documentation guides to level up before taking the final test.
            </p>
          </motion.div>
          
          {/* Video Tutorials Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-6 border-slate-200/50 dark:border-slate-800/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📹</span>
              <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">Video Tutorials</h2>
            </div>
            <div className="space-y-3.5">
              {learningResources[courseName]?.videos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-50/50 to-pink-50/30 dark:from-red-950/10 dark:to-pink-950/10 border border-red-200/60 dark:border-red-900/40 hover:shadow-md transition-all duration-350 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">▶️</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{video.title}</span>
                  </div>
                  <span className="text-xs font-bold px-4 py-2 bg-red-600 text-white rounded-xl shadow group-hover:bg-red-700 transition-colors whitespace-nowrap">
                    Watch Video
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Documentation Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8 border-slate-200/50 dark:border-slate-800/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📚</span>
              <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">Official Guides</h2>
            </div>
            <div className="space-y-3.5">
              {learningResources[courseName]?.docs.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10 border border-blue-200/60 dark:border-blue-900/40 hover:shadow-md transition-all duration-355 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">📖</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{doc.title}</span>
                  </div>
                  <span className="text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-xl shadow group-hover:bg-blue-700 transition-colors whitespace-nowrap">
                    Read Docs
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 font-display">Ready for the final test?</h3>
              <p className="mb-6 opacity-90 text-sm leading-relaxed max-w-xl">
                The final test contains 9 adaptive questions. Scoring 85%+ accuracy will verify your competency and unlock applications for real job postings.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStage('final-test');
                  setScore(0);
                  setTotalQuestions(0);
                  setDifficulty('easy');
                  setQuestionHistory([]);
                  questionHistoryRef.current = [];
                  askedQuestionsRef.current.clear();
                }}
                className="bg-white text-primary-600 px-7 py-3.5 rounded-2xl font-bold text-sm shadow hover:bg-slate-50 transition-colors"
              >
                Start Final Test →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (stage === 'results') {
    const { accuracy } = answers;
    const passed = accuracy >= 85;

    return (
      <div className="min-h-screen p-8 flex items-center justify-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="card max-w-2xl w-full text-center border-slate-200/50 dark:border-slate-800/50 p-10 shadow-2xl backdrop-blur-xl"
        >
          <div className="text-7xl mb-6 animate-bounce">{passed ? '🏆' : '📚'}</div>
          
          <h1 className="text-4xl font-extrabold mb-3 font-display">
            {passed ? 'Competency Verified!' : 'Practice Makes Perfect!'}
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm">
            {passed 
              ? `You scored high accuracy and unlocked the certificate of achievement for ${courseName}.`
              : `You achieved a score on the test. Review the recommended notes and tutorials to try again.`}
          </p>
          
          <div className="my-10 inline-flex flex-col items-center justify-center p-6 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800 rounded-3xl min-w-[200px]">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-300 font-display">
              {accuracy}%
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Accuracy Score
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ({score} of {totalQuestions} correct)
            </p>
          </div>

          {passed && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/55 rounded-2xl p-5 mb-8 text-sm"
            >
              <h3 className="font-bold text-green-700 dark:text-green-400 mb-1 flex items-center justify-center gap-1.5 font-display text-base">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Certificate Awarded!
              </h3>
              <p className="text-green-600 dark:text-green-300 leading-relaxed text-xs">
                Recruiters searching for {courseName} skills will see your verified status badge. You can now submit applications on the JobList tab.
              </p>
            </motion.div>
          )}

          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/courses')} className="btn-secondary px-6 py-3 text-xs">
              Back to Courses
            </button>
            {passed && (
              <button onClick={() => navigate('/jobs')} className="btn-primary px-6 py-3 text-xs shadow-md">
                Browse Job Openings
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Pre-test or Final Test UI
  return (
    <div className="p-8 md:p-12 flex items-center justify-center min-h-full relative z-10">
      <div className="card max-w-2xl w-full border-slate-200/50 dark:border-slate-800/50 shadow-xl p-8">
        {/* HEADER INDICATOR */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 capitalize">
              {stage === 'pre-test' ? 'Pre-Knowledge Test' : 'Final Certification Test'}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{courseName} subject</p>
          </div>
          <span className="px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200/50 dark:border-primary-900/40 rounded-xl text-xs font-bold uppercase tracking-wider">
            {difficulty}
          </span>
        </div>

        {/* PULSING ANIMATED PROGRESS BAR */}
        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 mb-8 relative overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-primary-500 to-accent-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {isLoadingQuestion && !currentQuestion ? (
            <motion.div
              key="question-loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Generating next question...</p>
            </motion.div>
          ) : currentQuestion && (
            <motion.div
              key={currentQuestion.q}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 leading-normal">{currentQuestion.q}</p>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    
                    let btnStyle = 'border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30';
                    if (showFeedback) {
                      if (index === currentQuestion.correct) {
                        btnStyle = 'border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400';
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-750 dark:text-red-400';
                      } else {
                        btnStyle = 'border-slate-200 dark:border-slate-850 opacity-40';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/25 text-primary-600 dark:text-primary-400 shadow-sm';
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={!showFeedback ? { scale: 1.008 } : {}}
                        whileTap={!showFeedback ? { scale: 0.99 } : {}}
                        onClick={() => !showFeedback && setSelectedAnswer(index)}
                        disabled={showFeedback}
                        className={`w-full p-4 text-left rounded-2xl border text-sm font-semibold transition-all duration-200 flex items-center justify-between ${btnStyle} ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span>{option}</span>
                        {showFeedback && index === currentQuestion.correct && (
                          <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                        )}
                        {showFeedback && isSelected && index !== currentQuestion.correct && (
                          <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {showFeedback && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-2xl border font-bold text-sm text-center mb-5 flex items-center justify-center gap-2 ${
                    selectedAnswer === currentQuestion.correct
                      ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400'
                      : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                  }`}
                >
                  <span>{selectedAnswer === currentQuestion.correct ? '🎉 Correct Answer!' : '❌ Incorrect Selection'}</span>
                </motion.div>
              )}

              {!showFeedback && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3.5 text-xs font-bold tracking-wide mt-2"
                >
                  Submit Answer
                </motion.button>
              )}

              <div className="mt-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Question {totalQuestions + 1}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseTest;

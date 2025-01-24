import React, { useState } from 'react';
import {
  Brain,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mic,
  Send,
  Play,
  PenTool,
  Loader2,
} from 'lucide-react';
import { getAITutorResponse, type Solution } from './services/aiTutor';
import { MathFormula } from './components/MathFormula';

type Topic = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

type Step = 'login' | 'topics' | 'question' | 'solution' | 'practice';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('login');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [question, setQuestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<Solution | null>(null);

  const handleGetSolution = async () => {
    if (!selectedTopic || !question) return;
    
    setIsLoading(true);
    try {
      const aiSolution = await getAITutorResponse(question, selectedTopic.title);
      setSolution(aiSolution);
      setCurrentStep('solution');
    } catch (error) {
      console.error('Failed to get solution:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username === 'user' && formData.password === 'password') {
      setLoginError('');
      setCurrentStep('topics');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const topics: Topic[] = [
    {
      id: 'linear-equations',
      title: 'Linear Equations',
      description: 'Master the fundamentals of solving equations with one variable',
      icon: <PenTool className="w-6 h-6" />,
    },
    {
      id: 'quadratic-equations',
      title: 'Quadratic Equations',
      description: 'Learn to solve and graph quadratic equations',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: 'geometry',
      title: 'Geometry',
      description: 'Explore shapes, angles, and spatial relationships',
      icon: <Play className="w-6 h-6" />,
    },
   
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 'login':
        return (
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <Brain className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to MathMinds AI</h2>
              <p className="mt-2 text-gray-600">Sign in to start your learning journey</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Password"
                  />
                </div>
              </div>
              {loginError && (
                <p className="text-red-500 text-sm text-center">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </form>
          </div>
        );

      case 'topics':
        return (
          <div className="max-w-4xl w-full space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Choose a Topic</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setCurrentStep('question');
                  }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
                >
                  <div className="text-blue-600 mb-4">{topic.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                  <p className="text-gray-600">{topic.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      // case 'question':
      //   return (
      //     <div className="max-w-2xl w-full space-y-6">
      //       <div className="flex items-center space-x-4 mb-8">
      //         <button
      //           onClick={() => setCurrentStep('topics')}
      //           className="text-gray-600 hover:text-gray-900"
      //         >
      //           <ArrowLeft className="w-6 h-6" />
      //         </button>
      //         <h2 className="text-3xl font-bold text-gray-900">{selectedTopic?.title}</h2>
      //       </div>
      //       <div className="bg-white p-6 rounded-lg shadow-md">
      //         <h3 className="text-xl font-semibold mb-4">Ask Your Question</h3>
      //         <textarea
      //           value={question}
      //           onChange={(e) => setQuestion(e.target.value)}
      //           className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //           placeholder="Type your question here..."
      //         />
      //         <div className="mt-4 flex justify-between items-center">
      //           <button
      //             onClick={() => setIsRecording(!isRecording)}
      //             className={`p-2 rounded-full ${
      //               isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
      //             } hover:bg-gray-200`}
      //           >
      //             <Mic className="w-6 h-6" />
      //           </button>
      //           <button
      //             onClick={() => setCurrentStep('solution')}
      //             className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      //           >
      //             <span>Get Solution</span>
      //             <Send className="w-4 h-4" />
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //   );
      case 'question':
        return (
          <div className="max-w-2xl w-full space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={() => setCurrentStep('topics')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold text-gray-900">{selectedTopic?.title}</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Ask Your Question</h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your question here..."
              />
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-full ${
                    isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  } hover:bg-gray-200`}
                >
                  <Mic className="w-6 h-6" />
                </button>
                <button
                  onClick={handleGetSolution}
                  disabled={isLoading || !question}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Getting Solution...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Solution</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

        case 'solution':
          return (
            <div className="max-w-3xl w-full space-y-6">
              <div className="flex items-center space-x-4 mb-8">
                <button
                  onClick={() => setCurrentStep('question')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-gray-900">Step-by-Step Solution</h2>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Question:</h3>
                  <p className="text-gray-600">{question}</p>
                </div>
                {solution && (
                  <>
                    <div className="space-y-4">
                      {solution.steps.map((step, index) => (
                        <div key={index} className="border-l-4 border-blue-600 pl-4">
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <p className="text-gray-600">{step.explanation}</p>
                          {step.formula && <MathFormula formula={step.formula} />}
                        </div>
                      ))}
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Final Answer:</h4>
                        <p className="text-blue-700 font-medium">{solution.finalAnswer}</p>
                      </div>
                      {solution.relatedConcepts.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-2">Related Concepts:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {solution.relatedConcepts.map((concept, index) => (
                              <li key={index} className="text-gray-600">{concept}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="mt-8">
                      <button
                        onClick={() => setCurrentStep('practice')}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                      >
                        <span>Practice Similar Problems</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );

      case 'practice':
        return (
          <div className="max-w-3xl w-full space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={() => setCurrentStep('solution')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold text-gray-900">Practice Exercise</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Solve the equation:</h3>
              <p className="text-2xl text-center my-6">3x + 4 = 16</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your answer"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  <span>Check Answer</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep('topics')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Choose New Topic
                </button>
                <button className="text-blue-600 hover:text-blue-700">
                  Next Problem
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MathMinds AI</span>
          </div>
          {currentStep !== 'login' && (
            <button
              onClick={() => setCurrentStep('login')}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          )}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}

export default App;
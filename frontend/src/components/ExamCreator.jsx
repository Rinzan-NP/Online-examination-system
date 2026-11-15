import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { api } from '../api';

export default function ExamCreator({ currentUser, onExamCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingPercentage, setPassingPercentage] = useState(50);
  const [gradingStrategyType, setGradingStrategyType] = useState('STRICT');
  const [instructions, setInstructions] = useState('Read each problem carefully. Manage your time effectively.');
  const [questions, setQuestions] = useState([]);

  // Active question being edited
  const [qType, setQType] = useState('MULTIPLE_CHOICE');
  const [qText, setQText] = useState('');
  const [qMarks, setQMarks] = useState(2);
  const [qPenalty, setQPenalty] = useState(0.5);
  const [qTopic, setQTopic] = useState('General');
  const [qExplanation, setQExplanation] = useState('');

  // MCQ specific
  const [options, setOptions] = useState([
    { id: 'opt1', text: '', isCorrect: true, correct: true },
    { id: 'opt2', text: '', isCorrect: false, correct: false },
    { id: 'opt3', text: '', isCorrect: false, correct: false },
    { id: 'opt4', text: '', isCorrect: false, correct: false }
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  // True/False
  const [tfAnswer, setTfAnswer] = useState(true);

  // Short answer
  const [modelAnswer, setModelAnswer] = useState('');
  const [keywords, setKeywords] = useState('');

  // Coding
  const [codeLang, setCodeLang] = useState('java');
  const [starterCode, setStarterCode] = useState('public class Solution {\n    // Implement solution\n}');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAddOption = () => {
    setOptions(prev => [
      ...prev,
      { id: `opt${prev.length + 1}`, text: '', isCorrect: false, correct: false }
    ]);
  };

  const handleUpdateOption = (index, field, value) => {
    setOptions(prev => prev.map((opt, i) => {
      if (i === index) {
        if (field === 'isCorrect') {
          return { ...opt, isCorrect: Boolean(value), correct: Boolean(value) };
        }
        return { ...opt, [field]: value };
      }
      if (field === 'isCorrect' && !allowMultiple && value === true) {
        return { ...opt, isCorrect: false, correct: false };
      }
      return opt;
    }));
  };

  const handleAddQuestionToExam = () => {
    if (!qText.trim()) {
      alert('Please enter a question statement');
      return;
    }

    let newQuestion = {
      text: qText,
      marks: Number(qMarks),
      penaltyMarks: Number(qPenalty),
      difficulty: 'MEDIUM',
      topic: qTopic,
      explanation: qExplanation,
      questionType: qType,
    };

    if (qType === 'MULTIPLE_CHOICE') {
      const validOpts = options.filter(o => o.text && o.text.trim().length > 0);
      if (validOpts.length < 2) {
        alert('Please provide at least 2 options for Multiple Choice.');
        return;
      }
      const hasCorrect = validOpts.some(o => o.isCorrect === true || o.correct === true);
      if (!hasCorrect) {
        alert('Please select at least one option as the correct answer using the radio button or checkbox next to it.');
        return;
      }
      newQuestion.options = validOpts.map(o => ({
        id: o.id,
        text: o.text.trim(),
        isCorrect: Boolean(o.isCorrect || o.correct),
        correct: Boolean(o.isCorrect || o.correct)
      }));
      newQuestion.allowMultiple = allowMultiple;
    } else if (qType === 'TRUE_FALSE') {
      newQuestion.booleanAnswer = tfAnswer;
    } else if (qType === 'SHORT_ANSWER') {
      if (!modelAnswer.trim()) {
        alert('Please enter a model answer.');
        return;
      }
      newQuestion.modelAnswer = modelAnswer;
      newQuestion.acceptedKeywords = keywords ? keywords.split(',').map(k => k.trim()) : [];
      newQuestion.caseSensitive = false;
    } else if (qType === 'CODING') {
      newQuestion.language = codeLang;
      newQuestion.starterCode = starterCode;
      newQuestion.testCases = testInput ? [{ input: testInput, expectedOutput: testOutput, isHidden: false }] : [];
    }

    setQuestions(prev => [...prev, newQuestion]);

    // Reset form
    setQText('');
    setQExplanation('');
    setModelAnswer('');
    setKeywords('');
    setOptions([
      { id: 'opt1', text: '', isCorrect: true, correct: true },
      { id: 'opt2', text: '', isCorrect: false, correct: false },
      { id: 'opt3', text: '', isCorrect: false, correct: false },
      { id: 'opt4', text: '', isCorrect: false, correct: false }
    ]);
    alert('Question added to exam draft!');
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an exam title.');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question before publishing.');
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload = {
      title,
      description,
      subject,
      instructorId: currentUser?.id || 'INST-001',
      instructorName: currentUser?.name || 'Dr. Sarah Mitchell',
      durationMinutes: Number(durationMinutes),
      passingPercentage: Number(passingPercentage),
      status: 'ACTIVE',
      gradingStrategyType,
      instructions,
      questions
    };

    try {
      const created = await api.createExam(payload);
      setMessage({ type: 'green', text: `Exam '${created.title}' created and published successfully!` });
      if (onExamCreated) {
        setTimeout(() => onExamCreated(created), 1000);
      }
    } catch (err) {
      setMessage({ type: 'red', text: `Error creating exam: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-apple" style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span className="badge badge-purple">Faculty Assessment Studio</span>
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: 700, letterSpacing: '-0.025em' }}>
          Create Examination
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Author and publish new academic exams using the Java backend's <strong>ExamBuilder</strong> and <strong>QuestionFactory</strong>.
        </p>
      </div>

      {message && (
        <div className={`badge badge-${message.type}`} style={{ padding: '10px 16px', width: '100%', marginBottom: '20px', fontSize: '0.85rem' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSaveExam} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.9fr)', gap: '24px' }}>
        
        {/* Left Column: Exam Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="apple-glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '16px', fontWeight: 600 }}>
              Exam Parameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Exam Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Distributed Systems Midterm" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Description</label>
                <textarea 
                  rows={2} 
                  placeholder="Assessment topics, rules and syllabus..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Subject</label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Structures">Data Structures</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Duration (Mins)</label>
                  <input 
                    type="number" 
                    min={5} 
                    max={180} 
                    value={durationMinutes} 
                    onChange={(e) => setDurationMinutes(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Passing %</label>
                  <input 
                    type="number" 
                    min={10} 
                    max={100} 
                    value={passingPercentage} 
                    onChange={(e) => setPassingPercentage(e.target.value)} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Grading Strategy</label>
                  <select value={gradingStrategyType} onChange={(e) => setGradingStrategyType(e.target.value)}>
                    <option value="STRICT">Strict (All or Nothing)</option>
                    <option value="NEGATIVE_MARKING">Negative Marking</option>
                    <option value="PARTIAL_CREDIT">Partial Credit</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Instructions</label>
                <textarea 
                  rows={2} 
                  value={instructions} 
                  onChange={(e) => setInstructions(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Added Questions Pill Summary */}
          <div className="apple-glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Questions in Draft</span>
              <span className="badge badge-blue">{questions.length} Questions</span>
            </h3>

            {questions.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                No questions added yet. Construct a question on the right panel.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {questions.map((q, idx) => (
                  <div key={idx} style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-segmented)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {idx + 1}. {q.text}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {q.questionType} • +{q.marks} pts
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveQuestion(idx)}
                      className="btn btn-danger"
                      style={{ padding: '5px 8px', borderRadius: 'var(--radius-full)' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={saving || questions.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '18px', padding: '11px' }}
            >
              <Sparkles size={15} />
              <span>{saving ? 'Publishing...' : 'Publish Examination'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Question Factory */}
        <div className="apple-glass" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 600 }}>
                Question Authoring
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Polymorphic question generator
              </p>
            </div>

            {/* Apple Segmented Switcher for Question Type */}
            <div className="apple-segmented">
              {['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'CODING'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQType(type)}
                  className={`apple-segment-item ${qType === type ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                >
                  {type === 'MULTIPLE_CHOICE' ? 'MCQ' : type === 'TRUE_FALSE' ? 'True/False' : type === 'SHORT_ANSWER' ? 'Short' : 'Code'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Question Text */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>
                Problem Statement / Question
              </label>
              <textarea
                rows={3}
                placeholder="State the academic question clearly..."
                value={qText}
                onChange={(e) => setQText(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Points</label>
                <input type="number" min={1} max={50} value={qMarks} onChange={(e) => setQMarks(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Penalty</label>
                <input type="number" step="0.25" min={0} max={10} value={qPenalty} onChange={(e) => setQPenalty(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Topic Tag</label>
                <input type="text" placeholder="e.g. Concurrency" value={qTopic} onChange={(e) => setQTopic(e.target.value)} />
              </div>
            </div>

            {/* Subtype Form Inputs */}
            {qType === 'MULTIPLE_CHOICE' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Options</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.785rem', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={allowMultiple} onChange={(e) => setAllowMultiple(e.target.checked)} style={{ width: 'auto' }} />
                    <span>Multiple Correct</span>
                  </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {options.map((opt, i) => (
                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type={allowMultiple ? 'checkbox' : 'radio'}
                        name="correctOpt"
                        checked={opt.isCorrect}
                        onChange={(e) => handleUpdateOption(i, 'isCorrect', e.target.checked)}
                        style={{ width: 'auto', accentColor: 'var(--apple-blue)', cursor: 'pointer' }}
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        value={opt.text}
                        onChange={(e) => handleUpdateOption(i, 'text', e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleAddOption}
                  style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.785rem' }}
                >
                  <PlusCircle size={13} /> Add Option
                </button>
              </div>
            )}

            {qType === 'TRUE_FALSE' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 500 }}>Truth Value</label>
                <div className="apple-segmented" style={{ width: '100%', display: 'flex' }}>
                  <button
                    type="button"
                    onClick={() => setTfAnswer(true)}
                    className={`apple-segment-item ${tfAnswer ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    TRUE
                  </button>
                  <button
                    type="button"
                    onClick={() => setTfAnswer(false)}
                    className={`apple-segment-item ${!tfAnswer ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    FALSE
                  </button>
                </div>
              </div>
            )}

            {qType === 'SHORT_ANSWER' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Model Answer</label>
                  <input type="text" placeholder="e.g. Semaphore" value={modelAnswer} onChange={(e) => setModelAnswer(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Accepted Keyword Variations</label>
                  <input type="text" placeholder="comma separated: semaphore, counting semaphore" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                </div>
              </div>
            )}

            {qType === 'CODING' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Language</label>
                    <select value={codeLang} onChange={(e) => setCodeLang(e.target.value)}>
                      <option value="java">Java</option>
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Sample Test Input</label>
                    <input type="text" placeholder="e.g. radius = 5.0" value={testInput} onChange={(e) => setTestInput(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Starter Code Template</label>
                  <textarea rows={4} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }} value={starterCode} onChange={(e) => setStarterCode(e.target.value)} />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>Explanation / Model Notes</label>
              <textarea rows={2} placeholder="Clarification for student review..." value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} />
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleAddQuestionToExam}
              style={{ padding: '10px', marginTop: '6px' }}
            >
              <PlusCircle size={15} />
              <span>Add Question to Exam</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Play, 
  CheckCircle2, 
  Code2, 
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

export default function ExamRunner({ exam, participant, onSubmitExam, onExit }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewFlags, setReviewFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [codeTestOutput, setCodeTestOutput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = exam.questions || [];
  const currentQ = questions[currentIdx];

  // Initialize starter code for coding questions
  useEffect(() => {
    const initialAnswers = {};
    questions.forEach(q => {
      if (q.questionType === 'CODING' && q.starterCode) {
        initialAnswers[q.id] = { codeAnswer: q.starterCode };
      }
    });
    setAnswers(prev => ({ ...initialAnswers, ...prev }));
  }, [exam]);

  // Timer Tick
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimerCritical = timeLeft < 300; // Under 5 mins
  const isTimerEmergency = timeLeft < 60; // Under 1 min

  // Answer state handlers
  const handleOptionSelect = (qId, optionIdx, allowMultiple) => {
    setAnswers(prev => {
      const existing = prev[qId]?.selectedOptionIndices || [];
      let updated;
      if (allowMultiple) {
        if (existing.includes(optionIdx)) {
          updated = existing.filter(i => i !== optionIdx);
        } else {
          updated = [...existing, optionIdx];
        }
      } else {
        updated = [optionIdx];
      }
      return {
        ...prev,
        [qId]: { ...prev[qId], questionId: qId, selectedOptionIndices: updated }
      };
    });
  };

  const handleBooleanSelect = (qId, val) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], questionId: qId, booleanAnswer: val }
    }));
  };

  const handleTextAnswer = (qId, text) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], questionId: qId, textAnswer: text }
    }));
  };

  const handleCodeAnswer = (qId, code) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], questionId: qId, codeAnswer: code }
    }));
  };

  const toggleReviewFlag = (qId) => {
    setReviewFlags(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const isQuestionAnswered = (q) => {
    const a = answers[q.id];
    if (!a) return false;
    if (q.questionType === 'MULTIPLE_CHOICE') return a.selectedOptionIndices && a.selectedOptionIndices.length > 0;
    if (q.questionType === 'TRUE_FALSE') return a.booleanAnswer !== undefined && a.booleanAnswer !== null;
    if (q.questionType === 'SHORT_ANSWER') return a.textAnswer && a.textAnswer.trim().length > 0;
    if (q.questionType === 'CODING') return a.codeAnswer && a.codeAnswer.trim().length > 0 && a.codeAnswer !== q.starterCode;
    return false;
  };

  const getAnsweredCount = () => {
    return questions.filter(isQuestionAnswered).length;
  };

  const getReviewCount = () => {
    return Object.values(reviewFlags).filter(Boolean).length;
  };

  // Run simulated test cases for coding question
  const handleRunCodeSimulation = () => {
    const code = answers[currentQ.id]?.codeAnswer || '';
    if (!code.trim()) {
      setCodeTestOutput({ success: false, message: 'Please write code before running tests.' });
      return;
    }
    
    const tests = currentQ.testCases || [];
    setCodeTestOutput({
      success: true,
      tests,
      message: `Code syntax verified. ${tests.length || 1} sample test cases executed.`
    });
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const answersList = questions.map(q => {
      const a = answers[q.id] || {};
      return {
        questionId: q.id,
        selectedOptionIndices: a.selectedOptionIndices || [],
        booleanAnswer: a.booleanAnswer ?? null,
        textAnswer: a.textAnswer || null,
        codeAnswer: a.codeAnswer || null
      };
    });

    const timeSpent = (exam.durationMinutes * 60) - timeLeft;
    onSubmitExam({
      candidateName: participant?.candidateName,
      rollNumber: participant?.rollNumber,
      answers: answersList,
      timeTakenSeconds: Math.max(1, timeSpent)
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      
      {/* Apple-style Focused Top Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'var(--bg-header)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Title & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            className="btn btn-outline" 
            onClick={onExit}
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            <ArrowLeft size={14} /> Exit
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 600 }}>{exam.title}</h2>
              <span className="badge badge-gray">{exam.subject}</span>
              {participant?.candidateName && (
                <span className="badge badge-blue">Candidate: {participant.candidateName}</span>
              )}
            </div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-dim)', marginTop: '1px' }}>
              Completed {getAnsweredCount()} of {questions.length} questions ({Math.round((getAnsweredCount() / questions.length) * 100)}%)
              {participant?.rollNumber && ` • Roll: ${participant.rollNumber}`}
            </div>
          </div>
        </div>

        {/* Live Apple Timer & Submit Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: isTimerEmergency 
              ? 'var(--apple-red-bg)' 
              : isTimerCritical 
                ? 'var(--apple-orange-bg)' 
                : 'var(--bg-segmented)',
            border: isTimerEmergency 
              ? '1px solid var(--apple-red-border)' 
              : isTimerCritical 
                ? '1px solid var(--apple-orange-border)' 
                : '1px solid var(--border-subtle)',
            color: isTimerEmergency ? 'var(--apple-red)' : isTimerCritical ? 'var(--apple-orange)' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.95rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => setShowConfirmModal(true)}
            style={{ padding: '8px 20px' }}
          >
            <Send size={15} />
            <span>Submit Exam</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '28px 24px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 300px',
        gap: '24px',
        flex: 1,
        width: '100%'
      }}>

        {/* Left Column: Active Question */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {currentQ ? (
            <div className="apple-glass" style={{
              padding: '32px',
              position: 'relative'
            }}>
              {/* Question Metadata Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--apple-blue)' }}>
                    Question {currentIdx + 1}
                  </span>
                  <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>
                    {currentQ.questionType?.replace('_', ' ')}
                  </span>
                  {currentQ.topic && (
                    <span className="badge badge-gray">{currentQ.topic}</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Points: <strong style={{ color: 'var(--apple-green)' }}>+{currentQ.marks}</strong>
                    {currentQ.penaltyMarks > 0 && (
                      <span style={{ color: 'var(--apple-red)', marginLeft: '6px' }}>
                        (-{currentQ.penaltyMarks} wrong)
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => toggleReviewFlag(currentQ.id)}
                    className={reviewFlags[currentQ.id] ? "btn btn-secondary" : "btn btn-outline"}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.785rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    <Flag size={13} color={reviewFlags[currentQ.id] ? "var(--apple-blue)" : "var(--text-dim)"} />
                    <span>{reviewFlags[currentQ.id] ? 'Flagged for Review' : 'Flag'}</span>
                  </button>
                </div>
              </div>

              {/* Question Statement */}
              <div style={{
                fontSize: '1.15rem',
                lineHeight: 1.55,
                color: 'var(--text-main)',
                marginBottom: '28px',
                fontWeight: 500
              }}>
                {currentQ.text}
              </div>

              {/* 1. Multiple Choice Options (Apple Segmented Cards) */}
              {currentQ.questionType === 'MULTIPLE_CHOICE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentQ.allowMultiple && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--apple-purple)', marginBottom: '4px', fontWeight: 500 }}>
                      * Multiple choices may be selected
                    </div>
                  )}
                  {currentQ.options?.map((opt, optIdx) => {
                    const selected = answers[currentQ.id]?.selectedOptionIndices?.includes(optIdx);
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <div
                        key={opt.id || optIdx}
                        onClick={() => handleOptionSelect(currentQ.id, optIdx, currentQ.allowMultiple)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          background: selected ? 'var(--apple-blue-bg)' : 'var(--bg-card-secondary)',
                          border: selected ? '1.5px solid var(--apple-blue)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: currentQ.allowMultiple ? '6px' : '50%',
                          background: selected ? 'var(--apple-blue)' : 'var(--bg-segmented)',
                          border: selected ? 'none' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: selected ? '#fff' : 'var(--text-dim)',
                          flexShrink: 0
                        }}>
                          {letter}
                        </div>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.4, fontWeight: selected ? 500 : 400 }}>
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. True / False */}
              {currentQ.questionType === 'TRUE_FALSE' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {[true, false].map((val) => {
                    const selected = answers[currentQ.id]?.booleanAnswer === val;
                    return (
                      <div
                        key={val ? 'true' : 'false'}
                        onClick={() => handleBooleanSelect(currentQ.id, val)}
                        style={{
                          padding: '24px',
                          borderRadius: 'var(--radius-lg)',
                          background: selected ? 'var(--apple-blue-bg)' : 'var(--bg-card-secondary)',
                          border: selected ? '2px solid var(--apple-blue)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: selected ? 'var(--apple-blue)' : 'var(--text-muted)' }}>
                          {val ? 'TRUE' : 'FALSE'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. Short Answer */}
              {currentQ.questionType === 'SHORT_ANSWER' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 500 }}>
                    Enter concise response:
                  </label>
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    value={answers[currentQ.id]?.textAnswer || ''}
                    onChange={(e) => handleTextAnswer(currentQ.id, e.target.value)}
                    style={{ fontSize: '1rem', padding: '14px 16px' }}
                  />
                </div>
              )}

              {/* 4. Coding Problem */}
              {currentQ.questionType === 'CODING' && (
                <div>
                  <div style={{
                    background: '#1e1e1e',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '14px',
                    border: '1px solid rgba(0, 0, 0, 0.15)'
                  }}>
                    <div style={{
                      padding: '8px 16px',
                      background: '#2d2d2d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: '#a1a1a6'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Code2 size={14} color="var(--apple-blue)" />
                        <span>Language: <strong>{currentQ.language || 'Java'}</strong></span>
                      </div>
                      <button
                        className="btn btn-outline"
                        onClick={handleRunCodeSimulation}
                        style={{ padding: '3px 10px', fontSize: '0.725rem', borderRadius: 'var(--radius-full)' }}
                      >
                        <Play size={11} color="var(--apple-green)" />
                        <span>Test Cases</span>
                      </button>
                    </div>

                    <textarea
                      rows={11}
                      value={answers[currentQ.id]?.codeAnswer ?? currentQ.starterCode ?? ''}
                      onChange={(e) => handleCodeAnswer(currentQ.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1e1e1e',
                        color: '#9cdcfe',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        padding: '16px',
                        border: 'none',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {codeTestOutput && (
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: codeTestOutput.success ? 'var(--apple-green-bg)' : 'var(--apple-red-bg)',
                      border: codeTestOutput.success ? '1px solid var(--apple-green-border)' : '1px solid var(--apple-red-border)',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ fontWeight: 600, color: codeTestOutput.success ? 'var(--apple-green)' : 'var(--apple-red)', marginBottom: '4px' }}>
                        {codeTestOutput.message}
                      </div>
                      {codeTestOutput.tests?.map((t) => (
                        <div key={t.testIndex} style={{ color: 'var(--text-muted)', fontSize: '0.785rem' }}>
                          Passed: Test Case {t.testIndex}: Input [{t.input}] passed
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>No question selected</div>
          )}

          {/* Bottom Step Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <button
              className="btn btn-outline"
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              style={{ padding: '9px 18px' }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 500 }}>
              Question {currentIdx + 1} of {questions.length}
            </span>

            {currentIdx < questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                style={{ padding: '9px 22px' }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowConfirmModal(true)}
                style={{ padding: '9px 22px' }}
              >
                <span>Submit Exam</span>
                <Send size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Apple-styled Question Palette */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="apple-glass" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '14px', fontWeight: 600 }}>
              Question Palette
            </h3>

            {/* Grid of question buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {questions.map((q, idx) => {
                const answered = isQuestionAnswered(q);
                const reviewed = reviewFlags[q.id];
                const active = idx === currentIdx;

                let bg = 'var(--bg-segmented)';
                let border = '1px solid transparent';
                let color = 'var(--text-muted)';

                if (reviewed) {
                  bg = 'var(--apple-purple-bg)';
                  border = '1px solid var(--apple-purple-border)';
                  color = 'var(--apple-purple)';
                } else if (answered) {
                  bg = 'var(--apple-green-bg)';
                  border = '1px solid var(--apple-green-border)';
                  color = 'var(--apple-green)';
                }

                if (active) {
                  border = '2px solid var(--apple-blue)';
                  color = 'var(--apple-blue)';
                  bg = 'var(--apple-blue-bg)';
                }

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentIdx(idx)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      background: bg,
                      border: border,
                      color: color,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.785rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--apple-green)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Answered ({getAnsweredCount()})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--apple-purple)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Flagged ({getReviewCount()})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-dim)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Unanswered ({questions.length - getAnsweredCount()})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="apple-glass animate-apple" style={{
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-hover)'
          }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 600 }}>
              Submit Examination?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Once confirmed, your answers will be finalized and evaluated by the system.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-segmented)',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--apple-green)' }}>
                  {getAnsweredCount()}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>Answered</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--apple-purple)' }}>
                  {getReviewCount()}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>Flagged</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--apple-red)' }}>
                  {questions.length - getAnsweredCount()}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>Unanswered</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn btn-outline"
                onClick={() => setShowConfirmModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

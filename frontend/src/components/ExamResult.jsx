import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Clock, 
  ArrowLeft, 
  RotateCcw
} from 'lucide-react';

export default function ExamResult({ submission, onBackToExams, onViewLeaderboard }) {
  if (!submission) return null;

  const {
    examTitle,
    studentName,
    studentRollNo,
    totalScoreAwarded,
    totalPossibleScore,
    percentage,
    passed,
    timeTakenSeconds,
    feedbacks = []
  } = submission;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="animate-apple" style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 20px' }}>
      
      {/* Back button */}
      <button 
        className="btn btn-outline"
        onClick={onBackToExams}
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeft size={15} />
        <span>Back to Exams</span>
      </button>

      {/* Hero Apple Score Card */}
      <div className="apple-glass" style={{
        padding: '36px',
        marginBottom: '28px',
        position: 'relative',
        background: passed 
          ? 'linear-gradient(180deg, var(--apple-green-bg) 0%, var(--bg-card) 60%)' 
          : 'linear-gradient(180deg, var(--apple-red-bg) 0%, var(--bg-card) 60%)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {/* Left Info */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className={`badge ${passed ? 'badge-green' : 'badge-red'}`}>
                {passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                {passed ? 'Passed Examination' : 'Needs Retake'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 700, letterSpacing: '-0.025em' }}>
              {examTitle}
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Candidate: <strong style={{ color: 'var(--text-main)' }}>{studentName}</strong> • Roll No: {studentRollNo}
            </p>
          </div>

          {/* Right Score Pill (Apple Activity Style) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 32px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: passed ? 'var(--apple-green)' : 'var(--apple-red)',
              lineHeight: 1,
              letterSpacing: '-0.03em'
            }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 500 }}>
              {totalScoreAwarded} of {totalPossibleScore} pts
            </div>
          </div>
        </div>

        {/* Quick Highlights Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              <Clock size={13} /> Duration Taken
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {formatTime(timeTakenSeconds)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              <CheckCircle2 size={13} /> Correct Answers
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--apple-green)', marginTop: '2px' }}>
              {feedbacks.filter(f => f.isCorrect).length} of {feedbacks.length}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              <Award size={13} /> Performance Grade
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--apple-blue)', marginTop: '2px' }}>
              {percentage >= 90 ? 'Grade A+' : percentage >= 75 ? 'Grade A' : percentage >= 50 ? 'Grade B' : 'Grade F'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
        <button
          className="btn btn-primary"
          onClick={() => onViewLeaderboard(submission.examId)}
        >
          <Award size={15} />
          <span>View Class Leaderboard</span>
        </button>

        <button
          className="btn btn-outline"
          onClick={onBackToExams}
        >
          <RotateCcw size={15} />
          <span>Browse Other Exams</span>
        </button>
      </div>

      {/* Review Section */}
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '4px', fontWeight: 600 }}>
          Detailed Answer Review
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Compare your submitted responses with correct solutions:
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {feedbacks.map((fb, idx) => (
          <div 
            key={fb.questionId || idx}
            className="apple-glass"
            style={{
              padding: '22px',
              borderLeft: fb.isCorrect ? '4px solid var(--apple-green)' : '4px solid var(--apple-red)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Question {idx + 1}
                </span>
                <span className="badge badge-gray">
                  {fb.questionType?.replace('_', ' ')}
                </span>
              </div>

              <span className={`badge ${fb.isCorrect ? 'badge-green' : fb.marksAwarded > 0 ? 'badge-orange' : 'badge-red'}`}>
                {fb.marksAwarded > 0 ? `+${fb.marksAwarded}` : fb.marksAwarded} / {fb.maxMarks} pts
              </span>
            </div>

            {/* Prompt */}
            <p style={{ fontSize: '0.975rem', color: 'var(--text-main)', marginBottom: '14px', lineHeight: 1.5, fontWeight: 500 }}>
              {fb.questionText}
            </p>

            {/* Answer Comparison */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '10px',
              marginBottom: '14px'
            }}>
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-segmented)',
              }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginBottom: '2px', fontWeight: 600 }}>
                  Your Answer
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: fb.isCorrect ? 'var(--apple-green)' : 'var(--apple-red)',
                  fontWeight: 500
                }}>
                  {String(fb.studentAnswerSummary || 'Unattempted')}
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--apple-green-bg)',
                border: '1px solid var(--apple-green-border)'
              }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--apple-green)', marginBottom: '2px', fontWeight: 600 }}>
                  Correct Model Answer
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {fb.correctSolution}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong>Feedback:</strong> {fb.feedback}
              {fb.explanation && (
                <span style={{ display: 'block', marginTop: '4px', color: 'var(--text-dim)' }}>
                  Explanation: {fb.explanation}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

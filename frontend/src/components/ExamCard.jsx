import React, { useState } from 'react';
import { Clock, HelpCircle, Award, ShieldAlert, ArrowRight, Trash2, CheckCircle2, Share2, Check } from 'lucide-react';

export default function ExamCard({ exam, onStart, onViewLeaderboard, onDelete, isInstructor }) {
  const [copied, setCopied] = useState(false);

  const getStrategyBadge = (type) => {
    switch (type) {
      case 'NEGATIVE_MARKING':
        return <span className="badge badge-red"><ShieldAlert size={12} /> Negative Marking</span>;
      case 'PARTIAL_CREDIT':
        return <span className="badge badge-purple"><Award size={12} /> Partial Credit</span>;
      case 'STRICT':
      default:
        return <span className="badge badge-blue"><CheckCircle2 size={12} /> Strict Grading</span>;
    }
  };

  const handleShareLink = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?examId=${exam.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="apple-glass animate-apple" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
    }}
    >
      {/* Top Meta */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-gray" style={{ fontWeight: 600 }}>
            {exam.subject || 'General Academic'}
          </span>
          {getStrategyBadge(exam.gradingStrategyType)}
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)', lineHeight: 1.3, fontWeight: 600 }}>
          {exam.title}
        </h3>

        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-muted)', 
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5
        }}>
          {exam.description}
        </p>
      </div>

      {/* Metrics Row (Apple Widget Style) */}
      <div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '12px 14px',
          background: 'var(--bg-segmented)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.725rem', marginBottom: '2px', fontWeight: 500 }}>
              Duration
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {exam.durationMinutes}m
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.725rem', marginBottom: '2px', fontWeight: 500 }}>
              Questions
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {exam.questionCount}
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.725rem', marginBottom: '2px', fontWeight: 500 }}>
              Total Marks
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--apple-blue)' }}>
              {exam.totalMarks} pts
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => onStart(exam.id)}
            style={{ flex: 1, padding: '9px 16px' }}
          >
            <span>Participate</span>
            <ArrowRight size={15} />
          </button>

          <button 
            className="btn btn-outline" 
            onClick={handleShareLink}
            title={copied ? "Link Copied!" : "Copy Shareable Exam Link"}
            style={{ padding: '9px 13px', borderRadius: 'var(--radius-full)' }}
          >
            {copied ? <Check size={15} color="var(--apple-green)" /> : <Share2 size={15} color="var(--text-muted)" />}
          </button>

          <button 
            className="btn btn-outline" 
            onClick={() => onViewLeaderboard(exam.id)}
            title="View Exam Leaderboard"
            style={{ padding: '9px 13px', borderRadius: 'var(--radius-full)' }}
          >
            <Award size={15} color="var(--text-muted)" />
          </button>

          {isInstructor && (
            <button 
              className="btn btn-danger" 
              onClick={() => onDelete(exam.id)}
              title="Delete Exam"
              style={{ padding: '9px 13px', borderRadius: 'var(--radius-full)' }}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

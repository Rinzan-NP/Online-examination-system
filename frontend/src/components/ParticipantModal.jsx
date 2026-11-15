import React, { useState } from 'react';
import { User, Hash, X, ArrowRight } from 'lucide-react';

export default function ParticipantModal({ 
  exam, 
  currentUser, 
  onConfirmStart, 
  onClose 
}) {
  const [candidateName, setCandidateName] = useState(currentUser?.role === 'STUDENT' ? currentUser.name : '');
  const [rollNumber, setRollNumber] = useState(
    currentUser?.role === 'STUDENT' && currentUser.rollNumber ? currentUser.rollNumber : ''
  );

  if (!exam) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!rollNumber.trim()) {
      alert('Please enter your roll number.');
      return;
    }

    onConfirmStart({
      examId: exam.id,
      candidateName: candidateName.trim(),
      rollNumber: rollNumber.trim()
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      padding: '20px'
    }}>
      <div className="apple-glass animate-apple" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-hover)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-outline"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            padding: 0,
            borderRadius: '50%'
          }}
        >
          <X size={15} />
        </button>

        {/* Clean Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span className="badge badge-blue">{exam.subject}</span>
            <span className="badge badge-gray">{exam.durationMinutes}m</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0 }}>
            {exam.title}
          </h2>
        </div>

        {/* Form Inputs: Name & Roll No */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
              autoFocus
              style={{ fontSize: '0.95rem', padding: '12px 14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
              <Hash size={14} /> Roll Number
            </label>
            <input
              type="text"
              placeholder="Enter your roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              style={{ fontSize: '0.95rem', padding: '12px 14px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1.5, padding: '10px' }}
            >
              <span>Start Exam</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import ExamCard from './ExamCard';
import { Search } from 'lucide-react';

export default function ExamList({ 
  exams, 
  analytics, 
  onStartExam, 
  onViewLeaderboard, 
  onDeleteExam, 
  isInstructor 
}) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  // Extract unique subjects
  const subjects = ['ALL', ...new Set(exams.map(e => e.subject).filter(Boolean))];

  const filteredExams = exams.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                          e.description.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || e.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="animate-apple" style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px' }}>
      
      {/* Clean Apple Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
            Examinations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', marginBottom: 0 }}>
            {filteredExams.length} {filteredExams.length === 1 ? 'assessment available' : 'assessments available'}
          </p>
        </div>

        {/* Clean Apple Search Bar */}
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search examinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              paddingLeft: '38px', 
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
        {/* Apple Segmented Filter Pills */}
        <div className="apple-segmented" style={{ flexWrap: 'wrap' }}>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`apple-segment-item ${selectedSubject === subj ? 'active' : ''}`}
            >
              {subj === 'ALL' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {filteredExams.map(exam => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onStart={onStartExam}
              onViewLeaderboard={onViewLeaderboard}
              onDelete={onDeleteExam}
              isInstructor={isInstructor}
            />
          ))}
        </div>
      ) : (
        <div className="apple-glass" style={{
          padding: '60px 24px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
            No examinations found
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
            Try selecting another subject or clearing your search query.
          </p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Award, Trophy, Clock, ArrowLeft } from 'lucide-react';
import { api } from '../api';

export default function LeaderboardView({ exams, selectedExamId, onBack, onStartExam }) {
  const [activeExamId, setActiveExamId] = useState(selectedExamId || exams[0]?.id || '');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeExamId) {
      loadLeaderboard(activeExamId);
    }
  }, [activeExamId]);

  const loadLeaderboard = async (examId) => {
    setLoading(true);
    try {
      const data = await api.getLeaderboard(examId);
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <span style={{ color: 'var(--apple-orange)', fontWeight: 700 }}>1st</span>;
    if (rank === 2) return <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>2nd</span>;
    if (rank === 3) return <span style={{ color: 'var(--apple-purple)', fontWeight: 700 }}>3rd</span>;
    return <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>#{rank}</span>;
  };

  return (
    <div className="animate-apple" style={{ maxWidth: '1080px', margin: '0 auto', padding: '36px 20px' }}>
      
      {/* Header & Exam Dropdown */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-outline" onClick={onBack} style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)' }}>
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, letterSpacing: '-0.025em' }}>
              <Trophy size={22} color="var(--apple-orange)" />
              <span>Academic Standings</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Official class performance rankings by accuracy and completion speed
            </p>
          </div>
        </div>

        {/* Dropdown to switch exam */}
        <div style={{ minWidth: '260px' }}>
          <select 
            value={activeExamId}
            onChange={(e) => setActiveExamId(e.target.value)}
            style={{ fontWeight: 600, borderRadius: 'var(--radius-full)' }}
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="apple-glass" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Loading rankings...
          </div>
        ) : leaderboard.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{
                  background: 'var(--bg-segmented)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-dim)',
                  fontSize: '0.725rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  <th style={{ padding: '14px 20px' }}>Rank</th>
                  <th style={{ padding: '14px 20px' }}>Candidate Name</th>
                  <th style={{ padding: '14px 20px' }}>Roll Number</th>
                  <th style={{ padding: '14px 20px' }}>Score</th>
                  <th style={{ padding: '14px 20px' }}>Percentage</th>
                  <th style={{ padding: '14px 20px' }}>Duration</th>
                  <th style={{ padding: '14px 20px' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr 
                    key={entry.rank}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                      background: entry.rank === 1 ? 'rgba(255, 149, 0, 0.04)' : 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = entry.rank === 1 ? 'rgba(255, 149, 0, 0.04)' : 'transparent'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      {getRankBadge(entry.rank)}
                    </td>

                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {entry.studentName}
                    </td>

                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {entry.studentRollNo}
                    </td>

                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--apple-blue)' }}>
                      {entry.score} / {entry.totalPossibleScore}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontWeight: 700,
                        color: entry.passed ? 'var(--apple-green)' : 'var(--apple-red)'
                      }}>
                        {entry.percentage}%
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {formatTime(entry.timeTakenSeconds)}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge ${entry.passed ? 'badge-green' : 'badge-red'}`}>
                        {entry.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Award size={40} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 600 }}>
              No Attempts Yet
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '18px' }}>
              Be the first candidate to take this exam and top the class leaderboard.
            </p>
            <button className="btn btn-primary" onClick={() => onStartExam(activeExamId)}>
              Take Exam Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

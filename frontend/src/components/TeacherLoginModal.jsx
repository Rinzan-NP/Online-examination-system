import React, { useState } from 'react';
import { Lock, Mail, Key, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TeacherLoginModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('teach@aisat.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a faculty email or ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onLogin({ email: email.trim(), password });
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials (teach@aisat.com / 1-8).');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFaculty = (presetEmail, presetPassword = '12345678') => {
    setEmail(presetEmail);
    setPassword(presetPassword);
    setError('');
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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="apple-glass animate-apple" style={{
        maxWidth: '440px',
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

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span className="badge badge-purple">
              <ShieldCheck size={12} /> Faculty Portal
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
            Teacher Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', marginBottom: 0 }}>
            Sign in to create, publish, and evaluate examinations.
          </p>
        </div>

        {error && (
          <div className="badge badge-red" style={{ width: '100%', padding: '8px 12px', marginBottom: '16px', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        {/* Quick Select Faculty Accounts */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
            Quick Select Faculty Profile
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleSelectFaculty('teach@aisat.com', '12345678')}
              className={`btn ${email === 'teach@aisat.com' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1.2, padding: '7px 10px', fontSize: '0.75rem' }}
            >
              teach@aisat.com (1-8)
            </button>
            <button
              type="button"
              onClick={() => handleSelectFaculty('sarah.mitchell@college.edu', 'faculty2026')}
              className={`btn ${email === 'sarah.mitchell@college.edu' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1, padding: '7px 10px', fontSize: '0.75rem' }}
            >
              Dr. Sarah Mitchell
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '5px', fontWeight: 600 }}>
              <Mail size={13} /> Faculty Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teach@aisat.com"
              required
              style={{ fontSize: '0.9rem', padding: '10px 14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '5px', fontWeight: 600 }}>
              <Lock size={13} /> Password / Faculty PIN
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (e.g. 1-8 or 12345678)"
              required
              style={{ fontSize: '0.9rem', padding: '10px 14px' }}
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
              disabled={loading}
              style={{ flex: 1.5, padding: '9px' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Teacher'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

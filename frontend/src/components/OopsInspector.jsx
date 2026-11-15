import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  GitFork, 
  Repeat, 
  Box, 
  Zap,
  Code2
} from 'lucide-react';

export default function OopsInspector() {
  const [activeTab, setActiveTab] = useState('pillars');

  const pillars = [
    {
      id: 'encapsulation',
      name: 'Encapsulation',
      icon: <ShieldCheck size={18} color="var(--apple-blue)" />,
      badge: 'Data Hiding & Validation',
      description: 'Hides internal state variables with private access modifiers and provides validated accessors and domain invariant checks.',
      backendFiles: ['Exam.java', 'Question.java', 'StudentAnswer.java', 'ExamSubmission.java'],
      codeSample: `// Encapsulated state in Exam.java
public class Exam extends BaseEntity {
    private String title;
    private int durationMinutes;
    private GradingStrategyType gradingStrategyType;
    private List<Question> questions = new ArrayList<>();

    // Domain invariant validation
    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = Math.max(1, durationMinutes);
    }
}`
    },
    {
      id: 'inheritance',
      name: 'Inheritance',
      icon: <GitFork size={18} color="var(--apple-purple)" />,
      badge: 'Class Hierarchies',
      description: 'Extends common abstract behavior from BaseEntity and User into specialized Student, Instructor, and Question subclasses.',
      backendFiles: ['User.java -> Student, Instructor', 'Question.java -> MCQ, TrueFalse, ShortAnswer, Coding'],
      codeSample: `// Question Class Hierarchy
public abstract class Question extends BaseEntity {
    private String text;
    private double marks;
    // Polymorphic contract...
}

public class MultipleChoiceQuestion extends Question {
    private List<QuestionOption> options;
    private boolean allowMultiple;
}

public class CodingQuestion extends Question {
    private String language;
    private List<TestCase> testCases;
}`
    },
    {
      id: 'polymorphism',
      name: 'Polymorphism',
      icon: <Repeat size={18} color="var(--apple-orange)" />,
      badge: 'Dynamic Method Dispatch',
      description: 'Dispatches grading and role evaluation algorithms dynamically at runtime without conditional branching.',
      backendFiles: ['Question.evaluate()', 'GradingStrategy.calculateScore()', 'User.getRoleDescription()'],
      codeSample: `// Dynamic method dispatch during exam grading
for (Question question : exam.getQuestions()) {
    StudentAnswer studentAnswer = answerMap.get(question.getId());
    
    // Dynamic dispatch: calls concrete evaluate() per question subtype!
    EvaluationResult evalResult = question.evaluate(studentAnswer, strategy);
    totalAwarded += evalResult.getScoreAwarded();
}`
    },
    {
      id: 'abstraction',
      name: 'Abstraction',
      icon: <Box size={18} color="var(--apple-green)" />,
      badge: 'Decoupled Interfaces',
      description: 'Defines clean, high-level contracts via interfaces and abstract classes, hiding low-level persistence and service details.',
      backendFiles: ['GradingStrategy.java', 'ExamObserver.java', 'ExamRepository.java', 'SubmissionService.java'],
      codeSample: `public interface GradingStrategy {
    double calculateScore(double maxScore, double penalty, double correctnessFraction);
    String getDescription();
    GradingStrategyType getType();
}`
    }
  ];

  const patterns = [
    {
      name: 'Strategy Pattern',
      category: 'Behavioral',
      purpose: 'Enables swapping grading algorithms (Strict, Negative Marking, Partial Credit) dynamically without modifying Exam or Question entities.',
      file: 'com.exam.oop.strategy.GradingStrategy',
      code: `public class NegativeMarkingStrategy implements GradingStrategy {
    @Override
    public double calculateScore(double max, double penalty, double fraction) {
        if (fraction >= 0.999) return max;
        if (fraction < 0.001) return -Math.abs(penalty);
        return (max * fraction) - (penalty * 0.5);
    }
}`
    },
    {
      name: 'Factory Pattern',
      category: 'Creational',
      purpose: 'QuestionFactory instantiates appropriate concrete Question subclasses (MCQ, True/False, Short Answer, Coding) based on dynamic inputs.',
      file: 'com.exam.oop.factory.QuestionFactory',
      code: `public MultipleChoiceQuestion createMultipleChoiceQuestion(...) {
    return new MultipleChoiceQuestion(id, text, marks, penalty, explanation, difficulty, topic, options, allowMultiple);
}`
    },
    {
      name: 'Observer Pattern',
      category: 'Behavioral',
      purpose: 'ExamEventPublisher broadcasts exam start, submit, and grade events to RealTimeNotificationService and RealTimeAnalyticsEngine.',
      file: 'com.exam.oop.observer.ExamEventPublisher',
      code: `public void publishEvent(ExamEvent event) {
    for (ExamObserver observer : observers) {
        observer.onExamEvent(event);
    }
}`
    },
    {
      name: 'Builder Pattern',
      category: 'Creational',
      purpose: 'ExamBuilder provides a fluent API for assembling complex Exam aggregates with validation before instantiation.',
      file: 'com.exam.model.exam.ExamBuilder',
      code: `Exam exam = new ExamBuilder()
    .withTitle("Operating Systems Final Exam")
    .withDuration(45)
    .withGradingStrategy(GradingStrategyType.NEGATIVE_MARKING)
    .withQuestions(osQuestions)
    .build();`
    }
  ];

  return (
    <div className="animate-apple" style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span className="badge badge-purple">College Course Report</span>
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 700, letterSpacing: '-0.025em' }}>
          Object-Oriented Software Architecture
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '800px' }}>
          Design documentation showing how the Online Examination System implements the 4 Pillars of OOP and GoF Design Patterns in Java.
        </p>
      </div>

      {/* Segmented Control */}
      <div className="apple-segmented" style={{ marginBottom: '28px' }}>
        <button
          className={`apple-segment-item ${activeTab === 'pillars' ? 'active' : ''}`}
          onClick={() => setActiveTab('pillars')}
        >
          <Layers size={15} />
          <span>The 4 Pillars of OOP</span>
        </button>

        <button
          className={`apple-segment-item ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <Zap size={15} />
          <span>GoF Design Patterns</span>
        </button>
      </div>

      {/* 4 Pillars Section */}
      {activeTab === 'pillars' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
          {pillars.map((p) => (
            <div 
              key={p.id}
              className="apple-glass"
              style={{
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {p.icon}
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 600 }}>{p.name}</h3>
                  </div>
                  <span className="badge badge-gray">{p.badge}</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '14px', lineHeight: 1.5 }}>
                  {p.description}
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                    Java Source Files in Backend:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.backendFiles.map((f, i) => (
                      <span key={i} style={{
                        padding: '3px 8px',
                        background: 'var(--bg-segmented)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--apple-blue)',
                        fontWeight: 500
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Box */}
              <div style={{
                background: '#1e1e1e',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.785rem',
                color: '#4ec9b0',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.45,
                overflowX: 'auto'
              }}>
                {p.codeSample}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GoF Design Patterns Section */}
      {activeTab === 'patterns' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
          {patterns.map((pat, idx) => (
            <div
              key={idx}
              className="apple-glass"
              style={{
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 600 }}>{pat.name}</h3>
                  <span className="badge badge-purple">{pat.category}</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '14px', lineHeight: 1.5 }}>
                  {pat.purpose}
                </p>

                <div style={{ marginBottom: '14px', fontSize: '0.785rem', color: 'var(--text-dim)' }}>
                  File: <span style={{ color: 'var(--apple-blue)', fontFamily: 'var(--font-mono)' }}>{pat.file}</span>
                </div>
              </div>

              <div style={{
                background: '#1e1e1e',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.785rem',
                color: '#4ec9b0',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.45,
                overflowX: 'auto'
              }}>
                {pat.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

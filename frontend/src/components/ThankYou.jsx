import React, { useEffect } from 'react';

const ThankYou = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ Redirect to external website
      window.location.href = "https://unessafoundation.org/";
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Thank You!</h1>
        <p style={styles.message}>
          Your payment was successful. You will be redirected shortly...
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f4f8',
  },
  card: {
    padding: '40px',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#2e7d32',
  },
  message: {
    fontSize: '1rem',
    color: '#555',
  },
};

export default ThankYou;

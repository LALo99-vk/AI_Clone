import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom'; 

function Login({ onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState('register'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const navigate = useNavigate();

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    };

    const handleAuth = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            alert('Please enter your email address.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email format (e.g., user@domain.com).');
            return;
        }

        if (activeTab === 'login') {
            if (!password.trim()) {
                alert('Please enter your password.');
                return;
            }

            // Using localStorage to check registration info
            const registeredUserStr = localStorage.getItem('registeredUser');
            if (!registeredUserStr) {
                alert('No account registered yet. Please register first.');
                return;
            }

            const registeredUser = JSON.parse(registeredUserStr);

            if (email === registeredUser.email && password === registeredUser.password) {
                console.log('Login Successful!');
                if (onLoginSuccess) {
                    onLoginSuccess(email);
                }
            } else {
                alert('Login failed. Incorrect email or password.');
            }
        } else {
            // Registration logic
            if (!password.trim() || !confirmPassword.trim()) {
                alert('Please fill in both password fields.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            // Save registered info to localStorage
            localStorage.setItem('registeredUser', JSON.stringify({ email: email, password: password }));

            console.log('Mock registration successful!');
            alert('Account successfully created! Please log in now.');
            
            setActiveTab('login'); 
            setEmail(email.trim()); 
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div style={styles.fullPageContainer}>
            <div style={styles.leftPanel}>
                <div style={styles.logoContainer}>
                    <span style={styles.logoText}>CloneAI</span>
                </div>
                <h1 style={styles.tagline}>
                    Your AI Digital Clone <br /> for Work Delegation
                </h1>
                <p style={styles.description}>
                    Train an AI that thinks, decides, and delegates just like you. <br /> Automate routine work while maintaining your unique style.
                </p>
                <div style={styles.features}>
                    <div style={styles.featureItem}>
                        <span style={styles.featureIcon}>✅</span>
                        <div>
                            <h3 style={styles.featureTitle}>Smart Task Delegation</h3>
                            <p style={styles.featureText}>Let your AI clone assign tasks based on your patterns</p>
                        </div>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.featureIcon}>🧠</span>
                        <div>
                            <h3 style={styles.featureTitle}>Personalized Training</h3>
                            <p style={styles.featureText}>Upload documents and teach through Q&A</p>
                        </div>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.featureIcon}>🗣️</span>
                        <div>
                            <h3 style={styles.featureTitle}>Your Communication Style</h3>
                            <p style={styles.featureText}>AI learns and replicates your decision-making approach</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.rightPanel}>
                <div style={styles.formCard}>
                    <h2 style={styles.getStartedTitle}>
                        {activeTab === 'register' ? 'Get Started' : 'Get Started'}
                    </h2>
                    <p style={styles.getStartedSubtitle}>
                        {activeTab === 'register' ? 
                            'Create your AI digital clone today' : 
                            'Create your AI digital clone today'
                        }
                    </p>

                    <div style={styles.tabsContainer}>
                        <button
                            onClick={() => setActiveTab('login')}
                            style={{ ...styles.tabButton, ...(activeTab === 'login' ? styles.tabButtonActive : {}) }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            style={{ ...styles.tabButton, ...(activeTab === 'register' ? styles.tabButtonActive : {}) }}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleAuth} style={styles.form}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        {activeTab === 'register' && (
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        )}

                        <button type="submit" style={styles.submitButton}>
                            {activeTab === 'login' ? 'Login' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
            <div style={styles.madeWith}>
                <p>Made with Emergent</p>
            </div>
        </div>
    );
}

const styles = {
    fullPageContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f6f7fb',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        position: 'relative',
    },
    leftPanel: {
        flex: 1,
        backgroundColor: '#fdfdff',
        padding: '50px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRight: '1px solid #e9e9f0',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
    },
    logoText: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#3498db',
    },
    tagline: {
        fontSize: '40px',
        fontWeight: 'bold',
        color: '#2c3e50',
        lineHeight: '1.2',
        marginBottom: '20px',
    },
    description: {
        fontSize: '18px',
        color: '#5a6b7f',
        marginBottom: '40px',
        lineHeight: '1.5',
    },
    features: {
        width: '100%',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '25px',
    },
    featureIcon: {
        fontSize: '24px',
        marginRight: '15px',
        color: '#3498db',
        flexShrink: 0,
    },
    featureTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: '0 0 5px 0',
    },
    featureText: {
        fontSize: '15px',
        color: '#6e8093',
        margin: 0,
    },
    rightPanel: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px',
    },
    formCard: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
    },
    getStartedTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '10px',
    },
    getStartedSubtitle: {
        fontSize: '16px',
        color: '#7f8c8d',
        marginBottom: '30px',
    },
    tabsContainer: {
        display: 'flex',
        backgroundColor: '#eef1f6',
        borderRadius: '8px',
        marginBottom: '30px',
        overflow: 'hidden',
        padding: '4px',
    },
    tabButton: {
        flex: 1,
        padding: '10px 0',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '16px',
        fontWeight: '600',
        color: '#8192a5',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '6px',
    },
    tabButtonActive: {
        backgroundColor: 'white',
        color: '#3498db',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '14px',
        marginBottom: '15px',
        border: '1px solid #dce1e6',
        borderRadius: '6px',
        fontSize: '16px',
        width: 'calc(100% - 28px)',
        backgroundColor: '#fdfdff',
        color: '#34495e',
    },
    submitButton: {
        padding: '14px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '10px',
        boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
    },
    madeWith: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        fontSize: '14px',
        color: '#bdc3c7',
    },
};

export default Login;

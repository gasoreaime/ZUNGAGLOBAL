import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // ✅ external CSS

export default function LoginRegister() {
  const navigate = useNavigate(); // ✅ FIXED: called directly
  const [mode, setMode] = useState("login");
  const [feedback, setFeedback] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(cu);
  }, []);

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }

  function saveUsers(list) {
    localStorage.setItem("users", JSON.stringify(list));
  }

  function handleRegister(e) {
    e.preventDefault();
    setFeedback("");

    if (!name.trim() || !email.trim() || !password) {
      setFeedback("Please fill all fields.");
      return;
    }

    const users = getUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setFeedback("Email already registered.");
      return;
    }

    let finalRole = "user";
    if (role === "admin" && currentUser && currentUser.role === "admin") {
      finalRole = "admin";
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: finalRole,
    };

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setFeedback(`Registered as ${finalRole}. Redirecting...`);

    setTimeout(() => {
      navigate(newUser.role === "admin" ? "/admin" : "/products");
    }, 700);
  }

  function handleLogin(e) {
    e.preventDefault();
    setFeedback("");
    const users = getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      setFeedback("Incorrect email or password.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(found));
    setFeedback(`Welcome ${found.name}! Redirecting...`);

    setTimeout(() => {
      navigate(found.role === "admin" ? "/admin" : "/products");
    }, 600);
  }

  function logoutDemo() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setFeedback("Logged out.");
  }

  return (
    <div className="lr-wrap">
      <div className="card fade-in">
        <div className="header">
          <h2>{mode === "login" ? "Login" : "Register"}</h2>
          <p>{mode === "login" ? "Sign in to continue" : "Create an account"}</p>
        </div>

        <div className="content">
          <div className="toggle">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {feedback && <div className="feedback">{feedback}</div>}

          {mode === "register" ? (
            <form onSubmit={handleRegister}>
              <input
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
              />
              <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
              />
              <input
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
              />
              {currentUser && currentUser.role === "admin" ? (
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <div className="hint">Default: user</div>
              )}

              <button className="btn" type="submit">Create account</button>
              <div className="meta">
                <span className="small">Already have an account?</span>
                <button type="button" onClick={() => setMode("login")} className="link">
                  Sign In
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
              />
              <input
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
              />
              <button className="btn" type="submit">Login</button>
              <div className="meta">
                <span className="small">No account?</span>
                <button type="button" onClick={() => setMode("register")} className="link">
                  Create
                </button>
              </div>
            </form>
          )}

          <div className="demo-section">
            <button onClick={() => {
              const users = getUsers();
              if (!users.find(u => u.email === "admin@demo.com")) {
                users.push({
                  id: 1,
                  name: "Demo Admin",
                  email: "admin@demo.com",
                  password: "admin123",
                  role: "admin"
                });
                saveUsers(users);
                setFeedback("Demo admin created: admin@demo.com / admin123");
              } else setFeedback("Demo admin already exists.");
            }} className="btn small-btn">Create demo admin</button>

            <button onClick={logoutDemo} className="btn small-btn logout">Logout</button>

            {currentUser && (
              <div className="current">
                Logged in as <strong>{currentUser.name}</strong> <span className="admin-badge">{currentUser.role}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

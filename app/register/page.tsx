// register page
'use client';
import { useRouter } from "next/navigation";
import React, {useState} from "react";

function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

   const handleSubmit = async (e: React.FormEvent <HTMLFormElement>) => {
            e.preventDefault();
    
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
    
            try {
                // react query mutation to register user
                // loading state
                // error state
                // success state
                // redirect to login page
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
        
                const data = await res.json();
        
                if (!res.ok) {
                    throw new Error(data.error || "Registration failed");
                }
        
                console.log("Registration successful", data);
                router.push("/login")
            } catch (error) {
                console.log("Registration error:", error);
            }
        };

  return <div>
    <h1>Register</h1>
    <form onSubmit={handleSubmit}>
        <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>
        <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        <div>
            <label>Confirm Password:</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
        </div>
        <button type="submit">Register</button>
    </form>

    <div>
        <p>Already have an account? <a href="/login">Login</a></p>
    </div>
    </div>;
}

export default RegisterPage;

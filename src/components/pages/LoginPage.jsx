import React, { useState } from 'react';
import whiteLogo from '../../assets/white-logo.svg';
import googleLogo from '../../assets/google-logo.svg';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/auth/AuthContext';
import { Link } from 'react-router';

export default function LoginPage() {
  // Email & Password state & handlers
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  console.log(email);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const { login, googleSignin, githubSignIn, error } = useAuth();

  return (
    <Card className="p-11 rounded-none flex flex-col text-center justify-center ">
      <CardHeader className="gap-8">
        <CardTitle className="font-bold text-2xl  bg-gradient-to-r from-blue-300 to-secure-blue text-transparent bg-clip-text">
          Welcome Back
        </CardTitle>
        <CardDescription className="px-24">
          Sign in to your SecureBYTE account and continue with your code
          analysis.{' '}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 text-left">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(email, password);
          }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3">
            <Label className="font-bold text-lg">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
              className="py-8 rounded-xl border-secure-light-blue"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-bold text-lg">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="py-8 rounded-xl border-secure-light-blue"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="bg-secure-orange font-bold"
          >
            Login
          </Button>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or Continue With
            </span>
          </div>

          <Button onClick={googleSignin} size="lg" className="font-bold">
            <img src={googleLogo} className="size-5"></img>
            Login with Google
          </Button>
          <Button onClick={githubSignIn} size="lg">
            Login with GitHub
          </Button>
          {error ? (
            <span className="text-destructive min-h-24">{error}</span>
          ) : (
            ''
          )}
        </form>
      </CardContent>
      <CardFooter className="items-center justify-center">
        <p>
          Are you a new user?{' '}
          <Link
            className="underline-offset-2 underline cursor-pointer font-bold text-secure-orange"
            to={'/auth/signup'}
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

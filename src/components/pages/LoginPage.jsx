import React from 'react';
import blackLogo from '../../assets/black-logo.svg';
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

export default function LoginPage({
  handleSubmit,
  handleEmailChange,
  handlePasswordChange,
  handleGoogleSignIn,
  error,
  setIsSignUp,
  email,
  password,
}) {
  return (
    <div className="min-h-screen w-screen grid grid-cols-2 bg-secure-blue">
      <div className="bg-white p-11 flex items-start justify-start">
        <img src={blackLogo} alt="Logo of SecureBYTE in white"></img>
      </div>
      <Card className="p-11 rounded-none flex flex-col text-center justify-center bg-secure-blue">
        <CardHeader className="gap-8">
          <CardTitle className="font-bold text-2xl text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="px-24 text-white">
            Sign In to your SecureBYTE account and continue with your code
            analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-0 text-white">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 text-left"
          >
            <div className="flex flex-col gap-3">
              <Label className="font-bold text-lg">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                className="py-8 rounded-xl placeholder:text-white border-secure-light-blue"
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
                className="py-8 rounded-xl placeholder:text-white border-secure-light-blue"
              />
            </div>
            <Button type="submit" size="xl" className="bg-secure-light-blue">
              Login
            </Button>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-secure-blue text-white relative z-10 px-2">
                Or Continue With
              </span>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              size="xl"
              className="bg-secure-light-blue"
            >
              <img src={googleLogo} className="size-5"></img>
              Login with Google
            </Button>
            {error ? (
              <span className="text-destructive min-h-24">{error}</span>
            ) : (
              ''
            )}
          </form>
        </CardContent>
        <CardFooter className="items-center justify-center text-white">
          <p>
            Are you a new user?{' '}
            <span
              className="underline-offset-2 underline cursor-pointer font-bold text-secure-orange"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              Sign Up
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

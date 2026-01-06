import { SyntheticEvent, useState } from "react";
import supabase from "../supabase-client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setMessage("");
    setloading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setloading(false);
    if (error) {
      setMessage(error.message);
      setEmail("");
      setpassword("");
      return;
    }

    if (data) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center py-12 lg:px-8">
      <Card className="w-full max-w-sm content-center">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setpassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="button" className="w-full" onClick={handleSubmit}>
            {loading && <Spinner/>}
            Login
          </Button>
          {message && <p className="mt-2 text-red-500">{message}</p>}
          <p className="mt-5 text-center text-sm/6 text-gray-500">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default login;

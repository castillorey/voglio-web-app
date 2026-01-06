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

function register() {
  const [email, setEmail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setMessage("");
    setloading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setloading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data) {
      setMessage("User account created successfully!");
    }
    setEmail("");
    setpassword("");
  };
  return (
    <div className="flex justify-center py-12 lg:px-8">
      <Card className="w-full max-w-sm content-center">
        <CardHeader>
          <CardTitle>Create new account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
          <Button type="button" variant="secondary" className="w-full" onClick={handleSubmit}>
            {loading && <Spinner/>}
            Create account
          </Button>
          {message && <p className="mt-2 ">{message}</p>}
          <p className="mt-5 text-center text-sm/6 text-gray-500">
            Already a member?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default register;

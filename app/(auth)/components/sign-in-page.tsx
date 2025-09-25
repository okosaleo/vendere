"use client";
import Image from "next/image";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";



const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignInView() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


   const onSubmit = async (data: z.infer<typeof formSchema>) => {

  setPending(true);
  setError(null);

  authClient.signIn.email(
    {
      email: data.email,
      password: data.password,
      callbackURL: "/",
    },
    {
      onSuccess: () => {
        setPending(false);
        router.push("/");
        toast.success("Welcome Back!", { description: "Sign in successful!" });
      },
      onError: ({ error }) => {
        setPending(false);

        // redirect to reset password if BetterAuth signals no password
        if (error.message === "PASSWORD_REQUIRED") {
          router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
          toast.error("Please set your password first.");
          return;
        }

        setError(error.message);
        toast.error(error.message);
      },
    }
  );
};
    
  return (
     <div className="flex flex-col items-center justify-center  w-full">
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 ">
             <Image src="/vendere.png" alt="vendere" fill className="rounded-full object-cover" />
              </div>
              <p className=" text-lg">Welcome back, Sign In to your account.</p>
            </div>
            <div className="lg:w-1/2 lg:p-0 w-full p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="py-6 md:py-8 flex flex-col gap-4" >
                        <div className="flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter your email" {...field} className="w-full"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} className="w-full"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                        {!!error && (
                            <Alert className="bg-destructive/10 border-none">
                                <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        )}
                        <Button disabled={pending} type="submit" className="w-full bg-primary hover:bg-primary/90">
                        {pending ? (
                            <p className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing In...
                            </p>) 
                            : ("Sign In")}
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}<Link href="/sign-up" className="underline underline-offset-4">Sign up </Link>
                            </div>
                            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a>Privacy Policy</a></div>
                    </form>
                </Form>
            </div>
        </div>
  )
}

import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser();
    const isAdmin = user?.email === process.env.ADMIN_EMAIL;
    return (
        <nav className="fixed z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href="/" className="flex z-40 font-semibold">
                        case <span className="text-green-600">cobra</span>
                    </Link>
                    <div className="h-full flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                                    href="/api/auth/logout"
                                >
                                    Sign out
                                </Link>
                                {isAdmin ? (
                                    <Link
                                        className={buttonVariants({ size: "sm", variant: "ghost" })}
                                        href="/api/auth/logout"
                                    >
                                        Dashboard ✨
                                    </Link>
                                ) : null}
                                <Link
                                    className={buttonVariants({ size: "sm", })}
                                    href="/configure/upload">
                                    Create Case
                                    <ArrowRight className="ml-1.5 h-5 w-5" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                                    href="/api/auth/register"
                                >
                                    Sign up
                                </Link>
                                <Link
                                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                                    href="/api/auth/login">
                                    Login
                                </Link>
                                <div className='h-8 w-px bg-zinc-200 hidden sm:block' />
                                <Link
                                    href='/configure/upload'
                                    className={buttonVariants({
                                        size: 'sm',
                                        className: 'hidden sm:flex items-center gap-1',
                                    })}>
                                    Create case
                                    <ArrowRight className='ml-1.5 h-5 w-5' />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
};

export default Navbar;

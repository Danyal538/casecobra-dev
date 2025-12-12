import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import StatusDropdown from "./StatusDropdown";

const Page = async () => {
    console.log("1. Starting Dashboard Render");
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    console.log("2. User Email:", user?.email);
    console.log("3. Admin Email Env:", ADMIN_EMAIL);

    if (!user || user.email !== ADMIN_EMAIL) {
        console.log("4. Access Denied");
        return <h1 className="mt-30">Not logged in as admin</h1>;
    }

    console.log("5. Access Granted. Fetching DB...");
    const orders = await db.order.findMany({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            user: true,
            shippingAddress: true,
        }
    })
    console.log("6. Orders Fetched:", orders.length);

    const lastWeekSum = await db.order.aggregate({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
        },
        _sum: {
            amount: true
        }
    })
    const lastMonthSum = await db.order.aggregate({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
        },
        _sum: {
            amount: true
        }
    })
    const WEEKLY_GOAL = 500;
    const MONTHLY_GOAL = 2000;
    return (
        <div className='flex min-h-screen w-full bg-muted/40'>
            <div className='max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4'>
                <div className='flex flex-col gap-16'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardDescription className="pt-10">Last week</CardDescription>
                                <CardTitle className="text-4xl">
                                    {formatPrice(lastWeekSum._sum?.amount ?? 0)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">of {formatPrice(WEEKLY_GOAL)} goal</div>
                            </CardContent>
                            <CardFooter>
                                <Progress value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL} />
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription className="pt-10">Last month</CardDescription>
                                <CardTitle className="text-4xl">
                                    {formatPrice(lastMonthSum._sum?.amount ?? 0)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">of {formatPrice(MONTHLY_GOAL)} goal</div>
                            </CardContent>
                            <CardFooter>
                                <Progress value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL} />
                            </CardFooter>
                        </Card>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Incoming orders
                    </h1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden sm:table-cell">Purchase date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">
                                            {order.shippingAddress?.name}
                                        </div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {order.user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell"><StatusDropdown id={order.id} orderStatus={order.status} /></TableCell>
                                    <TableCell className="hidden md:table-cell">{order.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">{formatPrice(order.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
export default Page;
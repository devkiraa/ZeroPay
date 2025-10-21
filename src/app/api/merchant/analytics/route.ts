import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import { getSessionMerchant } from "@/lib/sessionUtils";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const merchant = await getSessionMerchant();
    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date range
    const now = new Date();
    const daysAgo = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Fetch all transactions in range
    const transactions = await Transaction.find({
      merchantId: merchant._id,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 });

    // Calculate metrics
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(
      (t) => t.status === "success"
    );
    const totalRevenue = successfulTransactions.reduce(
      (sum, t) => sum + (t.amount - (t.refundedAmount || 0)),
      0
    );
    const successRate =
      totalTransactions > 0
        ? (successfulTransactions.length / totalTransactions) * 100
        : 0;
    const averageTransactionValue =
      successfulTransactions.length > 0
        ? totalRevenue / successfulTransactions.length
        : 0;

    // Revenue by day
    const revenueByDay: { [key: string]: number } = {};
    transactions.forEach((t) => {
      if (t.status === "success") {
        const date = new Date(t.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        revenueByDay[date] =
          (revenueByDay[date] || 0) + (t.amount - (t.refundedAmount || 0));
      }
    });

    const revenueByDayArray = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({ date, revenue }))
      .slice(-14); // Last 14 days

    // Transactions by payment method
    const methodStats: {
      [key: string]: { count: number; revenue: number };
    } = {};
    transactions.forEach((t) => {
      const method = t.paymentMethod || "unknown";
      if (!methodStats[method]) {
        methodStats[method] = { count: 0, revenue: 0 };
      }
      methodStats[method].count++;
      if (t.status === "success") {
        methodStats[method].revenue += t.amount - (t.refundedAmount || 0);
      }
    });

    const transactionsByMethod = Object.entries(methodStats).map(
      ([method, stats]) => ({
        method,
        count: stats.count,
        revenue: stats.revenue,
      })
    );

    // Transactions by status
    const statusStats: { [key: string]: number } = {};
    transactions.forEach((t) => {
      statusStats[t.status] = (statusStats[t.status] || 0) + 1;
    });

    const transactionsByStatus = Object.entries(statusStats).map(
      ([status, count]) => ({ status, count })
    );

    // Recent trends (weekly breakdown)
    const weeks = Math.ceil(daysAgo / 7);
    const recentTrends = [];
    for (let i = 0; i < weeks; i++) {
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

      const weekTransactions = transactions.filter((t) => {
        const tDate = new Date(t.createdAt);
        return tDate >= weekStart && tDate <= weekEnd;
      });

      const weekRevenue = weekTransactions
        .filter((t) => t.status === "success")
        .reduce((sum, t) => sum + (t.amount - (t.refundedAmount || 0)), 0);

      recentTrends.unshift({
        period: `${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`,
        transactions: weekTransactions.length,
        revenue: weekRevenue,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalTransactions,
        successRate,
        averageTransactionValue,
        revenueByDay: revenueByDayArray,
        transactionsByMethod,
        transactionsByStatus,
        recentTrends,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

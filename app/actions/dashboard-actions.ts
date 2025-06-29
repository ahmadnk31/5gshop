"use server";

import { DatabaseService } from "@/lib/database";
import { DashboardStats } from "@/lib/types";

export async function getDashboardData() {
  try {
    console.log('🔍 Starting getDashboardData...');
    
    // Test database connection first
    try {
      await DatabaseService.getAllRepairs();
      console.log('✅ Database connection test successful');
    } catch (dbError) {
      console.error('❌ Database connection test failed:', dbError);
      throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

    const [repairs, customers, parts, quotes] = await Promise.all([
      DatabaseService.getAllRepairs().catch(error => {
        console.error('❌ Failed to get repairs:', error);
        throw new Error(`Failed to get repairs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }),
      DatabaseService.getAllCustomers().catch(error => {
        console.error('❌ Failed to get customers:', error);
        throw new Error(`Failed to get customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }),
      DatabaseService.getAllPartsSimple().catch(error => {
        console.error('❌ Failed to get parts:', error);
        throw new Error(`Failed to get parts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }),
      DatabaseService.getAllQuotes().catch(error => {
        console.error('❌ Failed to get quotes:', error);
        throw new Error(`Failed to get quotes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }),
    ]);

    console.log('✅ All data fetched successfully:', {
      repairsCount: repairs.length,
      customersCount: customers.length,
      partsCount: parts.length,
      quotesCount: quotes.length
    });

    // Get services overview
    const serviceTypes = [
      'Screen Replacement',
      'Battery Replacement', 
      'Camera Repair',
      'Charging Port Repair',
      'Water Damage Recovery',
      'Software Issues',
      'Performance Optimization'
    ];

    // Calculate dynamic monthly revenue from completed repairs
    const completedRepairs = repairs.filter(r => r.status === 'COMPLETED');
    const monthlyRevenue = completedRepairs.length > 0 ? (() => {
      const monthlyData: { [key: string]: number } = {};
      
      // Group completed repairs by month
      completedRepairs.forEach(repair => {
        const repairDate = new Date(repair.completedAt || repair.createdAt);
        const monthKey = repairDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + repair.cost;
      });

      // Convert to array format and sort by date
      return Object.entries(monthlyData)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    })() : [];

    // Calculate dynamic average repair time from completed repairs
    const avgRepairTime = completedRepairs.length > 0 
      ? completedRepairs.reduce((sum, repair) => {
          const created = new Date(repair.createdAt);
          const completed = new Date(repair.completedAt || repair.createdAt);
          const daysDiff = Math.max(1, Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
          return sum + daysDiff;
        }, 0) / completedRepairs.length
      : 0;

    // Calculate dynamic customer satisfaction based on repair completion rate
    const customerSatisfaction = repairs.length > 0 
      ? Math.round((completedRepairs.length / repairs.length) * 100)
      : 0;

    // Calculate stats
    const stats: DashboardStats = {
      totalRepairs: repairs.length,
      pendingRepairs: repairs.filter(r => r.status === 'PENDING').length,
      completedRepairs: completedRepairs.length,
      totalRevenue: completedRepairs.reduce((sum, r) => sum + r.cost, 0),
      averageRepairTime: Math.round(avgRepairTime * 10) / 10, // Round to 1 decimal place
      customerSatisfaction: Math.min(100, Math.max(60, customerSatisfaction)), // Cap between 60-100%
      lowStockParts: parts.filter(p => p.inStock <= p.minStock).length,
      totalCustomers: customers.length,
      activeQuotes: quotes.filter(q => q.status === 'PENDING' || q.status === 'SENT').length,
      monthlyRevenue,
    };

    return {
      repairs,
      customers,
      parts,
      quotes,
      stats,
      services: serviceTypes, // Add services data
    };
  } catch (error) {
    console.error("Failed to get dashboard data:", error);
    throw new Error("Failed to get dashboard data");
  }
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Download, Calendar, Users, TrendingUp } from 'lucide-react';

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('events');
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Reports and Analytics"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Reports & Analytics
            </h1>
            <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
              Generate detailed reports and analyze event performance metrics
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/dashboard/admin"
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Report Controls */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
            >
              <option value="events">Event Analytics</option>
              <option value="users">User Statistics</option>
              <option value="registrations">Registration Trends</option>
              <option value="feedback">Feedback Analysis</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>

            <button className="bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Events</p>
                <h3 className="text-2xl font-bold text-white mt-1">156</h3>
              </div>
              <div className="bg-[#f14621]/10 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-[#f14621]" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">12% increase</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <h3 className="text-2xl font-bold text-white mt-1">2,847</h3>
              </div>
              <div className="bg-[#f14621]/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#f14621]" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">8% increase</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Attendance</p>
                <h3 className="text-2xl font-bold text-white mt-1">89%</h3>
              </div>
              <div className="bg-[#f14621]/10 p-3 rounded-lg">
                <BarChart2 className="w-6 h-6 text-[#f14621]" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">5% increase</span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-white mb-6">Analytics Overview</h2>
          <div className="h-96 flex items-center justify-center border border-gray-700 rounded-lg">
            <p className="text-gray-400">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
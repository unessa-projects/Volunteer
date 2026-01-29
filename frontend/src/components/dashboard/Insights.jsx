import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, 
  ResponsiveContainer, LineChart, Line, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Insights = () => {
  // Realistic data for visualizations
  const topDonorsData = [
    { name: 'Jay Patel', amount: 12500 },
    { name: 'Sagar Shah', amount: 9800 },
    { name: 'Dhruv Mehta', amount: 7500 },
    { name: 'Priya Singh', amount: 6200 },
    { name: 'Amit Kumar', amount: 5400 }
  ];

  const leaderboardData = [
    { id: 1, name: 'Aarav Sharma', title: 'Visionary', donations: 28 },
    { id: 2, name: 'Isha Patel', title: 'Champion', donations: 25 },
    { id: 3, name: 'Raj Verma', title: 'Supporter', donations: 22 },
    { id: 4, name: 'Diya Reddy', title: 'Visionary', donations: 20 },
    { id: 5, name: 'Rohan Kapoor', title: 'Advocate', donations: 18 },
    { id: 6, name: 'Meera Joshi', title: 'Supporter', donations: 15 },
    { id: 7, name: 'Kabir Malhotra', title: 'Advocate', donations: 12 },
    { id: 8, name: 'Anaya Gupta', title: 'Supporter', donations: 10 },
    { id: 9, name: 'Yash Singh', title: 'Newcomer', donations: 8 },
    { id: 10, name: 'Tara Nair', title: 'Newcomer', donations: 5 }
  ];

  const monthlyData = [
    { month: 'Jan', amount: 3200, donors: 8, avg: 400 },
    { month: 'Feb', amount: 5800, donors: 14, avg: 414 },
    { month: 'Mar', amount: 12500, donors: 22, avg: 568 },
    { month: 'Apr', amount: 8900, donors: 18, avg: 494 },
    { month: 'May', amount: 14200, donors: 26, avg: 546 },
    { month: 'Jun', amount: 16800, donors: 31, avg: 542 },
    { month: 'Jul', amount: 19500, donors: 35, avg: 557 }
  ];

  const donorDistribution = [
    { name: 'One-time', value: 45 },
    { name: 'Monthly', value: 30 },
    { name: 'Quarterly', value: 15 },
    { name: 'Annual', value: 10 }
  ];

  const campaignProgress = [
    { name: 'Raised', value: 65000 },
    { name: 'Remaining', value: 35000 }
  ];

  const stats = {
    totalRaised: 65000,
    totalDonors: 35,
    biggestDonation: 12500,
    avgDonation: 1857,
    target: 100000
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className='bg-[#096d7d33] '>
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-gradient-to-br bg-[#043238]  min-h-screen space-y-10"
    >
      

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {/* 1. Top Donors Bar Chart */}
        <motion.div variants={itemVariants} className="bg-cyan-700 shadow-xl rounded-2xl p-6">
          <h2 className="text-3xl font-semibold mb-4 text-[#ECA90E]">Top Donors</h2>
          <motion.div variants={chartVariants}>
           <ResponsiveContainer width="100%" height={300}>
  <BarChart data={topDonorsData} layout="vertical" margin={{ left: 30 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" tick={{ fill: 'white' }} />
    <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'white' }} />
    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
    <Bar dataKey="amount" fill="blue" animationDuration={1500} radius={[0, 4, 4, 0]}>
      {topDonorsData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % 6]} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

          </motion.div>
        </motion.div>

        {/* 2. Leaderboard */}
        <motion.div variants={itemVariants} className="bg-cyan-700 shadow-xl rounded-2xl p-6 overflow-hidden">
          <h2 className="text-3xl font-semibold mb-4 text-[#eca90e]">Top Supporters</h2>
          <div className="h-[300px] overflow-y-auto pr-2">
            <table className="w-full">
              <thead className="sticky top-0 bg-cyan-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left rounded-tl-lg">Rank</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-right rounded-tr-lg">Donations</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map(({ id, name, title, donations }, index) => (
                  <motion.tr 
                    key={id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-cyan-50' : 'bg-white'}`}
                  >
                    <td className="py-3 px-4">{id}</td>
                    <td className="py-3 px-4 font-medium">{name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        title === 'Visionary' ? 'bg-purple-100 text-purple-800' :
                        title === 'Champion' ? 'bg-blue-100 text-blue-800' :
                        title === 'Supporter' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {title}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{donations}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 3. Key Stats */}
        <motion.div variants={itemVariants} className="bg-cyan-700 shadow-xl rounded-2xl p-6">
          <h2 className="text-3xl font-semibold mb-4 text-[#eca90e]">Campaign Progress</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-medium text-white">Total Raised</h3>
              <p className="text-2xl font-bold text-white">₹{stats.totalRaised.toLocaleString()}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-[#eca90e] h-2.5 rounded-full" 
                  style={{ width: `${(stats.totalRaised / stats.target) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-yellow-500 mt-1">{Math.round((stats.totalRaised / stats.target) * 100)}% of ₹{stats.target.toLocaleString()} goal</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-medium text-yellow-500">Donors</h3>
                <p className="text-xl font-bold text-white">{stats.totalDonors}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-yellow-500">Avg Donation</h3>
                <p className="text-xl font-bold text-white">₹{stats.avgDonation}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-yellow-500">Biggest Donation</h3>
                <p className="text-xl font-bold text-white">₹{stats.biggestDonation}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-yellow-500">Completion</h3>
                <p className="text-xl font-bold text-white">{Math.round((stats.totalRaised / stats.target) * 100)}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Amount Raised Line Chart */}
        <motion.div variants={itemVariants} className="bg-cyan-700 shadow-xl rounded-2xl p-6 col-span-1 lg:col-span-2">
          <h2 className="text-3xl font-semibold mb-4 text-[#eca90e]">Monthly Performance</h2>
          <motion.div variants={chartVariants}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
                <YAxis yAxisId="right" orientation="right" stroke="#FF8042" />
                <Tooltip 
                  formatter={(value, name) => 
                    name === 'amount' ? [`₹${value}`, 'Amount'] : 
                    name === 'avg' ? [`₹${value}`, 'Average'] : 
                    [value, 'Donors']
                  } 
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="amount" 
                  name="Amount Raised" 
                  stroke="#0088FE" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  animationDuration={1500}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="donors" 
                  name="Number of Donors" 
                  stroke="#FF8042" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* 5. Donor Distribution Pie Chart */}
        <motion.div variants={itemVariants} className="bg-cyan-700 shadow-xl rounded-2xl p-6">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Donor Distribution</h2>
          <motion.div variants={chartVariants}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donorDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {donorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} donors`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* 6. Campaign Progress Ring Chart */}
        <motion.div variants={itemVariants} className="bg-cyan-700 shadow-xl rounded-2xl p-6">
          <h2 className="text-3xl font-semibold mb-4 text-[#eca90e]">Campaign Progress</h2>
          <motion.div variants={chartVariants}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignProgress}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={1500}
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FFBB28" />
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="text-xl font-bold fill-cyan-700"
                >
                  {Math.round((stats.totalRaised / stats.target) * 100)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* 7. Average Donation Over Time */}
        <motion.div variants={itemVariants} className="bg-cyan-700 shadow-xl rounded-2xl p-6 col-span-1 lg:col-span-2">
          <h2 className="text-3xl font-semibold mb-4 text-[#eca90e]">Average Donation Trend</h2>
          <motion.div variants={chartVariants}>
            <ResponsiveContainer width="100%" height={300}>
  <LineChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
    <XAxis dataKey="month" tick={{ fill: 'white' }} />
    <YAxis tick={{ fill: 'white' }} />
    <Tooltip formatter={(value) => [`₹${value}`, 'Average']} />
    <Line 
      type="monotone" 
      dataKey="avg" 
      name="Average Donation" 
      stroke="yellow" 
      strokeWidth={2} 
      dot={{ r: 4 }} 
      activeDot={{ r: 6 }} 
      animationDuration={1500}
    />
  </LineChart>
</ResponsiveContainer>

          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
    </div>
    
  );
};

export default Insights;
import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Zap, 
  Clock, 
  Database,
  CheckCircle,
  ArrowRight,
  Layers,
  FileText,
  Activity,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const features = [
  {
    icon: Package,
    title: 'Real-Time Stock Tracking',
    description: 'Monitor every item across multiple warehouses with live updates. Know exactly what you have, where it is, and when to reorder.',
    badge: 'Core Feature',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Investment History Management',
    description: 'Track purchase costs, supplier details, and investment trends over time. Make data-driven decisions with complete financial visibility.',
    badge: 'Analytics',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Smart Dashboard & Reports',
    description: 'Visualize stock levels, movement patterns, and profitability metrics at a glance. Export reports in seconds.',
    badge: 'Intelligence',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Automated Workflows',
    description: 'Streamline receipts, transfers, deliveries, and adjustments with guided digital processes. No more manual registers.',
    badge: 'Automation',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Layers,
    title: 'Multi-Warehouse Support',
    description: 'Manage inventory across unlimited locations. Track inter-warehouse transfers and balance stock effortlessly.',
    badge: 'Scalability',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Role-based access control, audit trails, and data encryption keep your business information safe and compliant.',
    badge: 'Security',
    gradient: 'from-red-500 to-rose-500',
  },
]

const stats = [
  { label: 'Inventory Accuracy', value: '99.5%', icon: CheckCircle },
  { label: 'Time Saved Daily', value: '4hrs', icon: Clock },
  { label: 'Cost Reduction', value: '35%', icon: TrendingUp },
]

const workflows = [
  {
    icon: FileText,
    title: 'Inbound Operations',
    description: 'Seamless receiving process',
    steps: ['Supplier Purchase Orders', 'Quality Inspection', 'Automated Stock-In', 'Location Assignment'],
  },
  {
    icon: Activity,
    title: 'Stock Management',
    description: 'Real-time control center',
    steps: ['Live Stock Ledger', 'Movement Tracking', 'Low-Stock Alerts', 'Batch & Serial Numbers'],
  },
  {
    icon: Package,
    title: 'Outbound & Delivery',
    description: 'Efficient fulfillment',
    steps: ['Sales Order Processing', 'Pick & Pack Optimization', 'Shipping Integration', 'Delivery Tracking'],
  },
]

const benefits = [
  '✓ Replace Excel sheets & manual registers',
  '✓ Eliminate stock discrepancies',
  '✓ Real-time visibility across all locations',
  '✓ Reduce operational costs by 30-40%',
  '✓ Make faster, data-driven decisions',
  '✓ Scale effortlessly as you grow',
]

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="relative">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/50">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">StockMaster</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Inventory Management System</div>
              </div>
            </div>
            <div className="hidden gap-8 md:flex text-sm">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#workflows" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Workflows</a>
              <a href="#benefits" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Benefits</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="rounded-xl p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/login" className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:scale-105">
                Get Started Free
              </Link>
            </div>
          </nav>

          <div className="mt-20 pb-20 grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-300 backdrop-blur-sm">
                <Zap className="h-4 w-4" />
                Digital Inventory Management
              </div>
              <h1 className="mt-8 text-5xl font-bold leading-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                Modernize Your
                <span className="block mt-2 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Stock Management
                </span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                A fully functional inventory management system that replaces Excel sheets, manual registers, and scattered tracking methods with a centralized, real-time platform.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link 
                  to="/register" 
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:scale-105"
                >
                  Start Tracking Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/5 px-8 py-4 text-lg font-semibold text-slate-900 dark:text-white backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  View Demo
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  Setup in 5 minutes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  Free forever plan
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">Live Dashboard Preview</div>
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div 
                        key={stat.label} 
                        className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/30 dark:to-slate-800/30 p-6 hover:border-primary-500/50 transition-all hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Icon className="h-4 w-4" />
                              {stat.label}
                            </div>
                            <div className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                          </div>
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20">
                            <Icon className="h-8 w-8 text-primary-400" />
                          </div>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-1000"
                            style={{ width: `${70 + index * 10}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 rounded-2xl border border-primary-500/20 bg-primary-500/10 p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20 flex-shrink-0">
                      <Database className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">"StockMaster eliminated all our tracking errors and saved us 4 hours every day!"</div>
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">— Operations Manager, TechRetail Co.</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-2xl"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Features Section */}
        <section id="features" className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-300 backdrop-blur-sm">
                <Activity className="h-4 w-4" />
                Powerful Features
              </div>
              <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Everything You Need to Master Inventory
              </h2>
              <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                A modular system that digitizes every aspect of stock management and investment tracking
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={feature.title} 
                    className="group relative rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 p-8 shadow-lg dark:shadow-none hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="mt-1 inline-flex rounded-full bg-slate-100 dark:bg-slate-700/50 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {feature.badge}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-6 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className={`h-1 rounded-full bg-gradient-to-r ${feature.gradient} transform origin-left transition-transform duration-500 group-hover:scale-x-100 scale-x-0`} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="relative py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4" />
                  Why Choose StockMaster
                </div>
                <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                  Replace Manual Processes with Digital Excellence
                </h2>
                <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Say goodbye to Excel sheets, scattered tracking, and manual registers. StockMaster provides real-time visibility, automated workflows, and actionable insights—all in one centralized platform.
                </p>
                <div className="mt-10 space-y-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 text-lg text-slate-700 dark:text-slate-300 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex-shrink-0 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105"
                  >
                    Start Your Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="rounded-3xl border border-slate-200/50 dark:border-white/10 bg-gradient-to-br from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 p-8 backdrop-blur-xl">
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="h-6 w-6 text-green-400" />
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">Stock Operations</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-300">Today's Receipts</span>
                          <span className="font-bold text-slate-900 dark:text-white">145 items</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-300">Pending Deliveries</span>
                          <span className="font-bold text-slate-900 dark:text-white">23 orders</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-300">Active Transfers</span>
                          <span className="font-bold text-slate-900 dark:text-white">8 transfers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="h-6 w-6 text-blue-400" />
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Investment Insights</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-300">Total Inventory Value</span>
                          <span className="font-bold text-slate-900 dark:text-white">$248,500</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-300">Monthly Growth</span>
                          <span className="font-bold text-green-400">+12.5%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-300">ROI This Quarter</span>
                          <span className="font-bold text-green-400">+18.2%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Activity className="h-6 w-6 text-purple-400" />
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Live Alerts</div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></div>
                          Low stock alert: Widget A
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                          Receipt completed: Order #1245
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-8 -left-8 h-32 w-32 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflows Section */}
        <section id="workflows" className="relative py-24 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-700 dark:text-cyan-300 backdrop-blur-sm">
                <Layers className="h-4 w-4" />
                Streamlined Workflows
              </div>
              <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Digitize Every Stock Operation
              </h2>
              <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                From receiving to delivery, manage all inventory movements with guided, automated workflows
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {workflows.map((flow, index) => {
                const Icon = flow.icon
                return (
                  <div 
                    key={flow.title} 
                    className="group relative rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900/80 p-8 backdrop-blur-sm hover:border-cyan-500/50 transition-all hover:scale-[1.05] hover:shadow-2xl hover:shadow-cyan-500/20"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                        <Icon className="h-8 w-8 text-cyan-400" />
                      </div>
                      <div className="text-5xl font-bold text-slate-900/5 dark:text-white/5 group-hover:text-slate-900/10 dark:group-hover:text-white/10 transition-colors">
                        0{index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {flow.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{flow.description}</p>
                    
                    <div className="space-y-3">
                      {flow.steps.map((step, stepIndex) => (
                        <div 
                          key={step} 
                          className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 flex-shrink-0 group-hover:bg-cyan-500/20 transition-all">
                            <div className="text-xs font-bold text-cyan-400">{stepIndex + 1}</div>
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
                      <div className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left transition-transform duration-700 group-hover:scale-x-100 scale-x-0" />
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-16 rounded-3xl border border-primary-500/30 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 p-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex-shrink-0">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Seamless Integrations</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Connect with your existing ERP, e-commerce platforms, and carrier services through our REST APIs and pre-built connectors. No code required.
                  </p>
                </div>
                <Link 
                  to="/register" 
                  className="rounded-xl bg-slate-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  Explore Integrations
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="relative py-24 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-[150px]" />
          </div>
          
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 p-12 md:p-16 text-center backdrop-blur-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300 backdrop-blur-sm mb-8">
                <Zap className="h-4 w-4" />
                Ready in 5 Minutes
              </div>
              
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                Start Managing Inventory
                <span className="block mt-2 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  The Modern Way
                </span>
              </h2>
              
              <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Join hundreds of businesses that have replaced manual tracking with StockMaster. No credit card required. Free forever plan available.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/register" 
                  className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:scale-105"
                >
                  Create Free Account
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-3 rounded-xl border-2 border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-white/5 px-10 py-5 text-lg font-semibold text-slate-900 dark:text-white backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">5 min</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Setup Time</div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">0 $</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Forever Plan</div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">StockMaster</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">by Odoo Hacks</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Modern inventory management system built for businesses ready to leave manual tracking behind.
              </p>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Product</div>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <a href="#features" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
                <a href="#workflows" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Workflows</a>
                <a href="#benefits" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Benefits</a>
                <Link to="/register" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Company</div>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <Link to="/login" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Register</Link>
                <a href="#" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
                <a href="#" className="block hover:text-slate-900 dark:hover:text-white transition-colors">Support</a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 text-center text-sm text-slate-500 dark:text-slate-500">
            <p>© {new Date().getFullYear()} StockMaster. Built for modern operations teams.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

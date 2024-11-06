export const metrics = {
  total: 24,
  onTrack: 18,
  inProgress: 20,
  teams: 8,
};

export interface KPI {
  metric: string;
  target: string;
  current: string;
  status: 'on-track' | 'at-risk' | 'behind';
}

export interface Resource {
  type: 'human' | 'financial' | 'time';
  description: string;
  allocation: string;
  status: 'allocated' | 'pending' | 'at-risk';
}

export interface TimeEntry {
  task: string;
  hours: number;
  date: string;
  user: string;
}

export interface Document {
  title: string;
  type: 'guide' | 'template' | 'policy';
  url: string;
}

export interface Integration {
  platform: string;
  requirements: string[];
  status: 'connected' | 'pending' | 'failed';
}

export interface Initiative {
  id: number;
  projectId: string;
  title: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  dueDate: string;
  department: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  type: 'strategic' | 'operational' | 'tactical';
  stage: 'kickoff' | 'planning' | 'execution' | 'monitoring' | 'closing';
  objectives: string[];
  stakeholders: string[];
  kpis: KPI[];
  resourceRequirements: Resource[];
  timeTracking: TimeEntry[];
  documentation: Document[];
  integrations: Integration[];
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  timeline: {
    start: string;
    estimatedCompletion: string;
    phases: {
      name: string;
      duration: number;
      status: 'completed' | 'in-progress' | 'pending';
    }[];
  };
}

export const initiatives: Initiative[] = [
  {
    id: 1,
    projectId: "HR-2024-001",
    title: "Employee Experience Enhancement Program",
    owner: "Sarah Johnson",
    progress: 75,
    status: "on-track",
    dueDate: "2024-06-30",
    department: "HR Operations",
    category: "Employee Experience",
    priority: "high",
    type: "strategic",
    stage: "execution",
    description: "A comprehensive program aimed at improving employee satisfaction and engagement through various workplace initiatives and policy improvements.",
    objectives: [
      "Increase employee satisfaction score by 25%",
      "Reduce turnover rate by 15%",
      "Implement new feedback system",
      "Launch wellness program"
    ],
    stakeholders: ["HR Team", "Department Heads", "Employee Representatives", "Executive Board"],
    kpis: [
      {
        metric: "Employee Satisfaction Score",
        target: "85%",
        current: "72%",
        status: "at-risk"
      },
      {
        metric: "Employee Turnover Rate",
        target: "12%",
        current: "15%",
        status: "behind"
      }
    ],
    resourceRequirements: [
      {
        type: "human",
        description: "HR Specialists",
        allocation: "3 FTE",
        status: "allocated"
      },
      {
        type: "financial",
        description: "Program Budget",
        allocation: "$150,000",
        status: "allocated"
      }
    ],
    timeTracking: [
      {
        task: "Employee Survey Analysis",
        hours: 24,
        date: "2024-03-15",
        user: "Sarah Johnson"
      }
    ],
    documentation: [
      {
        title: "Project Charter",
        type: "template",
        url: "https://example.com/charter"
      }
    ],
    integrations: [
      {
        platform: "Workday",
        requirements: ["API Access", "Data Sync"],
        status: "connected"
      }
    ],
    budget: {
      allocated: 150000,
      spent: 95000,
      currency: "USD"
    },
    timeline: {
      start: "2024-01-01",
      estimatedCompletion: "2024-06-30",
      phases: [
        { name: "Planning", duration: 4, status: "completed" },
        { name: "Implementation", duration: 8, status: "in-progress" },
        { name: "Evaluation", duration: 4, status: "pending" }
      ]
    }
  },
  {
    id: 2,
    projectId: "HR-2024-002",
    title: "Performance Management System Upgrade",
    owner: "Michael Chen",
    progress: 45,
    status: "at-risk",
    dueDate: "2024-08-15",
    department: "Talent Management",
    category: "Performance",
    priority: "high",
    type: "operational",
    stage: "execution",
    description: "Modernizing our performance review system with new tools and methodologies to better track and develop talent.",
    objectives: [
      "Implement continuous feedback system",
      "Integrate with learning management system",
      "Train managers on new framework"
    ],
    stakeholders: ["IT Team", "HR Team", "Management"],
    kpis: [
      {
        metric: "Manager Adoption Rate",
        target: "90%",
        current: "65%",
        status: "at-risk"
      }
    ],
    resourceRequirements: [
      {
        type: "human",
        description: "IT Support",
        allocation: "2 FTE",
        status: "allocated"
      }
    ],
    timeTracking: [],
    documentation: [],
    integrations: [],
    budget: {
      allocated: 200000,
      spent: 120000,
      currency: "USD"
    },
    timeline: {
      start: "2024-02-01",
      estimatedCompletion: "2024-08-15",
      phases: [
        { name: "Analysis", duration: 4, status: "completed" },
        { name: "Development", duration: 6, status: "in-progress" }
      ]
    }
  },
  {
    id: 4,
    projectId: "HR-2024-004",
    title: "Benefits Optimization Initiative",
    owner: "James Wilson",
    progress: 30,
    status: "delayed",
    dueDate: "2024-09-30",
    department: "Benefits Administration",
    category: "Benefits",
    priority: "medium",
    type: "operational",
    stage: "planning",
    description: "Reviewing and optimizing employee benefits package to improve competitiveness and satisfaction.",
    objectives: [
      "Conduct market analysis",
      "Survey employee preferences",
      "Implement new benefits platform"
    ],
    stakeholders: ["HR Team", "Finance", "Employee Representatives"],
    kpis: [],
    resourceRequirements: [],
    timeTracking: [],
    documentation: [],
    integrations: [],
    budget: {
      allocated: 100000,
      spent: 25000,
      currency: "USD"
    },
    timeline: {
      start: "2024-03-01",
      estimatedCompletion: "2024-09-30",
      phases: [
        { name: "Analysis", duration: 3, status: "in-progress" },
        { name: "Implementation", duration: 6, status: "pending" }
      ]
    }
  },
  {
    id: 5,
    projectId: "HR-2024-005",
    title: "Remote Work Policy Enhancement",
    owner: "Emily Chang",
    progress: 60,
    status: "on-track",
    dueDate: "2024-07-15",
    department: "HR Operations",
    category: "Policy",
    priority: "medium",
    type: "tactical",
    stage: "execution",
    description: "Updating remote work policies and procedures to better support hybrid workforce.",
    objectives: [
      "Review current policies",
      "Develop new guidelines",
      "Create training materials"
    ],
    stakeholders: ["HR Team", "Legal", "Department Heads"],
    kpis: [],
    resourceRequirements: [],
    timeTracking: [],
    documentation: [],
    integrations: [],
    budget: {
      allocated: 50000,
      spent: 30000,
      currency: "USD"
    },
    timeline: {
      start: "2024-02-15",
      estimatedCompletion: "2024-07-15",
      phases: [
        { name: "Review", duration: 4, status: "completed" },
        { name: "Development", duration: 4, status: "in-progress" }
      ]
    }
  }
];

export const updates = [
  {
    id: 1,
    initiative: "Employee Experience Enhancement Program",
    message: "Completed phase 2 of implementation. User feedback has been positive.",
    timestamp: "2 hours ago",
    user: "Sarah Johnson",
    type: "milestone"
  },
  {
    id: 2,
    initiative: "Performance Management System Upgrade",
    message: "Integration testing revealed compatibility issues. Team working on fixes.",
    timestamp: "4 hours ago",
    user: "Michael Chen",
    type: "status"
  },
  {
    id: 4,
    initiative: "Benefits Optimization Initiative",
    message: "Market analysis phase delayed due to data collection challenges.",
    timestamp: "2 days ago",
    user: "James Wilson",
    type: "status"
  },
  {
    id: 5,
    initiative: "Remote Work Policy Enhancement",
    message: "Draft policy document completed and sent for legal review.",
    timestamp: "3 days ago",
    user: "Emily Chang",
    type: "milestone"
  }
] as const;
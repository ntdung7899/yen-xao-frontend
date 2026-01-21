// Salary-related types and interfaces

export interface SalaryRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    departmentId: string;
    departmentName: string;
    positionId: string;
    positionName: string;

    // Salary components
    baseSalary: number;
    allowances: {
        housing?: number;
        transport?: number;
        meal?: number;
        phone?: number;
        other?: number;
    };
    bonuses: {
        performance?: number;
        project?: number;
        holiday?: number;
        other?: number;
    };

    // Deductions
    deductions: {
        insurance?: number;
        tax?: number;
        advance?: number;
        other?: number;
    };

    // Calculated fields
    totalAllowances: number;
    totalBonuses: number;
    totalDeductions: number;
    grossSalary: number; // Base + Allowances + Bonuses
    netSalary: number; // Gross - Deductions

    // Metadata
    effectiveDate: string;
    lastUpdated: string;
    updatedBy: string;
    status: 'active' | 'pending' | 'archived';
    notes?: string;
}

export interface SalaryHistory {
    id: string;
    employeeId: string;
    records: SalaryRecord[];
}

export interface SalaryFormData {
    employeeId: string;
    baseSalary: number;
    allowances: {
        housing?: number;
        transport?: number;
        meal?: number;
        phone?: number;
        other?: number;
    };
    bonuses: {
        performance?: number;
        project?: number;
        holiday?: number;
        other?: number;
    };
    deductions: {
        insurance?: number;
        tax?: number;
        advance?: number;
        other?: number;
    };
    effectiveDate: string;
    notes?: string;
}

export interface SalaryFilters {
    departmentId?: string;
    positionId?: string;
    minSalary?: number;
    maxSalary?: number;
    status?: 'active' | 'pending' | 'archived';
    search?: string;
}

export declare enum TaskStatus {
    Pending = "pending",
    InProgress = "in_progress",
    Completed = "completed"
}
export declare class Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    createdById: string;
    assignedToId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export declare enum TaskStatus {
    Pending = "pending",
    InProgress = "inprogress",
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

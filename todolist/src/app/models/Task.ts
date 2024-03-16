type Status = 'New' | 'In progress' | 'Completed';
type Priority = 'Low' | 'Medium' | 'High';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  date: Date;
};

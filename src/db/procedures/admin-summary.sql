DROP PROCEDURE IF EXISTS sp_get_admin_task_summary;

CREATE PROCEDURE sp_get_admin_task_summary()
BEGIN
  SELECT
    COUNT(*) AS total_count,
    SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) AS todo_count,
    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_count,
    SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done_count,
    SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS high_priority_count,
    SUM(CASE WHEN due_date IS NOT NULL AND due_date < CURRENT_DATE AND status <> 'done' THEN 1 ELSE 0 END) AS overdue_count
  FROM tasks;
END;

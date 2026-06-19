DROP PROCEDURE IF EXISTS sp_get_user_task_dashboard;

CREATE PROCEDURE sp_get_user_task_dashboard(
  IN p_user_id VARCHAR(36),
  IN p_search VARCHAR(160),
  IN p_status VARCHAR(32),
  IN p_priority VARCHAR(32),
  IN p_sort_by VARCHAR(32),
  IN p_sort_order VARCHAR(4),
  IN p_limit INT,
  IN p_offset INT
)
BEGIN
  SELECT
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.assignee_id,
    t.created_by,
    t.due_date,
    t.created_at,
    t.updated_at,
    u.name AS assignee_name,
    c.name AS creator_name
  FROM tasks t
  INNER JOIN users u ON u.id = t.assignee_id
  INNER JOIN users c ON c.id = t.created_by
  WHERE t.assignee_id = p_user_id
    AND (p_search IS NULL OR p_search = '' OR t.title LIKE CONCAT('%', p_search, '%') OR t.description LIKE CONCAT('%', p_search, '%'))
    AND (p_status IS NULL OR p_status = '' OR t.status = p_status)
    AND (p_priority IS NULL OR p_priority = '' OR t.priority = p_priority)
  ORDER BY
    CASE WHEN p_sort_by = 'priority' AND p_sort_order = 'asc' THEN FIELD(t.priority, 'low', 'medium', 'high') END ASC,
    CASE WHEN p_sort_by = 'priority' AND p_sort_order = 'desc' THEN FIELD(t.priority, 'high', 'medium', 'low') END ASC,
    CASE WHEN p_sort_by = 'dueDate' AND p_sort_order = 'asc' THEN t.due_date END ASC,
    CASE WHEN p_sort_by = 'dueDate' AND p_sort_order = 'desc' THEN t.due_date END DESC,
    t.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;

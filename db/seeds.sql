INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('IT'),
  ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Sales Lead', '100000', 1),
  ('Salesperson', '80000', 1),
  ('Lead Engineer', '150000', 2),
  ('Software Engineer', '120000', 2),
  ('IT Tech', '100000', 3),
  ('IT Manager', '120000', 3),
  ('Accountant', '125000', 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Katherine', 'Mansfield', 2, 1),
  ('Mike', 'Chan', 2, 1),
  ('Dora', 'Carrington', 3, NULL),
  ('Octavia', 'Butler', 4, 4),
  ('Piers', 'Gaveston', 4, 4),
  ('Unica', 'Zurn', 6, NULL),
  ('Virginia', 'Woolf', 5, 7),
  ('Charles', 'LeRoi', 5, 7),
  ('Edward', 'Bellamy', 7, NULL),
  ('Montague', 'Summers', 7, NULL);
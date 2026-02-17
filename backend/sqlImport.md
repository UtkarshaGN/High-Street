# MySQL CLI Import Guide (Windows – New User & Password)

This document explains how to import a `.sql` file into a MySQL database on **Windows** using the **Command Prompt (CLI)** with a **newly created MySQL user and password**.

---

## Prerequisites (Windows)

* MySQL Server installed (via MySQL Installer)
* MySQL service running
* Root (admin) MySQL credentials available
* A `.sql` file ready to import

---

## Step 1: Open Command Prompt

Press:

```
Win + R → type cmd → Enter
```

(Optional) Run Command Prompt as **Administrator**.

---

## Step 2: Navigate to MySQL `bin` Directory

Most common paths:

```bat
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
```

Older versions:

```bat
cd "C:\Program Files\MySQL\MySQL Server 5.7\bin"
```

Verify MySQL:

```bat
mysql --version
```

---

## Step 3: Login as Root User

```bat
mysql -u root -p
```

Enter the **root password**.

---

## Step 4: Create a New Database User

```sql
CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'StrongPassword123';
```

Replace:

* `blog_user` → your username
* `StrongPassword123` → a strong password

---

## Step 5: Create the Database

```sql
CREATE DATABASE blog_db;
```

---

## Step 6: Grant Permissions

```sql
GRANT ALL PRIVILEGES ON blog_db.* TO 'blog_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Step 7: Exit MySQL

```sql
EXIT;
```

⚠️ Import must be done from **Windows CMD**, not inside the MySQL shell.

---

## Step 8: Import the SQL File

### Syntax

```bat
mysql -u blog_user -p blog_db < "C:\full\path\to\file.sql"
```

### Example

```bat
mysql -u blog_user -p blog_db < "C:\Users\YourName\Desktop\blog_schema.sql"
```

Enter the **new user password** when prompted.

---

## Step 9: Verify Import

```bat
mysql -u blog_user -p
```

```sql
USE blog_db;
SHOW TABLES;
```

---

## Common Windows Errors & Fixes

### `'mysql' is not recognized`

Navigate to MySQL `bin` directory or add it to **Environment Variables → PATH**.

---

### ERROR 1045 (Access denied)

Try:

```bat
mysql -u blog_user -p --protocol=tcp
```

---

### ERROR 1044 (No database access)

Grant permissions again as root:

```sql
GRANT ALL PRIVILEGES ON blog_db.* TO 'blog_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Quick Checklist

* MySQL service running
* Correct MySQL path
* Database exists
* User has permissions
* SQL file path in quotes

---

✅ You are now ready to import MySQL databases on **Windows** using CLI.

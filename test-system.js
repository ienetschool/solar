import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;

async function runTests() {
  const connection = await mysql.createConnection(dbUrl);
  console.log('=== GREEN POWER SOLUTIONS - SYSTEM TEST ===\n');
  
  // Test 1: Create test users with different roles
  console.log('TEST 1: Creating test users...');
  
  const testUsers = [
    {
      username: 'john.customer@test.com',
      email: 'john.customer@test.com',
      password: 'password123',
      fullName: 'John Customer',
      role: 'customer',
      phone: '555-0001'
    },
    {
      username: 'sarah.agent@test.com',
      email: 'sarah.agent@test.com',
      password: 'password123',
      fullName: 'Sarah Agent',
      role: 'agent',
      phone: '555-0002'
    },
    {
      username: 'admin@test.com',
      email: 'admin@test.com',
      password: 'password123',
      fullName: 'System Admin',
      role: 'admin',
      phone: '555-0003'
    }
  ];

  for (const user of testUsers) {
    try {
      const [result] = await connection.execute(
        `INSERT INTO users (id, username, email, password, full_name, role, phone, created_at, updated_at) 
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE role = VALUES(role), full_name = VALUES(full_name)`,
        [user.username, user.email, user.password, user.fullName, user.role, user.phone]
      );
      console.log(`  ✓ Created ${user.role}: ${user.fullName} (${user.email})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  ℹ ${user.role} already exists: ${user.email}`);
      } else {
        console.error(`  ✗ Error creating ${user.email}:`, error.message);
      }
    }
  }

  // Test 2: Verify users created
  console.log('\nTEST 2: Verifying users in database...');
  const [users] = await connection.execute('SELECT id, username, email, role, full_name FROM users ORDER BY role, username LIMIT 10');
  console.log(`  Found ${users.length} users:`);
  users.forEach(u => {
    console.log(`    - ${u.role.padEnd(10)} | ${u.full_name.padEnd(20)} | ${u.email}`);
  });

  // Test 3: Check existing tickets
  console.log('\nTEST 3: Checking existing tickets...');
  const [tickets] = await connection.execute('SELECT id, subject, status, priority FROM tickets LIMIT 5');
  console.log(`  Found ${tickets.length} tickets`);
  tickets.forEach(t => {
    console.log(`    - #${t.id.substring(0, 8)} | ${t.subject} | Status: ${t.status} | Priority: ${t.priority}`);
  });

  // Test 4: Check callback requests
  console.log('\nTEST 4: Checking callback requests...');
  const [callbacks] = await connection.execute('SELECT id, reference_number, customer_name, status FROM callback_requests LIMIT 5');
  console.log(`  Found ${callbacks.length} callback requests`);
  callbacks.forEach(c => {
    console.log(`    - Ref: ${c.reference_number} | ${c.customer_name} | Status: ${c.status}`);
  });

  // Test 5: Check notifications
  console.log('\nTEST 5: Checking notifications...');
  const [notifications] = await connection.execute('SELECT id, type, title, is_read FROM notifications LIMIT 5');
  console.log(`  Found ${notifications.length} notifications`);
  notifications.forEach(n => {
    console.log(`    - ${n.type.padEnd(15)} | ${n.title.substring(0, 40)} | Read: ${n.is_read}`);
  });

  // Test 6: Check live chat sessions
  console.log('\nTEST 6: Checking live chat sessions...');
  const [sessions] = await connection.execute('SELECT id, status FROM live_chat_sessions LIMIT 5');
  console.log(`  Found ${sessions.length} live chat sessions`);
  sessions.forEach(s => {
    console.log(`    - Session #${s.id.substring(0, 8)} | Status: ${s.status}`);
  });

  await connection.end();
  console.log('\n=== TEST SUMMARY COMPLETE ===');
}

runTests().catch(console.error);

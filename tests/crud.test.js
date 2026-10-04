const { test } = require('node:test');
const assert = require('node:assert/strict');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const pid = `CI-${Date.now()}`; // mỗi lần chạy dùng pid riêng, không đụng dữ liệu cũ

const call = (path, method = 'GET', body) =>
  fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

test('GET /health trả ok', async () => {
  const res = await call('/health');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('CREATE: thêm sản phẩm trả 201', async () => {
  const res = await call('/api/products', 'POST', {
    pid, pname: 'Laptop CI', price: 1000, quantity: 5,
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.pid, pid);
  assert.ok(data._id);
});

test('CREATE: trùng pid trả 409', async () => {
  const res = await call('/api/products', 'POST', {
    pid, pname: 'Trung', price: 1, quantity: 1,
  });
  assert.equal(res.status, 409);
});

test('CREATE: thiếu dữ liệu trả 400', async () => {
  const res = await call('/api/products', 'POST', { pid: `${pid}-x` });
  assert.equal(res.status, 400);
});

test('READ: danh sách có chứa sản phẩm vừa tạo', async () => {
  const res = await call('/api/products');
  assert.equal(res.status, 200);
  const list = await res.json();
  assert.ok(list.some((p) => p.pid === pid));
});

test('READ: lấy một sản phẩm theo pid', async () => {
  const res = await call(`/api/products/${pid}`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).pname, 'Laptop CI');
});

test('UPDATE: sửa giá và số lượng', async () => {
  const res = await call(`/api/products/${pid}`, 'PUT', { price: 900, quantity: 3 });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.price, 900);
  assert.equal(data.quantity, 3);
});

test('DELETE: xóa sản phẩm', async () => {
  const res = await call(`/api/products/${pid}`, 'DELETE');
  assert.equal(res.status, 200);
});

test('READ sau khi xóa trả 404', async () => {
  const res = await call(`/api/products/${pid}`);
  assert.equal(res.status, 404);
});